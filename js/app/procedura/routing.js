(function() {
  'use strict';

  function RoutingControllerProcedura($scope, $routeParams, Procedura) {
    Procedura.deschide($routeParams.numar, function() {
      $scope.$apply();
    });
  }

  RoutingControllerProcedura.$inject = ['$scope', '$routeParams', 'Procedura'];


  window.App.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/procedura/:numar', {
      template: ' ',
      controller: RoutingControllerProcedura
    });
  }]);

})();
