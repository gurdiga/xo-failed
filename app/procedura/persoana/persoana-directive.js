(function() {
  'use strict';

  angular.module('App').directive('Persoana', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        date: '='
      },
      templateUrl: 'persoana-directive'
    };
  });

})();
