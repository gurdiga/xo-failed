(function() {
  'use strict';

  describe('Executor', function() {
    var Executor, authenticationService, generatePassword, dataService;
    var email = 'test@executori.org';

    beforeEach(function() {
      authenticationService = XO.AuthenticationService;
      this.sinon.stub(authenticationService, 'createUser', TestHelpers.fakeDeferrable());
      this.sinon.stub(authenticationService, 'authenticateUser', TestHelpers.fakeDeferrable());

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
      var password;

      beforeEach(function() {
        password = generatePassword();
      });

      it('generates a random password', function() {
        Executor.inregistreaza(email);
        expect(generatePassword).to.have.been.calledWith(12, 4);
      });

      it('creates an account', function() {
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


    describe('.autentifica', function() {
      var password;

      it('authenticates with an existing Firebase account', function(done) {
        Executor.autentifica(email, password)
        .then(function() {
          expect(authenticationService.authenticateUser).to.have.been.calledWith(email, password);
          done();
        });

        authenticationService.authenticateUser.deferrable.resolve();
      });
    });

  });

}());
