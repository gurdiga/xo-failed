(function() {
  'use strict';

  function ActiuneProcedurala() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        date: '='
      },
      templateUrl: 'directive-actiune-procedurala'
    };
  }


  window.App.directive('actiuneProcedurala', ActiuneProcedurala);

})();

