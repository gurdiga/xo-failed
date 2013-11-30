(function() {
  'use strict';

  function PropunereActiune() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        date: '=',
        procedura: '='
      },
      templateUrl: 'directive-propunere-actiune',
      controller: ['$scope', 'Actiuni', function($scope, Actiuni) {
        $scope.adaugaActiune = Actiuni.adauga;
      }]
    };
  }


  window.App.directive('propunereActiune', PropunereActiune);

})();
