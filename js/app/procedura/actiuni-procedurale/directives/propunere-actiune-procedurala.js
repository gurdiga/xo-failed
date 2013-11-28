(function() {
  'use strict';

  function PropunereActiuneProcedurala() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        date: '=',
        procedura: '='
      },
      templateUrl: 'directive-propunere-actiune-procedurala',
      controller: ['$scope', 'ActiuniProcedurale', function($scope, ActiuniProcedurale) {
        $scope.adaugaActiuneProcedurala = ActiuniProcedurale.adauga;
      }]
    };
  }


  window.App.directive('propunereActiuneProcedurala', PropunereActiuneProcedurala);

})();
