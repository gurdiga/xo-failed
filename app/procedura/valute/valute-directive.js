(function () {
  'use strict';

  angular.module('App').directive('valute', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: { suma: '=' },
      controller: 'ValuteDirectiveController',
      templateUrl: 'valute-directive'
    };
  });

}());
