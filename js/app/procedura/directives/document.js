(function() {
  'use strict';

  function Document() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        date: '='
      },
      controller: ['$scope', 'Storage', function($scope, Storage) {
        var actiune   = $scope.$parent.$parent.date,
            procedura = $scope.$parent.$parent.$parent.$parent.$parent.$parent.procedura;

        $scope.date.href = Storage.PREFIX + 'proceduri/' + procedura['numărul'] + '/actiuni/' + actiune.identificator + '.html';
      }],
      templateUrl: 'directive-document'
    };
  }


  window.App.directive('document', Document);

})();
