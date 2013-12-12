(function() {
  'use strict';

  function RoutingControllerProcedura($scope, $routeParams, Procedura) {
    if (js.isNumber($routeParams.numar)) {
      Procedura.deschide($routeParams.numar, function() {
        $scope.$apply();
      });
    } else {
      var gen = $routeParams.numar;

      Procedura.initializeaza(gen);
    }
  }

  RoutingControllerProcedura.$inject = ['$scope', '$routeParams', 'Procedura'];


  window.App.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/procedura/:numar', {
      template: ' ',
      controller: RoutingControllerProcedura
    });
  }]);

})();
