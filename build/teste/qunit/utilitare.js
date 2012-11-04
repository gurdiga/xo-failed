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
      /*jshint maxcomplexity:5*/
      var întîmplat = this.întîmplat;

      for (var eveniment in întîmplat) {
        if (!întîmplat.hasOwnProperty(eveniment)) continue;
        if (eveniment === e.type) întîmplat[eveniment] = true;
        if (!întîmplat[eveniment]) return;
      }

      start();
    }
  };

})();
