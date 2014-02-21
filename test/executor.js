(function() {
  'use strict';

  describe('Executor', function() {
    var Executor, authenticationService, generatePassword, dataService;

    beforeEach(function() {
      authenticationService = XO.AuthenticationService;
      this.sinon.stub(authenticationService, 'createUser', TestHelpers.fakeDeferrable());

      dataService = XO.DataService;
      this.sinon.stub(dataService, 'getProfile', TestHelpers.fakeDeferrable());

      generatePassword = this.sinon.stub(XO, 'generatePassword').returns('a randome password');

      Executor = XO.Executor(authenticationService, generatePassword, dataService);
    });

    it('is a function that returns the actual module', function() {
      expect(XO.Executor).to.be.a('function');
      expect(XO.Executor.length).to.equal(3);
    });

    describe('.inregistreaza', function() {
      var password, email;

      beforeEach(function() {
        email = 'test@executori.org';
        password = generatePassword();
      });

      it('returns a promise', function() {
        var returnValue = Executor.inregistreaza(email);

        expect(returnValue).to.have.property('then').that.is.a('function');
      });

      it('generates a randome password with the injected randome password generator', function() {
        Executor.inregistreaza(email);
        expect(generatePassword).to.have.been.calledWith(12, 4);
      });

      it('creates an account with the injected authentication service', function() {
        Executor.inregistreaza(email);
        expect(authenticationService.createUser).to.have.been.calledWith(email, password);
      });

      it('initialises the user data structures and resolves with the password', function(done) {
        var profileDataStructure = {};

        Executor.inregistreaza(email)
        .then(function(resolutionValue) {
          expect(dataService.getProfile).to.have.been.calledWith(email);
          expect(profileDataStructure.email).to.equal(email);
          expect(resolutionValue).to.equal(password);

          done();
        });

        authenticationService.createUser.deferrable.resolve();
        dataService.getProfile.deferrable.resolve(profileDataStructure);
      });
    });
  });

}());
