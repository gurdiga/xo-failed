(function() {
  'use strict';

  XO.FirebaseDataService = function(firebaseReference, $firebase, angularScope) {
    var FirebaseDataService = {

      initAccount: function(email) {
        var deferrable = XO.Deferrable.create();
        var dataStructure = {
          profil: { email: email },
          proceduri: { keepme: true }
        };

        firebaseReference.child('/date/')
        .push(dataStructure, function(err) {
          if (err) deferrable.reject(err);
        })
        .once('value', function(dataDataSnapshot) {
          var eid = email.replace(/\./g, ':');
          var aid = dataDataSnapshot.name();

          firebaseReference.child('/aid/' + eid)
          .set(aid, function(err) {
            if (err) deferrable.reject(err);
            else deferrable.resolve(aid);
          });
        });

        return deferrable.promise;
      },


      getProfile: function(email) {
        return FirebaseDataService.getAid(email)
        .then(bindToAngularScopeModel.bind(this, 'profil'));
      },


      // TODO: get rid of this?
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
      },


      getRoot: function(email) {
        return FirebaseDataService.getAid(email)
        .then(bindToAngularScopeModel.bind(this, 'root'));
      }
    };

    return FirebaseDataService;


    function bindToAngularScopeModel(scopeModelName, aid) {
      var path = '/date/' + aid;
      var angularFireReference = $firebase(firebaseReference.child(path));

      return angularFireReference.$bind(angularScope, scopeModelName)
      .then(function() {
        var deferrable = XO.Deferrable.create();

        deferrable.resolve(angularScope[scopeModelName]);

        return deferrable.promise;
      });
    }
  };

}());
