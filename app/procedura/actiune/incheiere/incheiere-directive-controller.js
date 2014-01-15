(function() {
  'use strict';

  angular.module('App').controller('IncheiereDirectiveController', function($scope, $element, Incheiere) {
    if (js.isEmpty($scope.date)) {
      js.extend($scope.date, Incheiere.defaults($scope.actiune));
    }

    $scope.date.href = Incheiere.href($scope.procedura, $scope.actiune, $scope.date);
    $scope.date.formular = Incheiere.formular($scope.actiune);

    $scope.$watch('date.achitat', function(newVal) {
      Incheiere.sincronizeazaCimpulPentruData($scope.date, newVal);
    });
  });

})();
