(function() {
  'use strict';

  XO.UserAccount = function(config, Firebase, Logger) {
    var UserAccount = {
      create: function(email, password, createCallback) {
        Logger.debug('Creating a new user account:', email);

        var ref = new Firebase(config.firebaseUrl);

        var simpleLoginInstance = new Firebase.SimpleLogin(ref, function() {
          UserAccount.simpleLoginConstructorCallback(email, password, simpleLoginInstance, createCallback);
        });
      },


      simpleLoginConstructorCallback: function(email, password, simpleLoginInstance, createCallback) {
        simpleLoginInstance.createUser(email, password, function(err, user) {
          UserAccount.simpleLoginCreateUserCallback(err, user, createCallback);
        });
      },


      simpleLoginCreateUserCallback: function(err, user, createCallback) {
        if (err) {
          Logger.error('Couldn’t create the new user', err);
        } else {
          Logger.debug('Created user', user.email);
          createCallback();
        }
      }
    };

    return UserAccount;
  };

}());
