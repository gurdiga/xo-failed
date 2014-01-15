(function() {
  'use strict';

  angular.module('App').directive('ajusteazaTextareaElastic', function() {
    return {
      restrict: 'A',

      link: function(scope, element) {
        if (scope.$last === true) {
          setTimeout(function() {
            var repeatExpression = element[0].getAttribute('ng-repeat');

            $(element)
              .siblings('[ng-repeat="' + repeatExpression + '"]').andSelf()
                .children('textarea.etichetă').trigger('input');
          }, 0);
        }
      }
    };
  });

})();
