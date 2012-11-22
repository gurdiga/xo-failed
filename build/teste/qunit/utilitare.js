(function () {
  'use strict';


  window.Evenimente = {
    aşteptate: [],

    aşteaptă: function (eveniment) {
      this.aşteptate.push(eveniment);
    },

    anunţă: function (eveniment) {
      var index = this.aşteptate.indexOf(eveniment);

      if (index === -1) throw 'Venit eveniment neaşteptat: ' + eveniment;

      this.aşteptate.splice(index, 1);

      if (this.aşteptate.length === 0) QUnit.start();
    }
  };

})();
