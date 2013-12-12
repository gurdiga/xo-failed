(function() {
  'use strict';

  function Actiuni() {
    var SUCCESIUNE = {
      '': ['intentare', 'intentare-cu-asigurare'],
      'intentare': ['continuare', 'încetare'],
      'intentare-cu-asigurare': ['continuare', 'încetare'],
      'continuare': [],
      'încetare': []
    };

    var DENUMIRI = {
      'intentare': 'Intentarea şi formarea procedurii de executare',
      'intentare-cu-asigurare': 'Intentarea şi formarea procedurii de executare, plus asigurarea executării',
      'continuare': 'continuare',
      'încetare': 'încetare',
      'TODO': 'TODO'
    };


    function optiuniPentruUrmatoareaActiune(actiuni) {
      var ultima = _.last(actiuni) || { identificator: '' },
          identificatori = SUCCESIUNE[ultima.identificator];

      return identificatori.map(function(identificator) {
        return {
          identificator: identificator,
          denumire: DENUMIRI[identificator]
        };
      });
    }


    function adauga(identificator, procedura) {
      var actiune = {
        identificator: identificator,
        denumire: DENUMIRI[identificator]
      };

      procedura['acţiuni'].push(actiune);
    }


    return {
      date: {},
      optiuniPentruUrmatoareaActiune: optiuniPentruUrmatoareaActiune,
      adauga: adauga
    };
  }


  window.App.service('Actiuni', Actiuni);

})();
