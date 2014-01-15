/*global Calendar */
(function() {
  'use strict';

  angular.module('App').directive('actiune', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        date: '=',
        procedura: '='
      },
      templateUrl: 'actiune-directive',

      link: function(scope, el) {
        setTimeout(function() {
          Calendar.insereazăButoane(el);
        }, 200);
      },

      controller: 'Actiune'
    };
  });

})();

