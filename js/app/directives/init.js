(function() {
  'use strict';

  var App = window.App;

  App.Directives = {
    init: function(app) {
      this.initDirectives(app);
    },

    initDirectives: function(app) {
      function defineDirective(name, directiveDefinitionObject) {
        function factory() {
          if ('dependencies' in directiveDefinitionObject) {
            var dependencies = {},
                args = arguments;

            directiveDefinitionObject.dependencies.forEach(function(name, i) {
              dependencies[name] = args[i];
            });

            directiveDefinitionObject.dependencies = dependencies;
          }

          return directiveDefinitionObject;
        }

        factory.$inject = directiveDefinitionObject.dependencies;
        app.directive(name, factory);
      }

      for (var name in App.Directives) {
        if (name.substr(0, 4) === 'init') continue;

        var nameCamelized = S(name).dasherize().chompLeft('-').camelize().toString();

        defineDirective(nameCamelized, App.Directives[name]);
      }
    }
  };

})();
