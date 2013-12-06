/*global moment, FORMATUL_DATEI*/
(function() {
  'use strict';

  function Document() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directive-document',
      scope: {
        date: '=',
        procedura: '=',
        actiune: '='
      },
      controller: ['$scope', '$element', 'Storage', function($scope, $element, Storage) {
        $scope.date.href = Storage.PREFIX + Document.module.getHref($scope.procedura, $scope.actiune, $scope.date);

        $scope.$watch('date.achitat', function(newVal, oldVal) {
          Document.module.sincronizeazaCimpulPentruData($element, newVal, oldVal);
        });
      }]
    };
  }


  Document.module = {
    getHref: function(procedura, actiune, document) {
      return 'proceduri/' + procedura['numărul'] +
          '/actiuni/' + actiune.identificator + '/' + document.denumire + '.html';
    },

    sincronizeazaCimpulPentruData: function(elementDocument, isChecked) {
      if (isChecked) {
        var dataCurenta = moment().format(FORMATUL_DATEI);

        $(elementDocument).find('.dată').val(dataCurenta);
      }
    }
  };


  window.App.module.D.Document = Document.module;
  window.App.directive('document', Document);

})();
