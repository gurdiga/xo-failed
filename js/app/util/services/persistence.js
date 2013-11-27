(function() {
  'use strict';

  function Persistence(USER_LOGIN) {
    var PREFIX = '/date/' + USER_LOGIN + '/';
    // TODO: should we also have SUFFIX here?


    function get(id, callback) {
      $.get(PREFIX + id, function(data) {
        callback(data);
      });
    }


    function set(id, val, callback) {
      $.ajax({
        type: 'PUT',
        url: PREFIX + id,
        data: val,
        success: function() {
          callback();
        }
      });
    }


    return {
      get: get,
      set: set
    };
  }

  Persistence.$inject = ['USER_LOGIN'];

  window.App.service('Persistence', Persistence);

})();