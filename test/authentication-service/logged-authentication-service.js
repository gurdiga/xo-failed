(function() {
  'use strict';

  describe('XO.LoggedAuthenticationService', function() {
    var LoggedAuthenticationService, authenticationService, email, password;

    beforeEach(function() {
      authenticationService = {
        createUser: TestHelpers.fakeDeferrable(),
        authenticateUser: TestHelpers.fakeDeferrable()
      };

      this.sinon.spy(authenticationService, 'createUser');
      this.sinon.spy(authenticationService, 'authenticateUser');

      this.sinon.stub(console, 'debug');
      this.sinon.stub(console, 'error');

      LoggedAuthenticationService = XO.LoggedAuthenticationService(authenticationService);
      email = 'FirebaseAuthenticationService@test.com';
      password = 'the password';
    });

    it('implements AuthenticationService interface', function() {
      Object.keys(XO.AuthenticationService).forEach(function(functionName) {
        expect(LoggedAuthenticationService).to.have.property(functionName).that.is.a('function');
        expect(LoggedAuthenticationService[functionName].length).to.equal(XO.AuthenticationService[functionName].length,
          functionName + '’s argument count corresponds');
      });
    });


    describe('.createUser()', function() {
      it('returns a promise', function() {
        var resultValue = LoggedAuthenticationService.createUser(email, password);

        expect(resultValue).to.have.property('then').that.is.a('function');
      });

      it('logs before and after calling authenticationService.createUser()', function(done) {
        LoggedAuthenticationService.createUser(email, password)
        .then(function() {
          expect(console.debug).to.have.been.calledBefore(authenticationService.createUser);
          expect(authenticationService.createUser).to.have.been.calledWith(email, password);
          expect(console.debug).to.have.been.calledAfter(authenticationService.createUser);

          expect(console.debug.firstCall.args).to.deep.equal(['AuthenticationService.createUser()', email]);
          expect(console.debug.secondCall.args).to.deep.equal(['AuthenticationService.createUser() finished', email]);
          done();
        });

        authenticationService.createUser.deferrable.resolve();
      });

      it('logs promise rejection to stderr', function(done) {
        var err = new Error('Something bad happened');

        LoggedAuthenticationService.createUser(email, password)
        .finally(function() {
          expect(console.error).to.have.been.calledWith(err);
          done();
        });

        authenticationService.createUser.deferrable.reject(err);
      });
    });


    describe('.authenticateUser()', function() {
      it('returns a promise', function() {
        var resultValue = LoggedAuthenticationService.authenticateUser(email, password);

        expect(resultValue).to.have.property('then').that.is.a('function');
      });

      it('logs before and after calling authenticationService.authenticateUser()', function(done) {
        LoggedAuthenticationService.authenticateUser(email, password)
        .then(function() {
          expect(console.debug).to.have.been.calledBefore(authenticationService.authenticateUser);
          expect(authenticationService.authenticateUser).to.have.been.calledWith(email, password);
          expect(console.debug).to.have.been.calledAfter(authenticationService.authenticateUser);

          expect(console.debug.firstCall.args).to.deep.equal(['AuthenticationService.authenticateUser()', email]);
          expect(console.debug.secondCall.args).to.deep.equal(['AuthenticationService.authenticateUser() finished', email]);
          done();
        });

        authenticationService.authenticateUser.deferrable.resolve();
      });

      it('logs promise rejection to stderr', function(done) {
        var err = new Error('Something bad happened');

        LoggedAuthenticationService.authenticateUser(email, password)
        .finally(function() {
          expect(console.error).to.have.been.calledWith(err);
          done();
        });

        authenticationService.authenticateUser.deferrable.reject(err);
      });
    });
  });

}());
