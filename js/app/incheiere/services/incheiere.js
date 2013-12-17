(function() {
  'use strict';

  window.App.service('Incheiere', [function() {
    return {
      deschide: module.deschide
    };
  }]);


  var module = {
    deschide: function(date) {
      js.assert(js.isPlainObject(date), 'D.Incheiere.deschide: primul parametru trebuie să fie PlainObject');

      var href = date.href() || date.formular();
      var popup = window.open(href, href, 'left=100,width=1000,height=1000');

      $(popup).on('load', function() {
        var numeModul = 'Incheiere',
            numeController = 'ControllerIncheiere';

        angular.module(numeModul, [])
          .controller(numeController, ['$scope', function($scope) {
            $scope.date = date;
          }]);

        var rootEl = popup.document.documentElement;

        rootEl.setAttribute('ng-controller', numeController);
        angular.bootstrap(rootEl, [numeModul]);
      });
    }
  };


  window.App.module.S.Incheiere = module;

})();
