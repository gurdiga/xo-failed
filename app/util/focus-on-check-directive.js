(function() {
  'use strict';

  angular.module('App').directive('focusOnCheck', function() {
    return {
      restrict: 'A',

      link: function(scope, el, attrs) {
        var fieldSelector = attrs.focusOnCheck;

        el.on('change', function() {
          if (this.checked) {
            setTimeout(function() {
              var field = $(el).parent().find(fieldSelector);

              field.focus();
            }, 200);
          }
        });
      }
    };
  });


})();
