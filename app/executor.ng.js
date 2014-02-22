(function() {
  'use strict';

  angular.module('XO').service('Executor', function() {
    return XO.Executor(
      XO.AuthenticationService,
      XO.generatePassword,
      XO.DataService
    );
  });

}());
