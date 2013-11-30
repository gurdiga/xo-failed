(function() {
  'use strict';

  function Utilizator(USER_LOGIN, Storage) {
    var date = {
      login: USER_LOGIN,
      profil: {}
    };


    function incarcaProfil() {
      Storage.get('profil.json', function(profilÎncarcat) {
        $.extend(date.profil, profilÎncarcat, {login: $.cookie('login')});
      });
    }

    return {
      date: date,
      incarcaProfil: incarcaProfil
    };
  }

  Utilizator.$inject = ['USER_LOGIN', 'Storage'];

  window.App.service('Utilizator', Utilizator);

})();
