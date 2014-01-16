(function () {
  'use strict';

  angular.module('App').controller('FormularAutentificareDirectiveController', function($scope, $timeout, Utilizator) {
    $scope.email = '008@executori.org';
    $scope.parola = 'ACB7-EE4N-D964';

    //$scope.date = Utilizator.date;

    $scope.autentifica = function() {
      Utilizator
      .autentifica($scope.email, $scope.parola)
      .then(function success(utilizator) {
        utilizator.$date.$bind($scope, 'date');
        utilizator.$date.$on('loaded', function() {
          $timeout(function() {
            utilizator.date = $scope.date;
            utilizator.autentificat = true;
            $scope.utilizator = utilizator;
          });
        });

      });
    };
  });

}());
