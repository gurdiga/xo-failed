(function() {
  'use strict';

  describe('XO.AuthenticationService module', function() {
    it('defines the createUser function', function() {
      expect(XO.AuthenticationService).to.have.property('createUser').that.is.a('function');
    });

    it('defines the authenticateUser function', function() {
      expect(XO.AuthenticationService).to.have.property('authenticateUser').that.is.a('function');
    });
  });

}());
