(function() {
  'use strict';

  angular.module('App').service('Actiuni', function() {
    var SUCCESIUNE = {
      '': ['intentare', 'intentare-cu-asigurare'],
      'intentare': ['continuare', 'încetare'],
      'intentare-cu-asigurare': ['continuare', 'încetare'],
      'continuare': [],
      'încetare': []
    };

    var DATE = {
      'intentare': {
        denumire: 'Intentarea şi formarea procedurii de executare',
        incheiere: {
          titlu: 'Încheiere',
          subtitlu: 'cu privire la intentarea procedurii de executare',
          taxa: 1
        }
      },
      'intentare-cu-asigurare': {
        denumire: 'Intentarea şi formarea procedurii de executare, plus asigurarea executării',
        incheiere: {
          taxa: 1
        }
      },
      'continuare': {
        denumire: 'continuare',
        incheiere: {}
      },
      'încetare': {
        denumire: 'încetare',
        incheiere: {}
      },
      'TODO': {
        denumire: 'TODO',
        incheiere: {}
      }
    };


    function optiuniPentruUrmatoareaActiune(actiuni) {
      var ultima = _.last(actiuni) || { identificator: '' },
          identificatori = SUCCESIUNE[ultima.identificator];

      return identificatori.map(function(identificator) {
        return {
          identificator: identificator,
          denumire: DATE[identificator].denumire
        };
      });
    }


    function adauga(identificator, procedura) {
      var actiune = {
        identificator: identificator
      };

      js.extend(actiune, DATE[identificator]);

      procedura['acţiuni'].push(actiune);
    }


    return {
      date: {},
      optiuniPentruUrmatoareaActiune: optiuniPentruUrmatoareaActiune,
      adauga: adauga
    };
  });

})();
