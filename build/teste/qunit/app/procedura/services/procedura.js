(function() {
  'use strict';

  var app = window.frames['app'];

  module('Procedura');

  (function() {
    var Procedura, initializeaza, GENURI_ACCEPTATE;

    test('.initializeaza(gen): parametrii', function() {
      Procedura = app.App.module.S.Procedura;
      initializeaza = Procedura.initializeaza;
      GENURI_ACCEPTATE = Procedura.GENURI_ACCEPTATE;

      equal(initializeaza.length, 1, 'acceptă doi parametri');

      var procedura = {},
          mesajDeEroare;

      mesajDeEroare = 'gen: generează o eroare dacă nu este unul dintre cele acceptate';

      try {
        initializeaza('sdbfhjsbdfjhs', procedura);
        ok(false, mesajDeEroare);
      } catch(e) {
        ok(true, mesajDeEroare);
        ok(app._.contains(e.message, GENURI_ACCEPTATE.join(', ')),
            'gen: mesajul erorrii generate conţine lista celor acceptate');
      }

      initializeaza(GENURI_ACCEPTATE[0], procedura);
      ok(true, 'nu generează erori dacă genul este unul dintre cele aceptate');
    });


    test('.initializeaza(gen)', function() {
      initializeaza('de-ordin-general');

      ok(Procedura.date['data-intentării'], 'setează data intentării');
      equal(Procedura.date['creditor']['gen-persoană'], 'juridică', 'creditorul este persoană juridică');
      equal(Procedura.date['debitori'][0]['gen-persoană'], 'fizică', 'debitorul este persoană fizică');

      //
      // TODO:
      // - tip
      // - creditor
      // - debitori
      //
    });
  })();

})();
