(function() {
  'use strict';

  describe('XO.FirebaseDataService', function() {
    var FirebaseDataService;

    describe('API', function() {
      beforeEach(function() {
        FirebaseDataService = XO.FirebaseDataService();
      });

      it('implements XO.DataService', function() {
        expect(FirebaseDataService).to.implement(XO.DataService);
      });
    });


    describe('real work', function() {
      var email, password, eid;

      beforeEach(function() {
        XO.main();

        FirebaseDataService = XO.FirebaseDataService(
          XO.Firebase.ref,
          XO.Firebase.$firebase,
          XO.Firebase.angularScope
        );

        email = 'test@executori.org';
        password = email;
        eid = email.replace(/\./g, ':');
      });


      describe('.initAccount', function() {
        it('registers the AID for the given email nad creates the user’s root data structure', function(done) {
          this.timeout(5000);

          XO.AuthenticationService.authenticateUser(email, password)
          .then(FirebaseDataService.initAccount.bind(this, email))
          .then(function(aid) {
            var aidDeferrable = XO.Deferrable.create();
            var dataDeferrable = XO.Deferrable.create();

            XO.Firebase.ref.child('/aid/' + eid)
            .once('value', function(aidDataSnapshot) {
              aidDeferrable.resolve(aidDataSnapshot.val());
            });

            XO.Firebase.ref.child('/date/' + aid)
            .once('value', function(dataDataSnapshot) {
              dataDeferrable.resolve(dataDataSnapshot.val());
            });

            XO.Deferrable.all([aidDeferrable.promise, dataDeferrable.promise])
            .then(function(results) {
              var aidValue = results[0];
              var dataValue = results[1];

              expect(aidValue).to.equal(aid);
              expect(dataValue).to.deep.equal({
                profil: { email: email },
                proceduri: { keepme: true }
              });

              done();
            });
          });
        });
      });


      describe('.getProfile()', function() {
        it('returns the profile for the given email', function(done) {
          this.timeout(5000);

          XO.AuthenticationService.authenticateUser(email, password)
          .then(FirebaseDataService.initAccount.bind(this, email))
          .then(FirebaseDataService.getProfile.bind(this, email))
          .then(function(profil) {
            expect(profil.email).to.equal(email);
            done();
          });
        });
      });


      afterEach(function() {
        var aidReference = XO.Firebase.ref.child('/aid/' + eid);

        aidReference.once('value', function(aidDataSnapshot) {
          var aid = aidDataSnapshot.val();
          var dataReference = XO.Firebase.ref.child('/date/' + aid);

          aidReference.remove();
          dataReference.remove();
        });
      });

    });
  });

}());
