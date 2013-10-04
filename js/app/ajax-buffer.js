(function() {
  'use strict';

  var AjaxBuffer = {
    put: function(url, data) {
      window.localStorage.setItem(url, JSON.stringify(data));
    },

    get: function(url) {
      return JSON.parse(window.localStorage.getItem(url));
    }
  };

  window.AjaxBuffer = AjaxBuffer;

})();
