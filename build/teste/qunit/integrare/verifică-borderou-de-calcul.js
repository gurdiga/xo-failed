asyncTest('Procedură: verifică borderou de calcul', function () {
  'use strict';

  var app = this.app;

  app.ProceduriRecente.$.find('.item:first-child').click();

  app.$(app.Procedura.$).one('populat', function () {
    var cîmpTotalTaxeŞiSpeze = app.Cheltuieli.$.find('#total-taxe-şi-speze'),
        $butonÎncheiere = cîmpTotalTaxeŞiSpeze.siblings('.buton[data-formular="borderou-de-calcul"]'),
        formular = app.ButoanePentruÎncheieri.formular($butonÎncheiere);

    ok($butonÎncheiere.există(), 'avem buton pentru borderoul de calcul');
    $butonÎncheiere.click();

    var încheiere = app.Încheieri.deschise[formular].tab;

    app.$(încheiere).one('iniţializat', function () {
      ok(true, 'iniţializat borderoul de calcul');

      var $încheiere = app.$(încheiere.document),
          $butonDeSalvare = $încheiere.find('.salvează');

      $butonDeSalvare.click();

      app.$(încheiere).one('salvat', function () {
        ok(true, 'salvat borderoul de calcul');
        equal(app.Procedura.colectează().cheltuieli.încheiere, încheiere.Încheiere.pagina,
            '…înregistrat în procedură');

        ok($încheiere.find('h1:contains("Borderou de calcul")').există(), '…avem titlu');
        // TODO: de verificat datele?

        app.Procedura.$.find('.închide').click();
        start();
      });
    });
  });
});

