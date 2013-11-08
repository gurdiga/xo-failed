(function() {
  'use strict';

  function ServiceAcţiuniProcedurale() {
    var opţiuni = {
      '': ['intentare', 'intentare-cu-asigurare'],
      'intentare': ['continuare', 'încetare'],
      'intentare-cu-asigurare': ['continuare', 'încetare'],
      'continuare': [],
      'încetare': []
    };


    function următoareleAcţiuni(procedura) {
      var ultima = _.last(procedura['acţiuni-procedurale']);

      return opţiuni[ultima.identificator];
    }


    return {
      următoareleAcţiuni: următoareleAcţiuni
    };
  }


  window.App.service(ServiceAcţiuniProcedurale);

})();
