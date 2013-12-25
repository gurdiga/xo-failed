(function() {
  'use strict';

  var app = window.frames['app'];

  module('C.Incheiere', {
    setup: function() {
      this.$injector = app.angular.injector(['App']);
      this.controller = this.$injector.get('$controller');
    }
  });


  test('controller', function() {
    var $scope = {
      date: {},
      procedura: {},
      actiune: {},
      $watch: sinon.spy()
    };

    this.controller('Incheiere', {
      $scope: $scope,
      $element: app.angular.element(),
      Storage: this.$injector.get('Storage'),
      Incheiere: this.$injector.get('Incheiere'),
    });

    ok('href' in $scope.date, 'defineşte date.href');
    ok('formular' in $scope.date, 'defineşte date.formular');

    ok($scope.$watch.called, 'urmareste schimbarile flagului de achitare');
    equal($scope.$watch.getCall(0).args[0], 'date.achitat', 'setează date.achitat');
  });

})();
