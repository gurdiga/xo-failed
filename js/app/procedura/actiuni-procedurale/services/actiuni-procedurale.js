(function() {
  'use strict';

  function ActiuniProcedurale() {
    var succesiune = {
      '': ['intentare', 'intentare-cu-asigurare'],
      'intentare': ['continuare', 'încetare'],
      'intentare-cu-asigurare': ['continuare', 'încetare'],
      'continuare': [],
      'încetare': []
    };

    // test that it’s in sync with succesiune
    var descrieri = {
      'intentare': 'Intentarea şi formarea procedurii de executare',
      'intentare-cu-asigurare': 'Intentarea şi formarea procedurii de executare, plus asigurarea executării',
      'TODO': 'TODO'
    };


    function optiuniPentruUrmatoareaActiune(actiuni) {
      if (_.isEmpty(actiuni)) return [];

      var ultima = _.last(actiuni),
          identificatori = succesiune[ultima.identificator];

      return identificatori.map(function(identificator) {
        return {
          identificator: identificator,
          descriere: descrieri[identificator]
        };
      });
    }


    return {
      date: {},
      optiuniPentruUrmatoareaActiune: optiuniPentruUrmatoareaActiune
    };
  }


  window.App.service('ActiuniProcedurale', ActiuniProcedurale);

})();
