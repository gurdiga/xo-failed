(function() {
  'use strict';


  App.controller('App',
         ['$scope', 'Utilizator', '$timeout',
  function($scope,   Utilizator,   $timeout) {
    Utilizator
    .autentifica('008@executori.org', 'FD7Y-G966-4ZFH')
    .then(function success(utilizator) {
      $scope.utilizator = utilizator;

      utilizator.$date.$bind($scope, 'date');
      utilizator.$date.$on('loaded', function() {
        $timeout(function() {
          utilizator.date = $scope.date;
          utilizator.date.profil.adresa = 'Cuza Voda 3/1';
        });
      });

    });

    $scope.date = Utilizator.date;
  }]);

})();
