(function() {
  /*global Worker */
  'use strict';

  var Processor = function(url) {
    var worker = new Processor.factory(url);

    this.postMessage = function(message, callback) {
      worker.onmessage = function(e) {
        callback(e.data);
        worker.terminate();
      };

      worker.postMessage(message);
    };
  };

  Processor.factory = Worker;

  window.Processor = Processor;

})();

