/*global FORMATUL_DATEI, moment */
(function() {
  'use strict';

  angular.module('App').controller('Actiune', function($scope) {
    var actiune = $scope.date;

    if (!actiune.data) actiune.data = moment().format(FORMATUL_DATEI);
  });

})();
