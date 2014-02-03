(function() {
  'use strict';

  XO.Executor = function(config, $q, $log, Firebase, $firebaseSimpleLogin) {
    var firebaseReference = new Firebase(config.firebaseUrl);
    var firebaseSimpleLoginReference = $firebaseSimpleLogin(firebaseReference);


    this.inregistreaza = function(email, password) {
      var deferred = $q.defer();
      var thenLogin = false;

      $log.debug('Creating user', email);

      firebaseSimpleLoginReference
      .$createUser(email, password, thenLogin)
      .then(function successCallback(user) {
        $log.debug('Created user', email);

        deferred.resolve(user);
      }, function errorCallback(err) {
        $log.error(err);
      });

      return deferred.promise;
    };
  };
}());
