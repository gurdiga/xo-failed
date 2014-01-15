(function() {
  'use strict';

  angular.module('App').config(function($routeProvider) {
    $routeProvider.when('/procedura/:numar', {
      template: ' ',
      controller: 'RoutingControllerProcedura'
    });
  });

})();
