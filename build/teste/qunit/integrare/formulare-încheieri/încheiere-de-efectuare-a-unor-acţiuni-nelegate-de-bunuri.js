// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Somaţie cu privire la efectuarea unor acţiuni nelegate de remiterea unor sume sau bunuri', function () {
  /*global UtilitareÎncheiere:false */
  /*jshint maxlen:140 */
  'use strict';

  var app = this.app,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi,
      obiect = 'efectuarea de către debitor a unor acţiuni obligatorii, nelegate de remiterea unor sume sau bunuri';

  ok(app.FormularProcedură.$.is(':visible'), 'formularul de procedură e deschis');
  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val(obiect).change();
  equal($secţiune.find('#obiect').val(), obiect, 'setat obiectul corespunzător');

  var acţiuni = 'o listă de acţiuni';

  ok($secţiune.find('#acţiuni').există(), 'avem cîmp pentru acţiuni');
  $secţiune.find('#acţiuni').val(acţiuni);

  var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

  ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
  $butonPentruÎncheiere.click();

  var formular = app.ButoanePentruÎncheieri.formular($butonPentruÎncheiere),
      meta = app.Încheieri.deschise[formular];

  app.$(meta).one('iniţializat', function () {
    var $încheiere = app.$(this.tab.document),
        subtitlu = 'cu privire la executarea de către debitor a unor acţiuni nelegate de remiterea unor sume sau bunuri';

    UtilitareÎncheiere.verificăŞoaptăButon($încheiere, $butonPentruÎncheiere);
    UtilitareÎncheiere.verificăSubtitlu($încheiere, subtitlu);
    UtilitareÎncheiere.verificăSecţiuni($încheiere, ['Procedura', 'Creditorul', 'Debitorul', 'Executorul']);

    var $conţinut = $încheiere.find('section .conţinut.pe-toată-foaia');

    ok($conţinut.există(), 'avem secţiunea atotcuprinzătoare');
    equal($conţinut.find('.acţiuni').text(), acţiuni, 'se menţionează acţiunile');

    setTimeout(function () {
      $încheiere.find('.închide').click();

      start();
    }, app.PAUZĂ_DE_OBSERVABILITATE);
  });
});
