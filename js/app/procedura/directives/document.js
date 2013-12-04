/*global moment, FORMATUL_DATEI*/
(function() {
  'use strict';

  function Document() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        date: '=',
        procedura: '=',
        actiune: '='
      },
      controller: ['$scope', '$element', 'Storage', function($scope, $element, Storage) {
        $scope.date.href = Storage.PREFIX + 'proceduri/' + $scope.procedura['numărul'] +
            '/actiuni/' + $scope.actiune.identificator + '.html';

        $scope.$watch('date.achitat', function(isChecked, wasChecked) {
          if (isChecked) {
            var dataCurenta = moment().format(FORMATUL_DATEI);

            $($element).find('.dată').val(dataCurenta);
          }
        });
      }],
      templateUrl: 'directive-document'
    };
  }


  window.App.directive('document', Document);

})();
