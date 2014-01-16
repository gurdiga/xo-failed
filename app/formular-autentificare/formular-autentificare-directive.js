(function () {
  'use strict';

  angular.module('App').directive('formularAutentificare', function () {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'formular-autentificare-directive',
      controller: 'FormularAutentificareDirectiveController'
    };
  });

}());
