/*global moment, FORMATUL_DATEI*/
(function() {
  'use strict';

  window.App.directive('incheiere', ['Incheiere', function(Incheiere) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directive-incheiere',
      scope: {
        procedura: '=',
        actiune: '=',
        date: '='
      },

      controller: ['$scope', '$element', 'Storage', 'Incheiere', module.controller],

      link: function($scope, $element) {
        module.link($scope, $element, Incheiere);
      }
    };
  }]);


  var module = {
    controller: function($scope, $element, Storage, Incheiere) {
      if (js.isEmpty($scope.date)) {
        js.extend($scope.date, Incheiere.defaults($scope.actiune));
      }

      $scope.date.href = module.href(Storage, $scope.procedura, $scope.actiune, $scope.date);
      $scope.date.formular = module.formular($scope.actiune);

      $scope.$watch('date.achitat', function(newVal, oldVal) {
        module.sincronizeazaCimpulPentruData($element, newVal, oldVal);
      });
    },


    link: function($scope, $element, Incheiere) {
      $($element).on('click', '.document', function() {
        Incheiere.deschide($scope.date);
      });
    },


    formular: function(actiune) {
      js.assert(js.isPlainObject(actiune), 'D.Incheiere.formular: primul parametru trebuie să fie acţiunea');

      return function() {
        //return '/formulare-încheieri/' + actiune.identificator + '.html';
        return '/formulare/incheiere.html';
      };
    },


    href: function(Storage, procedura, actiune, document) {
      js.assert(js.isPlainObject(Storage), 'D.Incheiere.href: primul parametru trebuie să fie S.Storage');
      js.assert(js.isPlainObject(procedura), 'D.Incheiere.href: al doilea parametru trebuie să fie procedura');
      js.assert(js.isPlainObject(actiune), 'D.Incheiere.href: al treilea parametru trebuie să fie acţiunea');
      js.assert(js.isPlainObject(document), 'D.Incheiere.href: al patrulea parametru trebuie să fie documentul');

      return function() {
        var proceduraNoua = !procedura['numărul'];

        if (proceduraNoua) return '';

        return Storage.PREFIX + 'proceduri/' + procedura['numărul'] +
            '/actiuni/' + actiune.identificator + '/' + document.denumire + '.html';
      };
    },


    sincronizeazaCimpulPentruData: function(elementIncheiere, isChecked) {
      if (isChecked) {
        var dataCurenta = moment().format(FORMATUL_DATEI);

        $(elementIncheiere).find('.dată').val(dataCurenta);
      }
    }
  };


  window.App.module.D.Incheiere = module;

})();
