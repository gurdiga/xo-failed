(function() {
  'use strict';

  App.controller('App',
         ['$scope', 'Utilizator', '$firebase', '$firebaseAuth', 'conf',
  function($scope,   Utilizator,   $firebase,   $firebaseAuth,   conf) {
    var firebase = new window.Firebase(conf.firebaseUrl);

    $scope.auth = $firebaseAuth(firebase);
    $scope.auth.$login('password', {
      email: '007@executori.org',
      password: '007@executori.org'
    }).then(function(user) {
      console.log('Logged in as:', user.email, user);
    }, function(error) {
      console.error('Login failed:', error);
    });


    // TODO:
    // email -> aid, eg 007@executori.org => 007
    //
    // /aid/007@executori.org = 007
    //
    // /date/aid/
    //
    // de automatizat crearea de user + aid + date:
    // Register('007', '007@executori.org');
    // input the password into a prompt('Paste password please:')

    window.date = $scope.date = $firebase(firebase);
    $scope.utilizator = Utilizator.date;
  }]);

})();
