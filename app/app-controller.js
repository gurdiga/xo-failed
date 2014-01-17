(function() {
  'use strict';

  angular.module('App').controller('App', function($scope, $rootScope, Firelogger) {
    $scope = $scope;

    $rootScope.$on('log-storage-ready', function(e, $ref, email) {
      Firelogger.setStorage($ref, email);
    });
  });

})();
