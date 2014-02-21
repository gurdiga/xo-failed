(function() {
  'use strict';

  XO.FirebaseDataService = function(firebaseReference, $firebase, angularScope) {
    var FirebaseDataService = {
      getProfile: function(email) {
        return FirebaseDataService.getAid(email)
        .then(bindToAngularScopeModel.bind(this, 'profil'));
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
