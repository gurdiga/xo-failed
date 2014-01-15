(function() {
  'use strict';

  angular.module('App').config(function($routeProvider) {
    $routeProvider
      .when('/', { template: ' ' })
      .otherwise({ redirectTo: '/' });
  });

})();
