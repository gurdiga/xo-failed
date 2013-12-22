(function() {
  'use strict';

  window.App.service('Incheiere', [function() {
    return {
      defaults: module.defaults,
      deschide: module.deschide
    };
  }]);


  var module = {
    defaults: function(actiune) {
      js.assert(js.isPlainObject(actiune), 'D.Incheiere.defaults: primul parametru trebuie să fie acţiunea');

      //
      // TODO: de schiţat defaulturi pentru
      //  - titlu
      //  - descriere
      //  - etc?
      //

      return {
        identificator: actiune.identificator
      };
    },


    deschide: function(date) {
      js.assert(js.isPlainObject(date), 'D.Incheiere.deschide: primul parametru trebuie să fie PlainObject');

      var href = date.href() || date.formular();
      var popup = window.open(href, href, 'left=100,width=1000,height=1000');

      $(popup).on('load', function() {
        popup.onunload = popup.close; // do not allow reload

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
