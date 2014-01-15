(function() {
  'use strict';

  angular.module('App').directive('incheiere', function(Incheiere, ScopeUtils) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        procedura: '=',
        actiune: '=',
        date: '='
      },
      templateUrl: 'incheiere-directive',
      controller: 'IncheiereDirectiveController',


      link: function($scope, $element) {
        $($element).on('click', '.document', function() {
          Incheiere.deschide(ScopeUtils.appData($scope));
        });
      }

    };
  });

})();
