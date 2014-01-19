(function() {
  'use strict';

  angular.module('App').controller('App', function($scope, $rootScope, Firelogger, Utilizator) {
    $scope.utilizator = Utilizator;
    $scope.date = {};

    Firelogger.listenFor('log-storage-ready', $rootScope);
  });

})();
