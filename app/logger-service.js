(function() {
  'use strict';

  angular.module('App').service('Firelogger', function() {
    var $storage;
    var email;

    this.setStorage = function($ref, email_) {
      $storage = $ref;
      email = email_;
    };

    this.store = function(type, err) {
      $storage.child('error').push({
        email: email,
        message: err.message,
        stack: err.stack
      });
    };
  });


  angular.module('App').config(function($provide) {
    $provide.decorator('$log', function($delegate, Firelogger) {
      var augmentedMethods = ['error', 'warn'];

      augmentedMethods.forEach(function(name) {
        var original = name + '_';

        $delegate[original] = $delegate[name];

        $delegate[name] = function(arg) {
          Firelogger.store(name, arg);
          $delegate[original].call($delegate, arg);
        };
      });

      return $delegate;
    });
  });

})();
