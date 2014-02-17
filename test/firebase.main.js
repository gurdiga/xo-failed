(function() {
  'use strict';

  /*global Firebase*/
  describe('XO.Firebase', function() {
    beforeEach(function() {
      XO.Firebase.main();
    });

    describe('main', function() {
      it('sets XO.Firebase.ref', function() {
        expect(XO.Firebase.ref).to.be.an.instanceof(Firebase);
      });

      it('sets XO.Firebase.SimpleLogin', function() {
        expect(XO.Firebase.SimpleLogin).to.have.property('$changePassword').to.be.a('function');
      });

      it('sets XO.Firebase.$firebase', function() {
        expect(XO.Firebase.$firebase).to.be.a('function');
      });

      it('sets XO.Firebase.angularScope', function() {
        expect(XO.Firebase.angularScope).to.be.an('object');
      });
    });
  });

}());
