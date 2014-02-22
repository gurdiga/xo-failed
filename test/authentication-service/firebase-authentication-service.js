(function() {
  'use strict';

  /*global Firebase */
  describe('XO.FirebaseAuthenticationService', function() {
    var FirebaseAuthenticationService, $firebaseSimpleLoginObject, email, password;


    describe('unit tests (mocked $firebaseSimpleLoginObject)', function() {
      beforeEach(function() {
        $firebaseSimpleLoginObject = {
          $createUser: TestHelpers.fakeDeferrable(),
          $login: TestHelpers.fakeDeferrable()
        };

        this.sinon.spy($firebaseSimpleLoginObject, '$createUser');
        this.sinon.spy($firebaseSimpleLoginObject, '$login');

        FirebaseAuthenticationService = XO.FirebaseAuthenticationService($firebaseSimpleLoginObject);

        email = 'FirebaseAuthenticationService@test.com';
        password = 'the password';
      });


      it('implements XO.AuthenticationService', function() {
        Object.keys(XO.AuthenticationService).forEach(function(functionName) {
          expect(FirebaseAuthenticationService).to.have.property(functionName).that.is.a('function');
          expect(FirebaseAuthenticationService[functionName].length).to.equal(XO.AuthenticationService[functionName].length,
            functionName + '’s argument count corresponds');
        });
      });


      describe('.createUser()', function() {
        it('returns a promise', function() {
          var returnValue = FirebaseAuthenticationService.createUser(email, password);

          expect(returnValue).to.have.property('then').that.is.a('function');
        });


        it('passes the email and password to $firebaseSimpleLoginObject.$createUser()', function(done) {
          FirebaseAuthenticationService.createUser(email, password)
          .then(function() {
            var automaticLoginAfterCreate = false;

            expect($firebaseSimpleLoginObject.$createUser).to.have.been.calledWith(email, password, automaticLoginAfterCreate);
            done();
          });

          $firebaseSimpleLoginObject.$createUser.deferrable.resolve();
        });
      });


      describe('.authenticateUser()', function() {
        it('returns a promise', function() {
          var returnValue = FirebaseAuthenticationService.authenticateUser(email, password);

          expect(returnValue).to.have.property('then').that.is.a('function');
        });


        it('passes the email and password to the $login method on $firebaseSimpleLoginObject', function(done) {
          FirebaseAuthenticationService.authenticateUser(email, password)
          .then(function() {
            expect($firebaseSimpleLoginObject.$login).to.have.been.calledWith('password', {
              email: email,
              password: password
            });

            done();
          });

          $firebaseSimpleLoginObject.$login.deferrable.resolve(email, password);
        });
      });
    });


    describe.skip('real work', function() {
      beforeEach(function() {
        var firebase = new Firebase(XO.Firebase.Config.url);

        $firebaseSimpleLoginObject = angular.injector(['XO']).get('$firebaseSimpleLogin')(firebase);
        /*jshint -W064:false*/ // prevent “Missing 'new' prefix when invoking a constructor.”
        FirebaseAuthenticationService = XO.FirebaseAuthenticationService($firebaseSimpleLoginObject);
        FirebaseAuthenticationService = XO.LoggedAuthenticationService(FirebaseAuthenticationService);
      });

      it('creates a new account, authenticates with it, then deletes it', function(done) {
        this.timeout(5000);

        FirebaseAuthenticationService.createUser(email, password)
        .then(FirebaseAuthenticationService.authenticateUser.bind(this, email, password))
        .then($firebaseSimpleLoginObject.$removeUser.bind($firebaseSimpleLoginObject, email, password))
        .finally(done);
      });
    });


  });

}());
