(function () {
  'use strict';


  angular.module('App').directive('formularAutentificare', function () {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'formular-autentificare-directive',
      controller: 'FormularAutentificare'
    };
  });

}());
