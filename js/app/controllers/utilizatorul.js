(function() {
  'use strict';

  var Utilizatorul = {
    utilizatorul: {},

    init: function() {
      $.get('/date/007/profil.json', function(date) {
        $.extend(Utilizatorul.utilizatorul, date, {login: $.cookie('login')});
        Utilizatorul.sync();
      });
    }
  };


  window.App.Controllers.Utilizatorul = Utilizatorul;

})();
