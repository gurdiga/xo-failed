(function() {
  'use strict';

  function ControllerUtilizator($scope, Utilizator) {
    $scope.utilizator = Utilizator.date;
  }

  ControllerUtilizator.$inject = ['$scope', 'Utilizator'];

  window.App.controller('ControllerUtilizator', ControllerUtilizator);

})();
