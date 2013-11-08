(function() {
  'use strict';

  function AdaugaSuma() {
    return {
      restrict: 'A',

      scope: {
        lista: '='
      },

      link: AdaugaSuma.module.link
    };
  }

  window.App.module.D.AdaugaSuma = AdaugaSuma;
  window.App.directive('adaugaSuma', AdaugaSuma);

  AdaugaSuma.module = {
    link: function (scope, el) {
      $(el).on('click', function() {
        var suma = {
          eticheta: '',
          suma: null,
          valuta: 'MDL',
          adaugare: true
        };

        scope.lista.push(suma);
        scope.$apply();
      });
    }
  };

})();

