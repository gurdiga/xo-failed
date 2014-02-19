(function() {
  'use strict';

  XO.FirebaseDataService = function(firebaseReference, $firebase, angularScope) {
    var FirebaseDataService = {
      getProfile: function(email) {
        var NG_SCOPE_MODEL = 'profil';
        var deferrable = XO.Deferrable.create();

        FirebaseDataService.getAid(email)
        .then(function(aid) {
          var path = '/date/' + aid + '/profil';
          var angularFireReference = $firebase(firebaseReference.child(path));

          angularFireReference.$bind(angularScope, NG_SCOPE_MODEL)
          .then(function() {
            deferrable.resolve(angularScope[NG_SCOPE_MODEL]);
          });
        });

        return email, deferrable.promise;
      },

      getAid: function(email) {
        var deferrable = XO.Deferrable.create();
        var eid = email.replace(/\./g, ':');
        var aidReference = firebaseReference.child('/aid/' + eid);

        aidReference.on('value', successCallback, cancelCallback);

        return deferrable.promise;

        function successCallback(dataSnapshot) {
          deferrable.resolve(dataSnapshot.val());
        }

        function cancelCallback(err) {
          deferrable.reject(err);
        }
      }
    };

    return FirebaseDataService;
  };

}());
