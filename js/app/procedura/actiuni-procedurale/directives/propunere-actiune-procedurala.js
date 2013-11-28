(function() {
  'use strict';

  function PropunereActiuneProcedurala() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        date: '='
      },
      templateUrl: 'directive-propunere-actiune-procedurala'
    };
  }


  window.App.directive('propunereActiuneProcedurala', PropunereActiuneProcedurala);

})();
