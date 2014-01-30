(function() {
  'use strict';

  var app = window.frames['app'];

  module('Unit: Encrypter client');

  asyncTest('decriptează ce encriptează', function() {
    var text = 'un careva text, mărţişor';

    app.Encrypter.encrypt(text, function(textCriptat) {
      ok(textCriptat !== text, 'encriptează');

      app.Encrypter.decrypt(textCriptat, function(textDecriptat) {
        equal(textDecriptat, text, 'decriptează');
        start();
      });
    });

  });

})();

