(function() {
  'use strict';

  App.controller('App',
         ['$scope', 'Utilizator',
  function($scope,   Utilizator) {
    $scope.utilizator = Utilizator.date;
  }]);

})();
