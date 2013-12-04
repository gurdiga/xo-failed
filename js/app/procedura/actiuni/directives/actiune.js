(function() {
  'use strict';

  function Actiune() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        date: '=',
        procedura: '='
      },
      templateUrl: 'directive-actiune'
    };
  }


  window.App.directive('actiune', Actiune);

})();

