(function() {
  'use strict';

  var Storage = {
    get: function(url, callback) {
      return [url, callback];
      //$.get(url, callback);
    },

    set: function(url, data) {
      return [url, data];
    }
  };

  window.Storage = Storage;

})();
