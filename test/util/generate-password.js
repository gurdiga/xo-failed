(function() {
  'use strict';

  describe('XO.generatePassword', function() {
    var password;

    it('is a function', function() {
      expect(XO.generatePassword).to.be.a('function');
      expect(XO.generatePassword.length).to.equal(2);
    });

    it('returns different values', function() {
      var RUNS = 1000;

      var alreadyGeneratedPasswords = {};
      var password, i;

      for (i = 0; i < RUNS; i++) {
        password = XO.generatePassword(20);

        expect(password in alreadyGeneratedPasswords).to.equal(false);
        alreadyGeneratedPasswords[password] = 1;
      }
    });

    describe('with no groups', function() {
      beforeEach(function() {
        password = XO.generatePassword(10);
      });

      it('returns a string of uppercase letters and numbers of the specified length', function() {
        expect(password.length).to.equal(10);
        expect(password).to.match(/^[A-Z0-9]+$/, 'expected only contain letters and digits');
      });
    });

    describe('with groups', function() {
      beforeEach(function() {
        password = XO.generatePassword(9, 3);
      });

      it('returns groups of the given length separated by dash', function() {
        expect(password).to.match(/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}/);
      });
    });
  });

}());
