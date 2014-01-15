(function() {
  'use strict';

  angular.module('App').controller('RoutingControllerProcedura', function($scope, $routeParams, Procedura) {
    if (js.isNumber($routeParams.numar)) {
      Procedura.deschide($routeParams.numar, function() {
        $scope.$apply();
      });
    } else {
      var gen = $routeParams.numar;

      Procedura.initializeaza(gen);
    }
  });

})();
