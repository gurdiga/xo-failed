asyncTest('Încheieri referitoare la obiectul urmăririi', function () {
  /*jshint maxlen:126 */
  'use strict';

  var app = this.app;

  app.ProceduriRecente.$.find('.item:first-child').click();

  app.$(app.FormularProcedură.$).one('populat', function () {
    ok(true, 'deschis formularul de procedură');

    var $obiectul = app.FormularProcedură.$obiectulUrmăririi;

    $obiectul.find('#caracter').val('nonpecuniar').change();

    var $buton = $obiectul.find('select#obiect~.buton[data-formular]'),
        $select = $obiectul.find('select#obiect'),
        meta;

    ok($select.există(), 'avem select');
    ok($buton.există(), 'avem butonaş');

    $select.val('schimbul forţat');
    $buton.click();
    equal($buton.data('formular'), 'încheiere-de-schimb-forţat', '…la click, se setează corespunzător [data-formular] pe el');
    meta = app.Încheieri.deschise[app.ButoanePentruÎncheieri.formular($buton)];
    ok(meta, '…se iniţiază meta pentru încheiere');
    // cleanup
    meta.tab.close();
    delete app.Încheieri.deschise[app.ButoanePentruÎncheieri.formular($buton)];

    $select.val('evacuarea');
    $buton.click();
    equal($buton.data('formular'), 'încheiere-de-evacuare', '…la click, se setează corespunzător [data-formular] pe el');
    meta = app.Încheieri.deschise[app.ButoanePentruÎncheieri.formular($buton)];
    ok(meta, '…se iniţiază meta pentru încheiere');
    // cleanup
    meta.tab.close();
    delete app.Încheieri.deschise[app.ButoanePentruÎncheieri.formular($buton)];

    start();
  });
});
