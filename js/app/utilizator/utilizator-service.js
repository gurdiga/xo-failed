(function() {
  'use strict';

  var PASSWORD_LENGTH = 20;

  function randomPassword(lenght) {
    function random() {
      return parseFloat('.' + window.crypto.getRandomValues(new window.Uint32Array(1))[0]);
    }

    var characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        password = '',
        i;

    for (i = 0; i < 10; i++) {
      characters += characters;
    }

    for (i = 0; i < lenght; i++) {
      password += characters.charAt(Math.floor(random() * characters.length));
    }

    return password;
  }

  App.service('Utilizator',
         ['USER_LOGIN', 'Storage', 'config', '$firebaseAuth',
  function(USER_LOGIN,   Storage,   config,   $firebaseAuth) {
    var date = this.date = {
      login: USER_LOGIN,
      profil: {}
    };


    this.incarcaProfil = function() {
      Storage.get('profil.json', function(profilÎncarcat) {
        $.extend(date.profil, profilÎncarcat, {login: $.cookie('login')});
      });
    };


    var firebase = new window.Firebase(config.firebaseUrl);

    this.creaza = function(email, aid) {
      //
      // TODO
      //
      var password = window.prompt('Password:', randomPassword(PASSWORD_LENGTH));

      $firebaseAuth(firebase).$createUser(email, password, function(error, user) {
        if (!error) {
          console.log('User Id: ' + user.id + ', Email: ' + user.email);
        }
      });

      return [aid, $firebaseAuth];
    };

  }]);



})();
