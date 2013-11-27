(function() {
  'use strict';

  function ControllerProcedura($scope, Procedura, ActiuniProcedurale) {
    $scope.procedura = Procedura.date;
    $scope.inchide = Procedura.inchide;
    $scope.totalSume = ControllerProcedura.module.totalSume;

    $scope.$watch('procedura["acţiuni-procedurale"]', function(newV, oldV) {
      if (angular.equals(newV, oldV)) return;

      $scope.optiuniPentruUrmatoareaActiune = ActiuniProcedurale.optiuniPentruUrmatoareaActiune($scope.procedura['acţiuni-procedurale']);
    }, true);
  }

  ControllerProcedura.$inject = ['$scope', 'Procedura', 'ActiuniProcedurale'];

  ControllerProcedura.module = {
    totalSume: function(sume) {
      return _.reduce(sume, function(total, item) {
        var suma = parseFloat(item.suma);

        if (_.isNaN(suma)) suma = 0;

        return total + suma;
      }, 0);
    }
  };

  window.App.module.C.ControllerProcedura = ControllerProcedura;
  window.App.controller('ControllerProcedura', ControllerProcedura);

})();
