(function() {
  'use strict';

  XO.Data = function(config, $q, $firebase, Firebase, Utilizator) {
    this.get = function() {
      var deferred = $q.defer();

      Utilizator = Utilizator;

      return deferred.promise;
    };
  };

}());
