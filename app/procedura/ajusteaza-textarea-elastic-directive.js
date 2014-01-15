(function() {
  'use strict';

  function AjusteazaTextareaElastic() {
    return {
      restrict: 'A',

      link: AjusteazaTextareaElastic.module.link
    };
  }

  AjusteazaTextareaElastic.module = {
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

  window.App.module.D.AjusteazaTextareaElastic = AjusteazaTextareaElastic;
  window.App.directive('ajusteazaTextareaElastic', AjusteazaTextareaElastic);

})();
