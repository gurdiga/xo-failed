(function() {
  'use strict';

  angular.module('App').directive('borderou', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        actiuni: '='
      },
      controller: 'BorderouDirectiveController',
      templateUrl: 'borderou-directive'
    };
  });

})();
