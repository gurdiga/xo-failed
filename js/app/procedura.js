(function() {
  'use strict';

  var Procedura = {
    date: {
      'data-intentării': '12'
    },

    deschide: function(număr) {
      Procedura.incarca(număr);
    },

    incarca: function(număr) {
      $.get('/date/007/proceduri/' + număr + '/date.json', function(data) {
        $.extend(Procedura.date, data);
        Procedura.sync();
      });
    }
  };


  window.App.Procedura = Procedura;

})();
