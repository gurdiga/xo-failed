(function() {
  'use strict';

  function Utilizator() {
    var profil = {};

    function încarcăProfil() {
        $.get('/date/007/profil.json', function(profilÎncarcat) {
          $.extend(profil, profilÎncarcat, {login: $.cookie('login')});
        });
    }

    return {
      login: '',

      profil: profil,

      încarcăProfil: încarcăProfil
    };
  }


  window.App.service('Utilizator', Utilizator);

})();
