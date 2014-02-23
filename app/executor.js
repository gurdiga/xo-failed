(function() {
  'use strict';

  XO.Executor = function(authenticationService, generatePassword, dataService) {
    var Executor = {
      inregistreaza: function(email) {
        var password = generatePassword(12, 4);

        return authenticationService.createUser(email, password)
        .then(dataService.getProfile.bind(this, email))
        .then(function(profil) {
          profil.email = email;

          var deferrable = XO.Deferrable.create();
          deferrable.resolve(password);
          return deferrable.promise;
        });
      },


      autentifica: function(email, password) {
        return authenticationService.authenticateUser(email, password);
      }
    };

    return Executor;
  };

}());
