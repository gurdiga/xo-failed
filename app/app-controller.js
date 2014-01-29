(function() {
  'use strict';

  angular.module('App').controller('App', function($scope, Utilizator) {
    $scope.utilizator = Utilizator;
  });

})();
