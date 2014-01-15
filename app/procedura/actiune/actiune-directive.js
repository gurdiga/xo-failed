/*global Calendar, FORMATUL_DATEI, moment */
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
      templateUrl: 'directive-actiune',

      link: function(scope, el) {
        setTimeout(function() {
          Calendar.insereazăButoane(el);
        }, 200);
      },

      controller: 'Actiune'
    };
  });

  angular.module('App').controller('Actiune', function($scope) {
    var actiune = $scope.date;

    if (!actiune.data) actiune.data = moment().format(FORMATUL_DATEI);
  });

})();

