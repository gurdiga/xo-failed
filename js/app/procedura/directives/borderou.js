(function() {
  'use strict';

  function Borderou() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        actiuni: '='
      },
      controller: ['$scope', '$element', 'Storage', function($scope, $element, Storage) {
        return [$scope, $element, Storage];
      }],
      templateUrl: 'directive-borderou'
    };
  }


  window.App.directive('borderou', Borderou);

})();
