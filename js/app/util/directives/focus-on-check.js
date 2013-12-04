(function() {
  'use strict';

  function FocusOnCheck() {
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
  }

  window.App.directive('focusOnCheck', FocusOnCheck);

})();



