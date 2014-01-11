/*global Processor*/
(function() {
  'use strict';

  var URL = '/js/processors/encrypter.js';

  function postMessage(command, text, callback) {
    var message = {
      command: command,
      text: text,
      passphrase: 'Utilizator.cheieDeCriptare'
    };

    new Processor(URL).postMessage(message, callback);
  }

  var Encrypter = {
    encrypt: function(text, callback) {
      postMessage('encrypt', text, callback);
    },

    decrypt: function(text, callback) {
      postMessage('decrypt', text, callback);
    }
  };

  window.Encrypter = Encrypter;

})();
