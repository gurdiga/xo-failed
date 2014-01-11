(function() {
  'use strict';

  function Sectiune() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        titlu: '@',
        lata: '@'
      },
      templateUrl: 'directive-sectiune'
    };
  }


  window.App.directive('sectiune', Sectiune);

})();
