(function() {
  'use strict';

  function Utilizator(USER_LOGIN, Persistence) {
    var date = {
      login: USER_LOGIN,
      profil: {}
    };


    function incarcaProfil() {
      Persistence.get('profil.json', function(profilÎncarcat) {
        $.extend(date.profil, profilÎncarcat, {login: $.cookie('login')});
      });
    }

    return {
      date: date,
      incarcaProfil: incarcaProfil
    };
  }

  Utilizator.$inject = ['USER_LOGIN', 'Persistence'];

  window.App.service('Utilizator', Utilizator);

})();
