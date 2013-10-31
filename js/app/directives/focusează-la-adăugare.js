(function() {
  'use strict';

  var FocuseazăLaAdăugare = {
    restrict: 'A',

    link: function (scope, element) {
      if (scope.$last) {
        if (scope.suma.adăugare) {
          delete scope.suma.adăugare;

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

  window.App.Directives.FocuseazăLaAdăugare = FocuseazăLaAdăugare;

})();

