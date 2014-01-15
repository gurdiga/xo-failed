(function() {
  'use strict';

  angular.module('App').directive('FocuseazaLaAdaugare', function() {
    return {
      restrict: 'A',

      link: function(scope, element) {
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
  });

})();

