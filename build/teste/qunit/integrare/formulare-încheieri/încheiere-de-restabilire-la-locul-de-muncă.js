// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Somaţie de restabilire a salariatului la locul de muncă', function () {
  /*global UtilitareÎncheiere:false */
  /*jshint maxlen:140 */
  'use strict';

  var app = this.app,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi;

  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val('restabilirea la locul de muncă').change();

  var funcţie = 'pilot de curse';

  ok($secţiune.find('#funcţie').există(), 'avem cîmp pentru funcţie');
  $secţiune.find('#funcţie').val(funcţie);

  var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

  ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
  $butonPentruÎncheiere.click();

  var formular = app.ButoanePentruÎncheieri.formular($butonPentruÎncheiere),
      meta = app.Încheieri.deschise[formular];

  app.$(meta).one('iniţializat', function () {
    var $încheiere = app.$(this.tab.document),
        subtitlu = 'de restabilire a salariatului la locul de muncă';

    UtilitareÎncheiere.verificăŞoaptăButon($încheiere, $butonPentruÎncheiere);
    UtilitareÎncheiere.verificăSubtitlu($încheiere, subtitlu);
    UtilitareÎncheiere.verificăSecţiuni($încheiere, ['Procedura', 'Creditorul', 'Debitorul', 'Executorul']);

    var $conţinut = $încheiere.find('section .conţinut.pe-toată-foaia');

    ok($conţinut.există(), 'avem secţiunea atotcuprinzătoare');
    equal($conţinut.find('p:contains("' + funcţie + '")').length, 2, 'se menţionează funcţia în două rînduri');

    setTimeout(function () {
      $încheiere.find('.închide').click();

      start();
    }, app.PAUZĂ_DE_OBSERVABILITATE);
  });
});

