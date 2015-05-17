describe('SuggestController', function () {
    var $controller;
    beforeEach(module('mapApp'));
    
    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));
    
    describe('Species object validation', function () {
        it('Should return false if species object does not have property "speciesKey"', function () {
            var controller = $controller('SuggestController');
            controller.species = {};
            expect(controller.isValid()).toEqual(false);
        });
    });
});

describe('Shared layers model', function () {
    beforeEach(module('mapApp'));

    beforeEach(inject(function(_layers_){
        layers = _layers_;
    }));
    
    it('can get an instance of shared layers', function () {
        expect(layers).toBeDefined();
    });

    it('will return a color scheme for any list length', function () {
        layers.list = [];
        layers.colors = ['yellows_reds', 'blues', 'greens'];
        expect(layers.getNextColorScheme()).toEqual('yellows_reds');
        layers.list = [1];
        expect(layers.getNextColorScheme()).toEqual('blues');
        layers.list = [1,2];
        expect(layers.getNextColorScheme()).toEqual('greens');
        layers.list = [1,2,3];
        expect(layers.getNextColorScheme()).toEqual('yellows_reds');
    });
});