(function() {
  'use strict';

  describe('Angular glue for XO.Executor', function() {
    beforeEach(function() {
      this.sinon.stub(XO, 'Executor');
    });

    it('registers it as an injectable module', function() {
      var injected = angular.injector(['XO']).get('Executor');

      expect(injected).to.be.an('object');
      expect(XO.Executor).to.have.been.calledWith(
        XO.AuthenticationService,
        XO.generatePassword,
        XO.DataService
      );
    });
  });

}());
