(function() {
  /*global Encrypter*/
  'use strict';

  module('Unit: Processors: Encrypter');


  test('decriptează ce incriptează', function() {
    var text = 'un careva text',
        parola = 'parola de criptare';

    var textCriptat = Encrypter.encrypt(text, parola),
        textDecriptat = Encrypter.decrypt(textCriptat, parola);

    ok(textCriptat !== text, 'encriptează');
    equal(textDecriptat, text, 'decriptează');
  });

})();
