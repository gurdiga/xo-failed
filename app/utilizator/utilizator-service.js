(function() {
  'use strict';

  var PASSWORD_LENGTH = 12;

  angular.module('App').service('Utilizator', function($rootScope, config, $firebase, $firebaseAuth, $log, $q, $window) {
    var firebase = new Firebase(config.firebaseUrl);
    var auth = $firebaseAuth(firebase);


    this.creaza = function(email) {
      js.assert(email.indexOf('@') > -1, 'Utilizator.creaza: email-ul trebuie să conţină “@”');

      var deferred = $q.defer();
      var password = randomPassword(PASSWORD_LENGTH);

      creazaCont(email, password)
      .then(creazaStructuraDate)
      .then(inregistreazaAid)
      .then(function success(results) {
        deferred.resolve(results.user);
        $window.alert('Parola: ' + password);
      });

      // ----

      function creazaCont(email, password) {
        js.assert(!!email, 'Utilizator.creaza!creazaCont: avem nevoie de email');
        js.assert(!!password, 'Utilizator.creaza!creazaCont: avem nevoie de password');

        var deferred = $q.defer();

        auth.$createUser(email, password, function $createUserCallback(err, user) {
          if (err) {
            $log.error(err);
            deferred.reject(err);
            return;
          }

          deferred.resolve({
            user: user
          });
        });

        return deferred.promise;
      }


      function creazaStructuraDate(results) {
        js.assert(js.isPlainObject(results.user), 'Utilizator.creaza!creazaStructuraDate: avem nevoie de results.user');
        js.assert(!!results.user.email, 'Utilizator.creaza!creazaStructuraDate: avem nevoie de results.user.email');

        var deferred = $q.defer();
        var date = {
          email: results.user.email,
          profil: 1,
          proceduri: 1
        };

        var ref = firebase.child('/date')
        .push(date, function pushCallback(err) {
          if (err) {
            $log.error(err);
            deferred.reject(err);
            return;
          }

          results.aid = ref.name();
          deferred.resolve(results);
        });

        return deferred.promise;
      }


      function inregistreazaAid(results) {
        js.assert(!!results.aid, 'Utilizator.creaza!inregistreazaAid: avem nevoie de results.aid');

        var deferred = $q.defer();

        firebase.child('/aid/' + eid(results.user.email))
        .set(results.aid, function setCallback(err) {
          if (err) {
            $log.error(err);
            deferred.reject(err);
            return;
          }

          deferred.resolve(results);
        });

        return deferred.promise;
      }


      function randomPassword(length) {
        function random() {
          var value;

          if ($window['crypto'] && $window.crypto['getRandomValues']) {
            value = parseFloat('.' + $window.crypto.getRandomValues(new $window.Uint32Array(1))[0]);
          } else {
            value = Math.random();
          }

          return value;
        }

        var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var password = '';
        var groupLength = 4;
        var groupSeparator = '-';
        var currentGroupLength = 0;

        for (var i = 0; i < length; i++) {
          password += characters.charAt(Math.floor(random() * characters.length));
          currentGroupLength++;

          if (currentGroupLength === groupLength && i + 1 < length) {
            password += groupSeparator;
            currentGroupLength = 0;
          }
        }

        return password;
      }

      return deferred.promise;
    };


    /*

    TODO later check https://groups.google.com/d/topic/firebase-talk/HS63cV0xGB8/discussion

    this.sterge = function(email, password) {
      var auth = new $window.FirebaseSimpleLogin(firebase, function(err) {
        console.log(this, err);
        auth.removeUser(email, password, function(err, something) {
          console.log('removeUser callback', err, something);
        });
      });
    };
    */


    this.autentifica = function(email, password) {
      var deferred = $q.defer();
      var start = +new Date();

      login(email, password)
      .then(obtineAid)
      .then(
        function success(results) {
          $log.debug('Autentificat', results.user.email, +new Date() - start);
          results.user.$date = $firebase(firebase.child('/date/' + results.aid));
          $rootScope.$emit('log-storage-ready', firebase.child('/logs'), email);

          deferred.resolve(results.user);
        },

        function failure(err) {
          deferred.reject(err);
          $log.error(err);
        }
      );

      // ----

      function login(email, password) {
        return auth.$login('password', {
          email: email,
          password: password
        });
      }


      function obtineAid(user) {
        js.assert(js.isPlainObject(user), 'Utilizator.autentifica!obtineAid: user trebuie sa fie obict');
        js.assert(user.email, 'Utilizator.autentifica!obtineAid: user trebuie sa aiba email');

        var deferred = $q.defer();

        firebase.child('/aid/' + eid(user.email))
        .once('value', function onceValueCallback(snapshot) {
          var results = {
            user: user,
            aid: snapshot.val()
          };

          deferred.resolve(results);
        });

        return deferred.promise;
      }


      return deferred.promise;
    };


    this.deconecteaza = function() {
      Firebase.goOffline();
    };

    this.conecteaza = function() {
      Firebase.goOnline();
    };


    function eid(email) {
      return email.replace(/\./g, ':');
    }

  });


})();
