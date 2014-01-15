(function() {
  'use strict';

  angular
    .module('App', ['ngRoute', 'firebase'])

    .constant('config', {
      firebaseUrl: 'https://xo-dev.firebaseio.com'
    });

})();
