(function() {
  'use strict';

  describe('XO.FirebaseDataService', function() {
    var FirebaseDataService, firebaseReference, $firebase, angularScope;

    describe('unit tests (mocked out dependencies)', function() {
      beforeEach(function() {
        firebaseReference = {
          child: this.sinon.stub()
        };

        $firebase = this.sinon.stub().returns({
          $bind: TestHelpers.fakeDeferrable()
        });
        this.sinon.spy($firebase(), '$bind');

        angularScope = {};
        FirebaseDataService = XO.FirebaseDataService(firebaseReference, $firebase, angularScope);
      });


      describe('API', function() {
        it('is a function that returns the module', function() {
          expect(XO.FirebaseDataService).to.be.a('function');
          expect(XO.FirebaseDataService.length).to.equal(3);
        });

        it('implements XO.DataService', function() {
          Object.keys(XO.DataService).forEach(function(functionName) {
            expect(FirebaseDataService).to.have.property(functionName).that.is.a('function');
            expect(FirebaseDataService[functionName].length).to.equal(XO.DataService[functionName].length,
              functionName + '’s argument count corresponds');
          });
        });
      });


      describe('.getProfile()', function() {
        var email, childFirebaseReference, aid;

        beforeEach(function() {
          aid   = '-SOME-RANDOM-STRING';
          email = 'test@executori.org';

          childFirebaseReference = {};
          firebaseReference.child.returns(childFirebaseReference);
          this.sinon.stub(FirebaseDataService, 'getAid', TestHelpers.fakeDeferrable());
        });

        it('gets the aid before $binding to the corresponding Firebase path', function(done) {
          FirebaseDataService.getProfile(email)
          .then(function() {
            expect(FirebaseDataService.getAid).to.have.been.calledBefore($firebase().$bind);
            expect(FirebaseDataService.getAid).to.have.been.calledWith(email);
            done();
          });

          FirebaseDataService.getAid.deferrable.resolve(aid);
          $firebase().$bind.deferrable.resolve(angularScope['profil']);
        });

        it('gets a Firebase reference to the corresponding path', function(done) {
          FirebaseDataService.getProfile(email)
          .then(function() {
            expect(firebaseReference.child).to.have.been.called;
            done();
          });

          FirebaseDataService.getAid.deferrable.resolve(aid);
          $firebase().$bind.deferrable.resolve(angularScope['profil']);
        });

        it('returns a bound $firebase object from the corresponding path', function(done) {
          angularScope['profil'] = {'firebase': 'data'};

          FirebaseDataService.getProfile(email)
          .then(function(data) {
            expect($firebase).to.have.been.calledWith(childFirebaseReference);
            expect($firebase().$bind).to.have.been.calledWith(angularScope, 'profil');
            expect(data).to.equal(angularScope['profil']);

            done();
          });

          FirebaseDataService.getAid.deferrable.resolve(aid);
          $firebase().$bind.deferrable.resolve(angularScope['profil']);
        });
      });


      describe('.getAid()', function() {
        var email, aidReference, aidDataSnapshot, expectedAid;

        beforeEach(function() {
          email = 'test@executori.org';
          expectedAid = 'some-unique-value';

          aidDataSnapshot = {
            val: this.sinon.stub().returns(expectedAid)
          };
          aidReference = { on: function() {} };

          firebaseReference.child.returns(aidReference);
        });

        describe('in any case', function() {
          beforeEach(function() {
            this.sinon.stub(aidReference, 'on').yields(aidDataSnapshot);
          });

          it('gets a Firebase reference for the corresponding path and listens for its value', function(done) {
            FirebaseDataService.getAid(email)
            .then(function() {
              var eid = email.replace(/\./g, ':');

              expect(firebaseReference.child).to.have.been.calledWith('/aid/' + eid);
              expect(firebaseReference.child()).to.equal(aidReference);
              expect(aidReference.on).to.have.been.calledWith('value');

              done();
            });
          });
        });

        describe('when value received', function() {
          beforeEach(function() {
            this.sinon.stub(aidReference, 'on').callsArgWith(1, aidDataSnapshot);
          });

          it('invokes the successCallback with the data spanshot', function(done) {
            FirebaseDataService.getAid(email)
            .then(function(aid) {
              var successCallback = aidReference.on.firstCall.args[1];

              expect(successCallback).to.be.a('function');
              expect(successCallback.length).to.equal(1);
              expect(aidDataSnapshot.val).to.have.been.called;
              expect(aidDataSnapshot.val()).to.equal(expectedAid);

              expect(aid).to.equal(expectedAid);
              done();
            });
          });
        });

        describe('when value is not received', function() {
          var error;

          beforeEach(function() {
            error = new Error('Something bad happened');
            this.sinon.stub(aidReference, 'on').callsArgWith(2, error);
          });

          it('invokes the cancelCallback with the received error', function(done) {
            FirebaseDataService.getAid(email)
            .catch(function(err) {
              var cancelCallback = aidReference.on.firstCall.args[2];

              expect(cancelCallback).to.be.a('function');
              expect(cancelCallback.length).to.equal(1);

              expect(err).to.equal(error);
              done();
            });
          });
        });
      });
    });


    describe.skip('real work', function() {
      var email, password;

      beforeEach(function() {
        XO.main();

        FirebaseDataService = XO.FirebaseDataService(
          XO.Firebase.ref,
          XO.Firebase.$firebase,
          XO.Firebase.angularScope
        );

        email = 'test@executori.org';
        password = email;
      });

      describe('.getProfile()', function() {
        it('works for real', function(done) {
          this.timeout(5000);

          XO.AuthenticationService.authenticateUser(email, password)
          .then(FirebaseDataService.getProfile.bind(this, email))
          .then(function(profil) {
            done();
            return profil;
          });
        });
      });


      describe('.getRoot()', function() {
        it('works for real', function(done) {
          this.timeout(5000);

          XO.AuthenticationService.authenticateUser(email, password)
          .then(FirebaseDataService.getRoot.bind(this, email))
          .then(function(root) {
            done();
            return root;
          });
        });
      });
    });
  });

}());
