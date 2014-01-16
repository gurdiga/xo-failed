(function() {
  'use strict';

  angular.module('App').controller('App', function($scope, $rootScope, Logger) {
    $scope = $scope;

    $rootScope.$on('log-storage-ready', function(e, $ref, email) {
      Logger.setStorage($ref, email);
    });
  });

})();
