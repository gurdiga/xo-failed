(function() {
  'use strict';

  angular.module('App').directive('sectiune', function() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        titlu: '@',
        lata: '@'
      },
      templateUrl: 'sectiune-directive'
    };
  });

})();
