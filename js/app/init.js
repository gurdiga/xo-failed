/*global angular*/
(function() {
  'use strict';

  var App = {
    dependencies: ['ngRoute'],

    init: function() {
      var app = angular.module('App', App.dependencies);

      App.Controllers.init(app);
      App.Directives.init(app);
      App.initRouting(app);
      App.initTemplateCache(app);
    },

    initRouting: function(app) {
      app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
          .when('/', {
            template: ' '
          })

          .when('/procedura/:numar', {
            template: ' ',
            controller: ['$scope', '$routeParams', function($scope, $routeParams) {
              App.Controllers.Procedura.deschide($routeParams.numar);
            }]
          })

          .otherwise({redirectTo: '/'});
      }]);
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
