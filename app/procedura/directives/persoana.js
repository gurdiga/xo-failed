(function() {
  'use strict';

  function Persoana() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        date: '='
      },
      templateUrl: 'directive-persoana'
    };
  }


  window.App.directive('persoana', Persoana);

})();
