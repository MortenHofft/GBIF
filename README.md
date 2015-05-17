#GBIF species viewer sample app

This is a sample js app that allows users to search the GBIF database for species and view them on a map.

* **Data**: GBIF
* **Front end**: Angular and Leaflet
* **Build tool**: Gulp
* **Package management**: NPM and Bower
* **Test**: Karma, Jasmine and Protractor

##Building and testing
First install any development dependencies. This is needed to build the application.
```
$ npm install
```
Then install front end dependencies using bower.
```
$ bower install
```
or if Bower is not install globally: `node node_modules/bower/bin/bower install`

###Build
Build and watch
```
$ gulp
```
or if Gulp is not installed globally: `node node_modules/gulp/bin/gulp.js`.

To build, watch and continuous unit test - for test driven development - use `--tdd`
```
$ gulp --tdd
```
Build for production - i.e. bundled, unit tested and without watch.
```
$ gulp --production
```
###Test
It is also possible to run tests separately. To run unit tests: `$ npm test`
To run end to end tests [Protractor](http://angular.github.io/protractor/#/) should be installed.
```
$ npm install -g protractor
$ webdriver-manager update
$ webdriver-manager start
```
Serve the static files in `./dist` at `http://localhost:8080/` - for example using `http-server ./dist` - and run the e2e tests using:
```
$ protractor protractor.conf.js
```
