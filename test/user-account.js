(function() {
  'use strict';

  describe('UserAccount', function() {
    var UserAccount, config, Firebase, Logger;

    beforeEach(function() {
      config = XO.config;
      Firebase = this.sinon.spy(FirebaseMock);
      this.sinon.spy(Firebase, 'SimpleLogin');
      Logger = this.sinon.stub(XO.Logger);

      UserAccount = XO.UserAccount(config, Firebase, Logger);
    });


    describe('.create()', function() {
      var email, password, createCallback;

      beforeEach(function() {
        email          = 'email@executori.com';
        password       = 'aSecretPassWord';
        createCallback = this.sinon.spy();
      });


      it('logs a debug message on start', function(done) {
        UserAccount.create(email, password, function() {
          expect(Logger.debug).to.have.been.called;
          done();
        });
      });

      it('creates a Firebase reference to the app data', function(done) {
        UserAccount.create(email, password, function() {
          expect(Firebase).to.have.been.calledWith(config.firebaseUrl);
          expect(Firebase).to.have.been.calledWithNew;
          done();
        });
      });

      describe('FirebaseSimpleLogin instanciation', function() {
        it('creates an instance with the Firebase ref and the a callback', function(done) {
          UserAccount.create(email, password, function() {
            expect(Firebase.SimpleLogin).to.have.been.called.withNew;

            var callArgs = Firebase.SimpleLogin.getCall(0).args;
            var args = {
              ref      : callArgs[0],
              callback : callArgs[1]
            };

            expect(args.ref).to.be.an.instanceof(Firebase);
            expect(args.ref.toString()).to.equal(config.firebaseUrl);
            expect(args.callback).to.be.a('function');

            done();
          });
        });

        describe('that callback', function() {
          var callback;

          it('calls .simpleLoginConstructorCallback with the email and password', function(done) {
            UserAccount.create(email, password, function() {
              callback = Firebase.SimpleLogin.getCall(0).args[1];
              done();
            });
          });

          afterEach(function() {
            this.sinon.stub(UserAccount, 'simpleLoginConstructorCallback');

            callback();
            expect(UserAccount.simpleLoginConstructorCallback).to.have.been.calledWith(email, password);
          });
        });
      });


      describe('.simpleLoginConstructorCallback', function() {
        var simpleLoginInstance;

        beforeEach(function() {
          simpleLoginInstance = new Firebase.SimpleLogin({}, function() {});
          this.sinon.stub(UserAccount, 'simpleLoginCreateUserCallback');

          UserAccount.simpleLoginConstructorCallback(email, password, simpleLoginInstance, createCallback);
        });

        it('calls createUser with the email, password, and a callback', function() {
          expect(simpleLoginInstance.createUser).to.have.been.calledWith(email, password);
        });

        it('calls UserAccount.simpleLoginCreateUserCallback from the callback with its arguments', function() {
          var callback = simpleLoginInstance.createUser.getCall(0).args[2];
          var err = null;
          var user = {'user': 'object'};

          callback(err, user);
          expect(UserAccount.simpleLoginCreateUserCallback).to.have.been.calledWith(err, user, createCallback);
        });
      });


      describe('.simpleLoginCreateUserCallback', function() {
        var createdUser, err;

        describe('with no error', function() {
          beforeEach(function() {
            err = null;
            createdUser = {email: email};
          });

          it('logs a debug message on finish', function() {
            UserAccount.simpleLoginCreateUserCallback(err, createdUser, createCallback);
            expect(Logger.debug).to.have.been.called;
          });
        });

        describe('with an error', function() {
          beforeEach(function() {
            err = new Error('Something bad happened');
            createdUser = {};
          });

          it('logs a debug message on finish', function() {
            UserAccount.simpleLoginCreateUserCallback(err, createdUser);
            expect(Logger.error).to.have.been.calledWith('Couldn’t create the new user', err);
            expect(Logger.debug).not.to.have.been.called;
          });
        });
      });
    });


    describe('.authenticate()', function() {
      // TODO
    });
  });


  function SimpleLoginMock(ref, callback) {
    var err, createdUser;

    this.createUser = sinon.stub().yields(err = null, createdUser = {email: 'some@email'});

    setTimeout(function() { callback(); });
  }


  function FirebaseMock(url) {
    this.toString = sinon.stub().returns(url);
  }

  FirebaseMock.SimpleLogin = SimpleLoginMock;

}());
