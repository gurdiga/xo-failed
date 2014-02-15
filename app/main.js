(function() {
  'use strict';

  XO.main = function() {
    XO.Firebase.main();

    XO.AuthenticationService = XO.FirebaseAuthenticationService(XO.Firebase.SimpleLogin);
    XO.DataStorageService = {};
  };
}());
