(function() {
  'use strict';

  describe('Executor', function() {
    var executor, deps, firebaseSimpleLoginReference;

    beforeEach(function() {
      this.sinon = sinon.sandbox.create();

      deps = {
        config               : injector.get('config'),
        $q                   : injector.get('$q'),
        $log                 : injector.get('$log'),
        Firebase             : injector.get('Firebase'),
        $firebaseSimpleLogin : injector.get('$firebaseSimpleLogin')
      };

      sinon.stub(deps.$log, 'error');
      sinon.stub(deps.$log, 'debug');

      deps.Firebase.goOffline();
      sinon.spy(deps, 'Firebase');

      firebaseSimpleLoginReference = deps.$firebaseSimpleLogin(new deps.Firebase(deps.config.firebaseUrl));
      sinon.stub(deps, '$firebaseSimpleLogin').returns(firebaseSimpleLoginReference);
    });


    afterEach(function() {
      deps.$log.error.restore();
      deps.$log.debug.restore();
      deps.Firebase.restore();
      deps.$firebaseSimpleLogin.restore();
    });


    beforeEach(function() {
      executor = new XO.Executor(
        deps.config,
        deps.$q,
        deps.$log,
        deps.Firebase,
        deps.$firebaseSimpleLogin
      );
    });


    describe('constructor', function() {
      it('instantiates Firebase with config.firebaseUrl', function() {
        expect(deps.Firebase).to.have.been.calledWithNew;
        expect(deps.Firebase).to.have.been.calledWith(deps.config.firebaseUrl);
      });

      it('initialises $firebaseSimpleLogin with the firebase instance', function() {
        var argument = deps.$firebaseSimpleLogin.firstCall.args[0].toString();

        expect(deps.$firebaseSimpleLogin).to.have.been.calledOnce;
        expect(argument).to.equal(deps.config.firebaseUrl);
      });
    });


    describe('.inregistreaza(email, password)', function() {
      var mainPromise, email, password, thenLogin, createUserDeferred, createUserPromise;

      beforeEach(function() {
        createUserDeferred = deps.$q.defer();
        createUserPromise = createUserDeferred.promise;
        sinon.stub(firebaseSimpleLoginReference, '$createUser').returns(createUserPromise);
      });

      beforeEach(function() {
        email     = '001@executori.org';
        password  = 'p455w0rd';
        thenLogin = false;

        mainPromise = executor.inregistreaza(email, password);
        expect(deps.$log.debug).to.have.been.calledOnce;
      });

      describe('every time', function() {
        it('logs the call', function() {
          expect(deps.$log.debug).to.have.been.calledWith('Creating user', email);
        });

        it('calls $createUser(email, password, thenLogin)', function() {
          expect(firebaseSimpleLoginReference.$createUser).to.have.been.calledWith(email, password, thenLogin);
        });
      });


      describe('when $createUser’s promise is fulfilled', function() {
        var createdUser;

        beforeEach(function() {
          createdUser = 'createdUser object';
        });

        it('also fulfills the main promise', function(done) {
          mainPromise.then(function(_createdUser) {
/*
 * TODO
 * - only return needed data from the promise
 */

            expect(createdUser).to.equal(_createdUser);
            expect(deps.$log.debug).to.have.been.calledWith('Created user', email);
            done();
          });

          createUserDeferred.resolve(createdUser);
        });
      });


      describe('when $createUser’s promise is rejected', function() {
        var err;

        beforeEach(function() {
          err = new Error('Something bad happened');
        });

        it('logs the error but do not reject the mani promise', function(done) {
          createUserPromise.finally(function() {
            expect(deps.$log.error).to.have.been.calledOnce;
            done();
          });

          createUserDeferred.reject(err);
        });
      });

    });


    describe('.autentifica()', function() {
      
    });


    describe('.asiguraAutentificat()', function() {
      
    });
  });
}());
