(function() {
  'use strict';

  XO.main = function() {
    XO.Firebase.main();

    XO.AuthenticationService = XO.FirebaseAuthenticationService(XO.Firebase.SimpleLogin);

    XO.DataService = XO.FirebaseDataService(
      XO.Firebase.ref,
      XO.Firebase.$firebase,
      XO.Firebase.angularScope
    );
  };
}());
