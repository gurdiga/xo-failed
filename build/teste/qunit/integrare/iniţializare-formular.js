asyncTest('Procedură: iniţializare formular', function () {
  'use strict';

  var app = this.app;
  var filăProcedurăDeOrdinGeneral = app.$('#crează-procedură li[data-href].g');

  ok(
    filăProcedurăDeOrdinGeneral.click()
    .există(), 'găsit filă pentru crearea procedurii de ordin general');

  app.Procedura.$.one('iniţializat', function () {
    ok(true, 'iniţializat formularul');
    ok(app.Procedura.$.is(':visible'), 'afişat formularul');

    start();
  });
});
