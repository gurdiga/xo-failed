(function() {
  'use strict';

  describe('Angular service for XO.Firebase', function() {
    it('registers it as an injectable module', function() {
      var injected = angular.injector(['XO']).get('Firebase');

      expect(injected).to.equal(XO.Firebase);
    });
  });

}());
