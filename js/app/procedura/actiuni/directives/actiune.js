/*global Calendar, FORMATUL_DATEI, moment */
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
          Actiune.module.setuptCalendar(el);
        }, 200);
      },

      controller: ['$scope', function($scope) {
        Actiune.module.setModelDefaults($scope.date);
      }]
    };
  }

  Actiune.module = {
    setModelDefaults: function(actiune) {
      if (!actiune.data) actiune.data = moment().format(FORMATUL_DATEI);
    },

    setuptCalendar: function(el) {
      Calendar.insereazăButoane(el);
    }
  };


  window.App.module.D.Actiune = Actiune;
  window.App.directive('actiune', Actiune);

})();

