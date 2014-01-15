(function() {
  'use strict';

  angular.module('App').directive('adaugaSuma', function() {
    return {
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
            adaugare: true
          };

          scope.lista.push(suma);
          scope.$apply();
        });
      }
    };
  });

})();

