(function() {
  'use strict';

  describe('Angular glue for XO.Deferred', function() {
    it('registers it as an injectable module', function() {
      var injected = angular.injector(['XO']).get('Deferrable');

      expect(injected).to.equal(XO.Deferrable);
    });
  });

}());
