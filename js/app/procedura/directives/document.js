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
      controller: ['$scope', 'Storage', function($scope, Storage) {
        // actiune - trebuie să conţină şi taxa
        $scope.date.href = Storage.PREFIX + 'proceduri/' + $scope.procedura['numărul'] +
            '/actiuni/' + $scope.actiune.identificator + '.html';
      }],
      templateUrl: 'directive-document'
    };
  }


  window.App.directive('document', Document);

})();
