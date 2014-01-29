(function () {
  'use strict';

  angular.module('App').controller('FormularAutentificareDirectiveController', function($scope, $timeout, Utilizator) {
    $scope.email = '008@executori.org';
    $scope.parola = 'ACB7-EE4N-D964';

    $scope.autentifica = function() {
      Utilizator.autentifica($scope.email, $scope.parola);
    };
  });

}());
