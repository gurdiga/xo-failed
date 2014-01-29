(function() {
  'use strict';

  var PASSWORD_LENGTH = 12;

  angular.module('App').service('Utilizator', function(config, $firebaseSimpleLogin, $log, $q, $window) {
    var Utilizator = this;

    var dataRef = new Firebase(config.firebaseUrl);
    var auth = $firebaseSimpleLogin(dataRef);


    this.creaza = function(email) {
      var deferred = $q.defer();
      var password = randomPassword(PASSWORD_LENGTH);

      createAccount(email, password)
      .then(prepareDataStructure)
      .then(registerAid)
      .then(function successCallback(results) {
        deferred.resolve(results.user);
        $window.alert('Parola: ' + password);
      });

      // ----

      function createAccount(email, password) {
        var deferred = $q.defer();

        auth.$createUser(email, password)
        .then(
          function $createUserSuccessCallback(user) {
            deferred.resolve({
              user: user
            });
          },

          function $createUserErrorCallback(err) {
            $log.error(err);
            deferred.reject(err);
          }
        );

        return deferred.promise;
      }


      function prepareDataStructure(results) {
        var deferred = $q.defer();
        var date = {
          email: results.user.email,
          profil: 1,
          proceduri: 1
        };

        var ref = dataRef.child('/date')
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


      function registerAid(results) {
        var deferred = $q.defer();

        dataRef.child('/aid/' + eid(results.user.email))
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

      loginWith(email, password)
      .then(getAid)
      .then(
        function successCallback(results) {
          Utilizator.autentificat = true;

          //results.user.$date = $firebase(dataRef.child('/date/' + results.aid));
          deferred.resolve(results.user);

          $log.debug('Autentificat', results.user.email, +new Date() - start);
        },

        function failureCallback(err) {
          deferred.reject(err);

          $log.error(err);
        }
      );

      // ----

      function loginWith(email, password) {
        return auth.$login('password', {
          email: email,
          password: password
        });
      }


      function getAid(user) {
        var deferred = $q.defer();

        dataRef.child('/aid/' + eid(user.email))
        .once('value',
          function onceValueCallback(snapshot) {
            var results = {
              user: user,
              aid: snapshot.val()
            };

            deferred.resolve(results);
          },

          function onceFailureCallback(err) {
            deferred.reject(err);
          }
        );

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
