(function() {
  'use strict';

  describe('XO.LoggedAuthenticationService', function() {
    var LoggedAuthenticationService, authenticationService, email, password;
    var functionNames;

    beforeEach(function() {
      functionNames = ['createUser', 'authenticateUser', 'deleteUser'];
      authenticationService = {};

      functionNames.forEach(function mock(functionName) {
        authenticationService[functionName] = TestHelpers.fakeDeferrable();
        this.sinon.spy(authenticationService, functionName);
      });

      this.sinon.stub(console, 'debug');
      this.sinon.stub(console, 'error');

      LoggedAuthenticationService = XO.LoggedAuthenticationService(authenticationService);
      email = 'FirebaseAuthenticationService@test.com';
      password = 'the password';
    });

    it('implements AuthenticationService interface', function() {
      expect(LoggedAuthenticationService).to.implement(XO.AuthenticationService);
    });


    ['createUser', 'authenticateUser', 'deleteUser'].forEach(function(functionName) {
      describe(functionName, function() {
        it('logs before and after calling it', function(done) {
          LoggedAuthenticationService[functionName](email, password)
          .then(function() {
            expect(console.debug).to.have.been.calledBefore(authenticationService[functionName]);
            expect(authenticationService[functionName]).to.have.been.calledWith(email, password);
            expect(console.debug).to.have.been.calledAfter(authenticationService[functionName]);

            expect(console.debug.firstCall.args).to.deep.equal(['AuthenticationService.' + functionName + '()', email]);
            expect(console.debug.secondCall.args).to.deep.equal(['AuthenticationService.' + functionName + '() finished', email]);
            done();
          });

          authenticationService[functionName].deferrable.resolve();
        });

        it('logs promise rejection to stderr', function(done) {
          var err = new Error('Something bad happened');

          LoggedAuthenticationService[functionName](email, password)
          .finally(function() {
            expect(console.error).to.have.been.calledWith(err);
            done();
          });

          authenticationService[functionName].deferrable.reject(err);
        });
      });
    });
  });

}());
