(function() {
  'use strict';

  sinon.qunit = {
    setup: function(test) {
      test.stubs = [];

      test.stub = function(object, method, replacement) {
        test.stubs.push(
          sinon.stub(object, method, replacement)
        );
      };
    },

    teardown: function(test) {
      test.stubs.forEach(function(stub) {
        stub.restore();
      });
    }
  };

})();
