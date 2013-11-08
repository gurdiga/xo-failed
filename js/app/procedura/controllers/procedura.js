(function() {
  'use strict';

  function ControllerProcedura($scope, ServiceProcedura) {
    $scope.procedura = ServiceProcedura.date;
    $scope.inchide = ServiceProcedura.închide;
    $scope.totalSume = ControllerProcedura.module.totalSume;
  }

  ControllerProcedura.$inject = ['$scope', 'ServiceProcedura'];

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
