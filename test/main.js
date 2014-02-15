(function() {
  'use strict';

  describe('XO.main()', function() {
    beforeEach(function() {
      this.sinon.stub(XO.Firebase, 'main');

      XO.main();
    });

    it('calls XO.Firebase.main', function() {
      expect(XO.Firebase.main).to.have.been.called;
    });

    it('initializes XO.AuthenticationService', function() {
      expect(XO.AuthenticationService).to.have.property('authenticateUser').that.is.a('function');
    });

    it('initializes XO.DataStorageService', function() {
      expect(XO).to.have.property('DataStorageService').that.is.an.object;
    });
  });

}());
