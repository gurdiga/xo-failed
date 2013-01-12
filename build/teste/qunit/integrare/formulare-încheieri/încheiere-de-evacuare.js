// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Încheiere de evacuare', function () {
  /*global UtilitareÎncheiere:false */
  'use strict';

  ok(true);

  var app = this.app,
      $buton = app.FormularProcedură.$obiectulUrmăririi.find('#obiect~.buton[data-formular]'),
      formular = app.ButoanePentruÎncheieri.formular($buton);

  ok($buton.există(), 'găsit butonaşul pentru încheiere');
  $buton.click();

  var meta = app.Încheieri.deschise[formular];

  app.$(meta).one('iniţializat', function () {
    var $încheiere = app.$(this.tab.document);

    UtilitareÎncheiere.verificăSecţiuni($încheiere,
      ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

    // TODO de adăugat secţiunile corespunzătoare, poate de generalizat verificarea secţiunilor
    // pentru toate încheierile din acest loc

    app.FormularProcedură.$.find('.închide').click();
    app.$(app.FormularProcedură.$).one('închidere', function () {
      ok(true, 'închis formularul de procedură');

      start();
    });
  });
});
