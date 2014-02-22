(function() {
  'use strict';

  angular.module('XO', ['ngRoute', 'firebase'])

  .controller('ExperimentsController', function() {
  });


  angular.element(document).ready(function() {
    angular.bootstrap(angular.element('[ng-app="XO"]'), ['XO']);
  });

}());
