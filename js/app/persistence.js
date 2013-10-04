(function() {
  'use strict';

  var Persistence = {
    get: function(url, callback) {
      return [url, callback];
      //$.get(url, callback);
    },

    set: function(url, data) {
      return [url, data];
    }
  };

  window.Persistence = Persistence;

})();
