(function() {
  'use strict';

  var App = window.App;

  App.Controllers = {
    init: function(app) {
      for (var name in App.Controllers) {
        if (name === 'init') continue;

        app.controller(name, Controller.factory(name, App.Controllers[name]));
      }
    }
  };


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

})();
