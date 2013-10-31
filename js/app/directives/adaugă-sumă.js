(function() {
  'use strict';

  var AdaugăSumă = {
    restrict: 'A',

    scope: {
      lista: '='
    },

    link: function (scope, el) {
      $(el).on('click', function() {
        var suma = {
          eticheta: '',
          suma: null,
          valuta: 'MDL',
          adăugare: true
        };

        scope.lista.push(suma);
        scope.$apply();
      });
    }
  };

  window.App.Directives.AdaugăSumă = AdaugăSumă;

})();

