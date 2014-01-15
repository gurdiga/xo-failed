(function() {
  'use strict';

  angular.module('App').config(function($provide) {
    //
    // TODO: get this working
    //
    $provide.decorator('$log', function($delegate) {
      var originalError = $delegate.error;

      $delegate.error = function() {
        originalError.apply($delegate, arguments);
      };

      return $delegate;
    });
  });

})();
