(function() {
  'use strict';

  angular.module('App').controller('App', function($scope, $timeout, Utilizator) {
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
            console.log($scope.utilizator.autentificat);
          });
        });

      });
    };

  });

})();
