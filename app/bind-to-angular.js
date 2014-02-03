(function() {
  'use strict';

  XO.bindToAngular = function(angular) {
    var app = angular.module('App', ['ngRoute', 'firebase']);

    app.constant('config', XO.config);
    app.service('Data', XO.Data);
  };

  XO.bindToAngular(angular);
})();
