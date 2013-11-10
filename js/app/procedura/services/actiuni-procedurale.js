(function() {
  'use strict';

  function ActiuniProcedurale() {
    var optiuni = {
      '': ['intentare', 'intentare-cu-asigurare'],
      'intentare': ['continuare', 'încetare'],
      'intentare-cu-asigurare': ['continuare', 'încetare'],
      'continuare': [],
      'încetare': []
    };


    function următoareleAcţiuni(procedura) {
      var ultima = _.last(procedura['acţiuni-procedurale']);

      return optiuni[ultima.identificator];
    }


    return {
      optiuni: optiuni,
      următoareleAcţiuni: următoareleAcţiuni
    };
  }


  window.App.service('ActiuniProcedurale', ActiuniProcedurale);

})();
