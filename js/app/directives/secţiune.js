(function() {
  'use strict';

  var Secţiune = {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      titlu: '@'
    },
    templateUrl: 'directive-secţiune'
  };


  window.App.Directives.Secţiune = Secţiune;

})();
