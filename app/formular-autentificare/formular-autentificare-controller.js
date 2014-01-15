(function () {
  'use strict';

  angular.module('App').controller('FormularAutentificare', function($scope, $timeout, Utilizator) {
    $scope.email = '008@executori.org';
    $scope.parola = 'FD7Y-G966-4ZFH';

    //$scope.date = Utilizator.date;

    $scope.autentifica = function() {
      Utilizator
      .autentifica($scope.email, $scope.parola)
      .then(function success(utilizator) {
        utilizator.$date.$bind($scope, 'date');
        utilizator.$date.$on('loaded', function() {
          $timeout(function() {
            // ????
            $scope.utilizator = utilizator;
            utilizator.date = $scope.date;
            console.log($scope.date);
          });
        });

      });
    };

    console.log('Controller FormularAutentificare', $scope);
  });

}());
