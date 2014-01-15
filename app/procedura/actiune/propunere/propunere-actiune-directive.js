(function () {
  'use strict';

  angular.module('App').directive('propunereActiune', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        date: '=',
        procedura: '='
      },
      templateUrl: 'propunere-actiune-directive',
      controller: 'PropunereActiuneDirectiveController'
    };
  });

}());
