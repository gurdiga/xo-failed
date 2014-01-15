(function() {
  'use strict';

  angular.module('App').controller('ControllerProcedura', function($scope, Procedura, Actiuni) {
    $scope.procedura = Procedura.date;
    $scope.inchide = Procedura.inchide;
    $scope.totalSume = function(sume) {
      return _.reduce(sume, function(total, item) {
        var suma = parseFloat(item.suma);

        if (_.isNaN(suma)) suma = 0;

        return total + suma;
      }, 0);
    };

    $scope.$watch('procedura["acţiuni"]', function() {
      $scope.optiuniPentruUrmatoareaActiune = Actiuni.optiuniPentruUrmatoareaActiune($scope.procedura['acţiuni']);
    }, true);
  });

})();
