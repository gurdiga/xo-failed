(function() {
  'use strict';

  describe('XO.main()', function() {
    beforeEach(function() {
      XO.main();
    });

    it('initializes XO.AuthenticationService', function() {
      expect(XO).to.have.property('AuthenticationService').that.is.an.object;
    });

    it('initializes XO.DataStorageService', function() {
      expect(XO).to.have.property('DataStorageService').that.is.an.object;
    });
  });

}());
