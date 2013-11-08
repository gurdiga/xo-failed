(function() {
  'use strict';

  function Persistence() {
    return {
      get: function(id, callback) {
        $.get(id, function(data) {
          callback(data);
        });
      },

      set: function(id, val, callback) {
        $.ajax({
          type: 'PUT',
          url: url,
          data: data,
          success: function() {
            callback();
          }
        });
      }
    };
  }

  window.App.service('Persistence', Persistence);

})();
