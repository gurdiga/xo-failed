/*global Calendar*/
(function() {
  'use strict';

  function Actiune() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        date: '=',
        procedura: '='
      },
      templateUrl: 'directive-actiune',

      link: function(scope, el) {
        setTimeout(function() {
          Calendar.insereazăButoane(el);
        }, 200);
      }
    };
  }


  window.App.directive('actiune', Actiune);

})();

