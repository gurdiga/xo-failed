(function() {
  'use strict';

  describe('XO.main()', function() {
    beforeEach(function() {
      this.sinon.stub(XO.Firebase, 'main');
      this.sinon.stub(XO, 'FirebaseAuthenticationService').returns('FirebaseAuthenticationService');
      this.sinon.stub(XO, 'FirebaseDataService').returns('FirebaseDataService');

      XO.main();
    });

    it('calls XO.Firebase.main', function() {
      expect(XO.Firebase.main).to.have.been.called;
    });

    it('initializes XO.AuthenticationService to XO.FirebaseAuthenticationService()', function() {
      expect(XO.FirebaseAuthenticationService).to.have.been.calledWith(XO.Firebase.SimpleLogin);
      expect(XO.AuthenticationService).to.equal(XO.FirebaseAuthenticationService());
    });

    it('initializes XO.DataService to XO.FirebaseDataService()', function() {
      expect(XO.FirebaseDataService).to.have.been.calledWith(
        XO.Firebase.ref,
        XO.Firebase.$firebase,
        XO.Firebase.angularScope
      );
      expect(XO.DataService).to.equal(XO.FirebaseDataService());
    });
  });

}());
