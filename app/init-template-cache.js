(function() {
  'use strict';

  angular.module('App').run(function($templateCache) {
    var templates = document.querySelectorAll('script[type="text/ng-template"]');

    templates = Array.prototype.slice.call(templates);

    function registerTemplate(template) {
      $templateCache.put(template.id, template.innerHTML);
    }

    templates.forEach(registerTemplate);
  });

})();
