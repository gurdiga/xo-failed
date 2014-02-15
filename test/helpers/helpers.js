(function() {
  'use strict';

  window.TestHelpers = {
    fakeDeferrable: function fakeDeferrable() {
      var f = function() {
        return f.deferrable.promise;
      };

      f.deferrable = XO.Deferrable.create();

      return f;
    }
  };

}());
