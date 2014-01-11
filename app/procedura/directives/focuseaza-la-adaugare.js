(function() {
  'use strict';

  function FocuseazaLaAdaugare() {
    return {
      restrict: 'A',
      link: FocuseazaLaAdaugare.module.link
    };
  }

  FocuseazaLaAdaugare.module = {
    link: function (scope, element) {
      if (scope.$last) {
        if (scope.suma.adaugare) {
          delete scope.suma.adaugare;

          var input = $(element).find(':input:first');

          setTimeout(function() {
            input.focus();
            input.removeClass('test-focusat'); // pentru testabilitate
          }, 200);

          input.addClass('test-focusat'); // pentru testabilitate
        }
      }
    }
  };

  window.App.module.D.FocuseazaLaAdaugare = FocuseazaLaAdaugare;
  window.App.directive('focuseazaLaAdaugare', FocuseazaLaAdaugare);

})();

