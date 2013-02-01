asyncTest('Încheieri referitoare la obiectul urmăririi', function () {
  /*jshint maxlen:126 */
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

    $select.val('schimbul forţat');
    $butonPentruÎncheiere.click();
    equal($butonPentruÎncheiere.data('formular'), 'încheiere-de-schimb-forţat', '…la click, se setează corespunzător [data-formular] pe el');
    meta = app.Încheieri.deschise[app.ButoanePentruÎncheieri.formular($butonPentruÎncheiere)];
    ok(meta, '…se iniţiază meta pentru încheiere');
    delete app.Încheieri.deschise[app.ButoanePentruÎncheieri.formular($butonPentruÎncheiere)];

    $select.val('evacuarea');
    $butonPentruÎncheiere.click();
    equal($butonPentruÎncheiere.data('formular'), 'încheiere-de-evacuare', '…la click, se setează corespunzător [data-formular] pe el');
    meta = app.Încheieri.deschise[app.ButoanePentruÎncheieri.formular($butonPentruÎncheiere)];
    ok(meta, '…se iniţiază meta pentru încheiere');
    delete app.Încheieri.deschise[app.ButoanePentruÎncheieri.formular($butonPentruÎncheiere)];

    app.open = app.openOriginal;
    start();
  });
});
