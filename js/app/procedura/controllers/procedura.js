(function() {
  'use strict';

  function ControllerProcedura($scope, Procedura, Actiuni) {
    $scope.procedura = Procedura.date;
    $scope.inchide = Procedura.inchide;
    $scope.totalSume = ControllerProcedura.module.totalSume;

    $scope.$watch('procedura["acţiuni"]', function() {
      $scope.optiuniPentruUrmatoareaActiune = Actiuni.optiuniPentruUrmatoareaActiune($scope.procedura['acţiuni']);
    }, true);
  }

  ControllerProcedura.$inject = ['$scope', 'Procedura', 'Actiuni'];

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
