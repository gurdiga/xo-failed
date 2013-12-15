(function() {
  'use strict';

  var app = window.frames['app'];

  module('Procedura');

  (function() {
    var Procedura;

    test('.initializeaza(gen): verificarea parametrilor', function() {
      Procedura = app.App.module.S.Procedura;

      equal(Procedura.initializeaza.length, 1, 'acceptă doi parametri');

      var procedura = {};

      throws(function() {
        Procedura.initializeaza('sdbfhjsbdfjhs', procedura);
      }, app.AssertionError, 'gen: generează un AssertionError dacă nu este unul dintre cele acceptate');

      Procedura.initializeaza(Procedura.GENURI_ACCEPTATE[0], procedura);
      ok(true, 'gen: nu generează erori dacă genul este unul dintre cele aceptate');
    });


    test('.initializeaza(gen)', function() {
      Procedura.initializeaza('de-ordin-general');

      equal(Procedura.date.titlu(), 'Procedură de ordin general', 'titlul e corespunde cu tipul procedurii');
      ok(Procedura.date.noua(), 'procedura e .noua()');

      ok(Procedura.date['data-intentării'], 'setează data intentării');
      equal(Procedura.date['creditor']['gen-persoană'], 'juridică', 'creditorul este persoană juridică');
      equal(Procedura.date['debitori'][0]['gen-persoană'], 'fizică', 'debitorul este persoană fizică');
      equal(Procedura.date['obiectul-urmăririi']['caracter'], 'pecuniar', 'caracterul obiectului urmăririi este pecuniar');
      ok(app.js.isArray(Procedura.date['obiectul-urmăririi']['sume']), 'obiectului urmăririi are sume');
      ok(app.js.isArray(Procedura.date['obiectul-urmăririi'].optiuni()), 'obiectului urmăririi are .optiuni()');
      ok(app.js.isArray(Procedura.date['acţiuni']), 'avem listă de acţiuni');
    });


    test('.deschide(numarul, callback): verificarea parametrilor', function() {
      throws(function() {
        Procedura.deschide();
      }, app.AssertionError, 'fără argumente generează un AssertionError');

      throws(function() {
        Procedura.deschide('sdkbfkjsk');
      }, app.AssertionError, 'dacă numărul nu este număr de fapt generează un AssertionError');

      throws(function() {
        Procedura.deschide(-9, function() {});
      }, app.AssertionError, 'dacă numărul nu este > 0 generează un AssertionError');

      throws(function() {
        Procedura.deschide(1);
      }, app.AssertionError, 'fără callback generează un AssertionError');

      throws(function() {
        Procedura.deschide(1, 'dsfnsdjfksj');
      }, app.AssertionError, 'dacă callback-ul nu e bun generează un AssertionError');
    });


    test('.deschide(numarul, callback)', function() {
      ok(true, 'TODO');
    });

  })();

})();
