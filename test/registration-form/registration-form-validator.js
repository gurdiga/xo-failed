(function() {
  'use strict';

  describe('RegistrationFormValidator', function() {
    var RegistrationFormValidator;

    beforeEach(function() {
      RegistrationFormValidator = XO.RegistrationFormValidator();
    });

    describe('.emailPresent()', function() {
      it('returns true or false appropriately', function() {
        expect(RegistrationFormValidator.emailPresent('')).to.equal(false);
        expect(RegistrationFormValidator.emailPresent('  ')).to.equal(false);
        expect(RegistrationFormValidator.emailPresent('test@test.com')).to.equal(true);
      });
    });


    describe('.emailValid()', function() {
      it('returns false for obvious cases', function() {
        expect(RegistrationFormValidator.emailValid()).to.equal(false);
        expect(RegistrationFormValidator.emailValid('one@test')).to.equal(false);
        expect(RegistrationFormValidator.emailValid('@test.co')).to.equal(false);
        expect(RegistrationFormValidator.emailValid('sads one@test.co')).to.equal(false);
        expect(RegistrationFormValidator.emailValid('sads@one@test.co')).to.equal(false);
      });

      it('returns true for good ones', function() {
        expect(RegistrationFormValidator.emailValid('one@test.co')).to.equal(true);
        expect(RegistrationFormValidator.emailValid('o.n+e@test.co')).to.equal(true);
      });

      it('ignores leading and trailing spaces', function() {
        expect(RegistrationFormValidator.emailValid('   one@test.co  ')).to.equal(true);
      });
    });
  });

}());
