// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Somaţie cu privire la efectuarea unor acte nelegate de remiterea unor sume sau bunuri', function () {
  /*global UtilitareÎncheiere:false */
  /*jshint maxlen:140 */
  'use strict';

  var app = this.app,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi;

  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val('efectuarea de către debitor a unor acte obligatorii, nelegate de remiterea unor sume sau bunuri').change();

  var acte = 'o listă de acte';

  ok($secţiune.find('#acte').există(), 'avem cîmp pentru acte');
  $secţiune.find('#acte').val(acte);

  var $buton = $secţiune.find('#obiect~.buton[data-formular]');

  ok($buton.există(), 'găsit butonaşul pentru încheiere');
  $buton.click();

  var formular = app.ButoanePentruÎncheieri.formular($buton),
      meta = app.Încheieri.deschise[formular];

  app.$(meta).one('iniţializat', function () {
    var $încheiere = app.$(this.tab.document),
        date = this.tab.Încheiere.date,
        subtitlu = 'cu privire la executarea de către debitor a unor acte nelegate de remiterea unor sume sau bunuri';

    UtilitareÎncheiere.verificăSubtitlu($încheiere, subtitlu);
    UtilitareÎncheiere.verificăSecţiuni($încheiere, ['Procedura', 'Creditorul', 'Debitorul', 'Executorul']);

    var $conţinut = $încheiere.find('section .conţinut.pe-toată-foaia');

    ok($conţinut.există(), 'avem secţiunea atotcuprinzătoare');
    equal($conţinut.find('.acte:first').text(), acte, 'se menţionează actele');
    equal($conţinut.find('.acte').length, 2, '…de două ori');

    app.FormularProcedură.$.find('.închide').click();
    app.$(app.FormularProcedură.$).one('închidere', function () {
      ok(true, 'închis formularul de procedură');

      start();
    });
  });
});
