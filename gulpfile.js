var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css')
var hash = require('gulp-hash-filename');
var gutil = require('gulp-util');
var del = require('del');
var inject = require('gulp-inject');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var karma = require('karma').server;


/*******************/
/** Configuration **/
/*******************/
var isProduction = !!gutil.env.production;
var isTDD = !!gutil.env.tdd;

var paths = {
    js_vendor: [
        './bower_components/**/angular.min.js',
        './bower_components/**/angular.min.js.map',
        './bower_components/**/ui-bootstrap-tpls.min.js',
        './bower_components/**/leaflet.js',
    ],
    js: [
        './bower_components/**/angular-leaflet-directive.min.js',
        './src/app/app.js',
        './src/app/map.js',
        './src/app/suggest.js',
        './src/app/layerlist.js',
    ],
    scss: [
        'src/scss/main.scss'
    ],
    html: [
        'src/app/**/*.html'
    ],
    lint: [
        'src/**/*.js',
        '!src/**/*-spec.js'
    ]
}

/***********/
/** Tasks **/
/***********/

gulp.task('build', function(callback) {
    runSequence(
        ['clean', 'lint'],
        'html',
        'scripts',
        'scss',
        callback);
});

gulp.task('dev', function(callback) {
    runSequence(
        'build',
        callback);
});

gulp.task('devTDD', function(callback) {
    runSequence(
        'build',
        'tdd',
        callback);
});

gulp.task('prod', function(callback) {
    runSequence(
        'build',
        'test',
        callback);
});


/** Test  **/
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('tdd', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done);
});

/** Clean **/
gulp.task('clean', function (cb) {
    del(['dist/**/*.*', '!dist/vendor/**/*.*'], cb);
});
gulp.task('clean-js-vendor', function (cb) {
    del(['dist/vendor/**/*.js'], cb);
});

/** Create **/
// Generate html
gulp.task('html', function () {
    return gulp.src(paths.html)
        .pipe(gulp.dest('dist'));
});

//Compile sass
gulp.task('scss', function () {
    var cssStream = gulp.src(paths.scss)
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(minifyCSS())
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(isProduction ? hash({"format": "{name}-{hash}{ext}"}) : gutil.noop())
        .pipe(gulp.dest('dist/css'));
    
    return gulp.src('./dist/**/*.html')
        .pipe(inject(cssStream, {read: false, ignorePath: 'dist/', addRootSlash: false, name: 'style'}))
        .pipe(gulp.dest('./dist'));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src(paths.lint)
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }));
});

// Concatenate and minify js. Hash filename to avoid user caching.
gulp.task('scripts', function () {
    var appStream = gulp.src(paths.js)
        .pipe(isProduction ? concat('app.js') : gutil.noop())
        .pipe(gulp.dest('dist/js'))
        .pipe(isProduction ? rename('app.min.js') : gutil.noop())
        .pipe(isProduction ? uglify() : gutil.noop())
        .pipe(isProduction ? hash({ "format": "{name}-{hash}{ext}" }) : gutil.noop())
        .pipe(gulp.dest('dist/js'));
    
    return gulp.src('./dist/**/*.html')
        .pipe(inject(appStream, {read: false, ignorePath: 'dist/', addRootSlash: false, name: 'app'}))
        .pipe(gulp.dest('./dist'));
});

// Minify vendor scripts and copy to dist
gulp.task('vendorScripts', ['clean-js-vendor'], function () {
    return gulp.src(paths.js_vendor)
        .pipe(gulp.dest('dist/vendor'));
    //TODO use bower main files, inject and rewrite to cdn with fallback.
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch(['src/**/*.js', 'src/**/*.scss', 'src/**/*.html'], ['build']);
});

// Default Task
if (isProduction)
    gulp.task('default', ['vendorScripts', 'prod']);
else if (isTDD)
    gulp.task('default', ['vendorScripts', 'devTDD', 'watch']);
else
    gulp.task('default', ['vendorScripts', 'dev', 'watch']);