(function() {
  /*global CryptoJS:false */
  'use strict';

  var Encrypter = {
    encrypt: function(text, passphrase) {
      return CryptoJS.AES.encrypt(text, passphrase).toString();
    },

    decrypt: function(text, passphrase) {
      return CryptoJS.AES.decrypt(text, passphrase).toString(CryptoJS.enc.Utf8);
    }
  };

  self.onmessage = function(e) {
    self.postMessage(
      Encrypter[e.data.command](e.data.text, e.data.passphrase)
    );
  };

  if ('QUnit' in self) {
    window.Encrypter = Encrypter;
  } else {
    self.importScripts('aes.js');
  }

})();
