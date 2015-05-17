//jasmine assertions etc.
//http://jasmine.github.io/2.0/introduction.html

//Protractor api and locators
//http://angular.github.io/protractor/#/api
//https://github.com/angular/protractor/blob/master/docs/locators.md

var speciesMap = {
    searchInput: element(by.model('Suggest.species')),
    dropMenuItems: element.all(by.css('#SuggestController .dropdown-menu>li')),
    get: function () {
        browser.get('http://localhost:8080/');
    },
    setSearchString: function (searchString) {
        this.searchInput.sendKeys(searchString);
    }
};

describe('gbif map', function () {
    it('should open a droplist', function () {
        speciesMap.get();
        var items = speciesMap.dropMenuItems;
        expect(items.count()).toEqual(0);
        speciesMap.setSearchString('puma conco');
        expect(items.count()).toBeGreaterThan(0);
    });
    
    it('should never scroll horizontally', function () {
        browser.manage().window().setSize(320, 480);
        browser.executeScript(
            'return Math.abs(document.documentElement.clientWidth - document.body.scrollWidth);'
        ).then( function(sizeDiff){
            expect(sizeDiff).toBeLessThan(4);
        });
    });
});