(function () {
  'use strict';


  window.Evenimente = {
    întîmplat: {},

    aşteaptă: function (evenimente) {
      for (var i = 0, l = evenimente.length; i < l; i++) {
        this.întîmplat[evenimente[i]] = false;
      }
    },

    venit: function (e) {
      /*jshint maxcomplexity:6*/
      var întîmplat = this.întîmplat,
          venitToate = true;

      for (var eveniment in întîmplat) {
        if (!întîmplat.hasOwnProperty(eveniment)) continue;
        if (eveniment === e.type) întîmplat[eveniment] = true;
        if (!întîmplat[eveniment]) venitToate = false;
      }

      if (venitToate) start();
    }
  };

})();
