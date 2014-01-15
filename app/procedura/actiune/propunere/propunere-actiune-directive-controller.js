(function () {
  'use strict';

  angular.module('App').controller('PropunereActiuneDirectiveController', function($scope, Actiuni) {
    $scope.adaugaActiune = Actiuni.adauga;
  });

})();
