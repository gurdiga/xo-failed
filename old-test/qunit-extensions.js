(function() {
  'use strict';

  QUnit._deepEqual = QUnit.deepEqual;

  window.deepEqual = QUnit.deepEqual = function(a, b, message) {
    function unbind(o) {
      if (o === undefined) throw 'Passed undefined to deepEqual';

      return JSON.parse(JSON.stringify(o));
    }

    QUnit._deepEqual(unbind(a), unbind(b), message);
  };
})();
