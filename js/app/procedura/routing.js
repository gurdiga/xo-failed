(function() {
  'use strict';

  function RoutingControllerProcedura($scope, $routeParams, ServiceProcedura) {
    ServiceProcedura.deschide($routeParams.numar, function() {
      $scope.$apply();
    });
  }

  RoutingControllerProcedura.$inject = ['$scope', '$routeParams', 'ServiceProcedura'];


  window.App.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/procedura/:numar', {
      template: ' ',
      controller: RoutingControllerProcedura
    });
  }]);

})();
