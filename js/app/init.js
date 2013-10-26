/*global angular*/
(function() {
  'use strict';

  var App = {
    init: function() {
      var app = angular.module('App', ['ngRoute']);

      app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
          .when('/', {
            template: ' ',
            controller: function($scope, $routeParams) {
              console.log('/ controller', arguments);
            }
          })

          .when('/procedura/:numar', {
            template: ' ',
            controller: function($scope, $routeParams) {
              console.log('/procedura/:număr controller', $routeParams.numar);
            }
          })

          .otherwise({redirectTo: '/'})
      }]);

      App.Controllers.init(app);
      App.Directives.init(app);
      App.initTemplateCache(app);
    },

    initTemplateCache: function(app) {
      var templates = document.querySelectorAll('script[type="text/ng-template"]');

      templates = Array.prototype.slice.call(templates);

      function registerTemplate(template) {
        app.run(['$templateCache', function($templateCache) {
          $templateCache.put(template.id, template.innerHTML);
        }]);
      }

      templates.forEach(registerTemplate);
    }
  };


  window.App = App;

})();
