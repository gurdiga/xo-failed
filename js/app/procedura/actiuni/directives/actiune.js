(function() {
  'use strict';

  function Actiune() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        date: '='
      },
      templateUrl: 'directive-actiune'
    };
  }


  window.App.directive('actiune', Actiune);

})();

