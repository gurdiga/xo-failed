(function() {
  'use strict';

  describe('XO.Firebase', function() {
    it('is an alias for the Firebase library', function() {
      expect(XO.Firebase).to.be.a('function');
      expect(XO.Firebase).to.have.property('goOffline').that.is.a('function');
    });

    it('aliases the FirebaseSimpleLogin global to XO.Firebase.SimpleLogin', function() {
      expect(XO.Firebase.SimpleLogin).to.be.a('function');
    });
  });

}());
