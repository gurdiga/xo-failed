(function() {
  'use strict';

  window.App.directive('incheiere', ['Incheiere', 'ScopeUtils', function(Incheiere, ScopeUtils) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directive-incheiere',
      scope: {
        procedura: '=',
        actiune: '=',
        date: '='
      },
      controller: 'Incheiere',


      link: function($scope, $element) {
        $($element).on('click', '.document', function() {
          Incheiere.deschide(ScopeUtils.appData($scope));
        });
      }

    };
  }]);

})();
