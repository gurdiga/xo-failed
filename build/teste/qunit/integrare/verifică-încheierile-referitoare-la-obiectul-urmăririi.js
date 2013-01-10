asyncTest('Procedură: verifică referitoare la obiectul urmăririi', function () {
  'use strict';

  var app = this.app, încheiere;

  app.ProceduriRecente.$.find('.item:first-child').click();

  app.$(app.FormularProcedură.$).one('populat', function () {
    ok(true, 'deschis formularul de procedură');

    var $obiectul = app.FormularProcedură.$obiectulUrmăririi;

    $obiectul.find('#caracter').val('nonpecuniar').change();

    var $buton = $obiectul.find('#obiect~.buton[data-formular]');

    ok($buton.există(), 'avem butonaş');
    $buton.click();
    ok($buton.data('formular'), '…la click, se setează corespunzător [data-formular] pe el');

    var meta = app.Încheieri.deschise[app.ButoanePentruÎncheieri.formular($buton)];

    ok(meta, '…se iniţiază meta pentru încheiere');

    app.$(meta).one('iniţializat', function () {
      ok(true, 's-a iniţializat');

      // TODO un modul care verifică părţile structurale principale ale înheierii?

      app.FormularProcedură.$.find('.închide').click();
      app.$(app.FormularProcedură.$).one('închidere', function () {
        ok(true, 'închis formularul de procedură');

        start();
      });
    });
  });
});
