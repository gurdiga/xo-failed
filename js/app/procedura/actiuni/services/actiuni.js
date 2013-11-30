(function() {
  'use strict';

  function Actiuni() {
    var succesiune = {
      '': ['intentare', 'intentare-cu-asigurare'],
      'intentare': ['continuare', 'încetare'],
      'intentare-cu-asigurare': ['continuare', 'încetare'],
      'continuare': [],
      'încetare': []
    };

    // test that it’s in sync with succesiune
    var denumiri = {
      'intentare': 'Intentarea şi formarea procedurii de executare',
      'intentare-cu-asigurare': 'Intentarea şi formarea procedurii de executare, plus asigurarea executării',
      'continuare': 'continuare',
      'încetare': 'încetare',
      'TODO': 'TODO'
    };


    function optiuniPentruUrmatoareaActiune(actiuni) {
      var ultima = _.last(actiuni) || { identificator: '' },
          identificatori = succesiune[ultima.identificator];

      return identificatori.map(function(identificator) {
        return {
          identificator: identificator,
          denumire: denumiri[identificator]
        };
      });
    }


    function adauga(identificator, procedura) {
      var actiune = {
        identificator: identificator,
        denumire: denumiri[identificator]
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
