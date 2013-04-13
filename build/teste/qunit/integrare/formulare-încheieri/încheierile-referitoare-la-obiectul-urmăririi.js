asyncTest('Încheieri referitoare la obiectul urmăririi', function () {
  /*jshint maxlen:141 */
  'use strict';

  var app = this.app;

  app.ProceduriRecente.$.find('.item:first-child').click();

  app.$(app.FormularProcedură.$).one('populat', function () {
    ok(true, 'deschis formularul de procedură');

    var $secţiune = app.FormularProcedură.$obiectulUrmăririi;

    $secţiune.find('#caracter').val('nonpecuniar').change();

    var $select = $secţiune.find('select#obiect'),
        $butonPentruÎncheiere = $secţiune.find('select#obiect~.buton[data-formular]'),
        meta;

    ok($select.există(), 'avem select');
    ok($butonPentruÎncheiere.există(), 'avem butonaş');

    app.openOriginal = app.open;
    app.open = function () { return 'tab stub'; };

    $select.val('schimbul forţat').change();
    equal($butonPentruÎncheiere.attr('data-formular'), 'încheiere-de-schimb-forţat', 'e setat corespunzător [data-formular] pe el');
    $butonPentruÎncheiere.click();
    meta = app.Încheieri.deschise[app.Încheieri.butonaşe.formular($butonPentruÎncheiere)];
    ok(meta, '…se iniţiază meta pentru încheiere');
    delete app.Încheieri.deschise[app.Încheieri.butonaşe.formular($butonPentruÎncheiere)];

    $select.val('evacuarea').change();
    equal($butonPentruÎncheiere.attr('data-formular'), 'încheiere-de-evacuare', 'e setat corespunzător [data-formular] pe el');
    $butonPentruÎncheiere.click();
    meta = app.Încheieri.deschise[app.Încheieri.butonaşe.formular($butonPentruÎncheiere)];
    ok(meta, '…se iniţiază meta pentru încheiere');
    delete app.Încheieri.deschise[app.Încheieri.butonaşe.formular($butonPentruÎncheiere)];

    app.open = app.openOriginal;
    start();
  });
});
