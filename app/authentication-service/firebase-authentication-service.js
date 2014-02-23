(function() {
  'use strict';

  XO.FirebaseAuthenticationService = function($firebaseSimpleLoginObject) {
    var FirebaseAuthenticationService = {

      createUser: function(email, password) {
        var automaticLoginAfterCreate = false;

        return $firebaseSimpleLoginObject.$createUser(email, password, automaticLoginAfterCreate);
      },


      authenticateUser: function(email, password) {
        return $firebaseSimpleLoginObject.$login('password', {
          email: email,
          password: password
        });
      },


      deleteUser: function(email, password) {
        return $firebaseSimpleLoginObject.$removeUser(email, password);
      }
    };

    return FirebaseAuthenticationService;
  };

}());
