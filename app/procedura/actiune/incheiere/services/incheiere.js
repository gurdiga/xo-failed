/*global moment, FORMATUL_DATEI*/
(function() {
  'use strict';

  window.App.service('Incheiere', ['Utilizator', 'Storage', function(Utilizator, Storage) {
    this.defaults = function(actiune) {
      js.assert(js.isPlainObject(actiune), 'S.Incheiere.defaults: primul parametru trebuie să fie acţiunea');

      //
      // TODO???: de schiţat defaulturi pentru
      //  - titlu
      //  - descriere
      //  - etc?
      //

      return {
        identificator: actiune.identificator
      };
    };


    this.deschide = function(directiveScopeData) {
      js.assert(js.isPlainObject(directiveScopeData), 'S.Incheiere.deschide: primul parametru trebuie să fie PlainObject');

      var href = directiveScopeData.date.href || directiveScopeData.date.formular;
      var popup = window.open(href, href, 'left=100,width=1000,height=1000');

      // For some reason, upon angular.bootstrap() call below the
      // opener scrolls to the top. This is a workaround.
      function holdScrollPosition(fn) {
        return function() {
          var scrollPosition = document.body.scrollTop,
              fnReturnValue = fn();

          document.body.scrollTop = scrollPosition;
          return fnReturnValue;
        };
      }


      $(popup).on('load', holdScrollPosition(function() {
        popup.onunload = popup.close; // do not allow reload

        var numeModul = 'Incheiere',
            numeController = 'ControllerIncheiere';

        angular.module(numeModul, [])
          .controller(numeController, ['$scope', function($scope) {
            js.extend($scope, directiveScopeData, {
              utizator: Utilizator.date
            });
          }]);

        var rootEl = popup.document.documentElement;

        rootEl.setAttribute('ng-controller', numeController);
        angular.bootstrap(rootEl, [numeModul]);
      }));
    };


    this.formular = function(actiune) {
      js.assert(js.isPlainObject(actiune), 'D.Incheiere.formular: primul parametru trebuie să fie acţiunea');

      //return '/formulare-încheieri/' + actiune.identificator + '.html';
      return '/formulare/incheiere.html';
    };


    this.href = function(procedura, actiune, document) {
      js.assert(js.isPlainObject(Storage), 'D.Incheiere.href: primul parametru trebuie să fie S.Storage');
      js.assert(js.isPlainObject(procedura), 'D.Incheiere.href: al doilea parametru trebuie să fie procedura');
      js.assert(js.isPlainObject(actiune), 'D.Incheiere.href: al treilea parametru trebuie să fie acţiunea');
      js.assert(js.isPlainObject(document), 'D.Incheiere.href: al patrulea parametru trebuie să fie documentul');

      var proceduraNoua = !procedura['numărul'];

      if (proceduraNoua) return '';

      return Storage.PREFIX + 'proceduri/' + procedura['numărul'] +
          '/actiuni/' + actiune.identificator + '/' + document.denumire + '.html';
    };


    this.sincronizeazaCimpulPentruData = function(date, isChecked) {
      if (isChecked) {
        var dataCurenta = moment().format(FORMATUL_DATEI);

        date['data-achitării'] = dataCurenta;
      }
    };

  }]);

})();
