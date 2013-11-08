/*global angular*/
(function() {
  'use strict';

  var App = angular.module('App', ['ngRoute']);

  App.run(['Utilizator', function(Utilizator) {
    Utilizator.login = $.cookie('login');
  }]);

  // When the templates are outside of the ng-app element they are not
  // automatically loaded.
  (function() {
    var templates = document.querySelectorAll('script[type="text/ng-template"]');

    templates = Array.prototype.slice.call(templates);

    function registerTemplate(template) {
      App.run(['$templateCache', function($templateCache) {
        $templateCache.put(template.id, template.innerHTML);
      }]);
    }

    templates.forEach(registerTemplate);
  })();


  App.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', { template: ' ' })
      .otherwise({ redirectTo: '/' });
  }]);


  // expose things for testging
  App.module = {
    C: {},
    D: {},
    S: {}
  };

  window.App = App;

})();
