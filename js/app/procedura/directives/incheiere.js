/*global moment, FORMATUL_DATEI*/
(function() {
  'use strict';

  var TAXE = {
    'intentare': 1
  };

  function Incheiere() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directive-incheiere',
      scope: {
        procedura: '=',
        actiune: '='
      },

      controller: ['$scope', '$element', 'Storage', function($scope, $element, Storage) {
        $scope.date = $scope.date || Incheiere.module.defaults($scope.actiune);
        $scope.date.href = Storage.PREFIX + Incheiere.module.getHref($scope.procedura, $scope.actiune, $scope.date);

        $scope.date.formular = Incheiere.module.formular($scope.actiune);

        $scope.$watch('date.achitat', function(newVal, oldVal) {
          Incheiere.module.sincronizeazaCimpulPentruData($element, newVal, oldVal);
        });
      }],

      link: function($scope, $element, $attrs) {
        $($element).on('click', '.document', function() {
          Incheiere.module.deschide(this);
        });

        return [$scope, $element, $attrs];
      }
    };
  }


  Incheiere.module = {
    deschide: function(el) {

      // TODO: portează codul din Încheieri.deschide[2]?

      return el;
    },


    defaults: function(actiune) {
      return {
        taxa: TAXE[actiune.identificator]
      };
    },


    formular: function(actiune) {
      return function() {
        return '/formulare-încheieri/' + actiune.identificator + '.html';
      };
    },


    getHref: function(procedura, actiune, document) {
      return 'proceduri/' + procedura['numărul'] +
          '/actiuni/' + actiune.identificator + '/' + document.denumire + '.html';
    },


    sincronizeazaCimpulPentruData: function(elementIncheiere, isChecked) {
      if (isChecked) {
        var dataCurenta = moment().format(FORMATUL_DATEI);

        $(elementIncheiere).find('.dată').val(dataCurenta);
      }
    }
  };


  window.App.module.D.Incheiere = Incheiere.module;
  window.App.directive('incheiere', Incheiere);

})();
