(function() {
  'use strict';

  window.App.service('ScopeUtils', function() {

    this.appData = function($scope) {
      return _.pick($scope, function(value, key) {
        // skip Angular’s internal stuff
        return key[0] !== '$' &&
               key !== 'this' &&
               key !== 'constructor' &&
               !_.isFunction($scope[key]);
      });
    };

  });

})();
