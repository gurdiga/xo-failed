(function() {
  'use strict';

  var AjusteazăTextareaElastic = {
    restrict: 'A',

    link: function (scope, element) {
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

  window.App.Directives.AjusteazăTextareaElastic = AjusteazăTextareaElastic;

})();
