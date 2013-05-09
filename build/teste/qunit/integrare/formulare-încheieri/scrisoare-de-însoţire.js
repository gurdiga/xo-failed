asyncTest('Scrisoarea de însoţire', function () {
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      // TODO: testăm butonaşul pentru fişuică pentru fiecare încheiere??
      $buton = $formular.find('#încheieri a[href="/formulare-încheieri/scrisoare-de-însoţire.html"]').first();

  ok($formular.is(':not(:visible)'), 'formularul de procedură e închis');

  start();
});
