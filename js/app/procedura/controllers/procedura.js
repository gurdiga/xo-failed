(function() {
  'use strict';

  function ControllerProcedura($scope, Procedura) {
    $scope.procedura = Procedura.date;
    $scope.inchide = Procedura.inchide;
    $scope.totalSume = ControllerProcedura.module.totalSume;
  }

  ControllerProcedura.$inject = ['$scope', 'Procedura'];

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
