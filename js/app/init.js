/*global angular*/
(function() {
  'use strict';

  var App = {
    init: function() {
      var app = angular.module('App', []);

      App.init.controllers(app);
    }
  };


  App.init.controllers = function(app) {
    function Controller($scope, module) {
      if ($.isFunction(module.init)) module.init();

      this.publishToScope = function() {
        $.extend($scope, module);
      };

      this.makeSynchronizable = function() {
        module.sync = function() {
          $scope.$apply();
        };
      };
    }

    Controller.factory = function(name, module) {
      return ['$scope', function($scope) {
        var controller = new Controller($scope, module);

        controller.publishToScope();
        controller.makeSynchronizable();
      }];
    };

    for (var name in App) {
      if (name === 'init') continue;

      app.controller(name, Controller.factory(name, App[name]));
    }

  };


  App.init.router = function(app) {
    App.Router.init(app);
  };


  window.App = App;

})();
