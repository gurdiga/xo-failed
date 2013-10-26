(function() {
  'use strict';

  var Persoană = {
    restrict: 'E',
    replace: true,
    scope: {
      date: '='
    },
    templateUrl: 'directive-persoană'
  };


  window.App.Directives.Persoană = Persoană;

})();
