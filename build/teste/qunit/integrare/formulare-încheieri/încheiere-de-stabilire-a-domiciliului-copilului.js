// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Somaţie de stabilire a domiciliului copilului', function () {
  /*global UtilitareÎncheiere:false */
  /*jshint maxlen:162 */
  'use strict';

  var app = this.app,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi,
      obiect = 'stabilirea domiciliului copilului';

  ok(app.FormularProcedură.$.is(':visible'), 'formularul de procedură e deschis');
  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val(obiect).change();
  equal($secţiune.find('#obiect').val(), obiect, 'setat obiectul corespunzător');

  ok($secţiune.find('#numele-copilului').există(), 'avem cîmp pentru numele copilului');
  ok($secţiune.find('#data-naşterii-copilului').există(), 'avem cîmp pentru data naşterii copilului');
  ok($secţiune.find('#data-prezentării-debitorului').există(), 'avem cîmp pentru data prezentării creditorului în oficiu');

  var numeleCopilului = 'John DOE',
      dataNaşteriiCopilului = '01.01.2000',
      dataPrezentăriiDebitorului = '05.06.2012 ora 12:00';

  $secţiune.find('#numele-copilului').val(numeleCopilului);
  $secţiune.find('#data-naşterii-copilului').val(dataNaşteriiCopilului);
  $secţiune.find('#data-prezentării-debitorului').val(dataPrezentăriiDebitorului);

  var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

  ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
  $butonPentruÎncheiere.click();

  var formular = app.ButoanePentruÎncheieri.formular($butonPentruÎncheiere),
      meta = app.Încheieri.deschise[formular];

  app.$(meta).one('iniţializat', function () {
    var $încheiere = app.$(this.tab.document),
        date = this.tab.Încheiere.date,
        subtitlu = 'cu privire la executarea documentului executoriu de stabilire a domiciliului copilului minor';

    UtilitareÎncheiere.verificăŞoaptăButon($încheiere, $butonPentruÎncheiere);
    UtilitareÎncheiere.verificăSubtitlu($încheiere, subtitlu);
    UtilitareÎncheiere.verificăSecţiuni($încheiere, ['Procedura', 'Creditorul', 'Debitorul', 'Executorul']);

    var $conţinut = $încheiere.find('section .conţinut.pe-toată-foaia');

    ok($conţinut.există(), 'avem secţiunea atotcuprinzătoare');
    ok($conţinut.find('p:contains("' + numeleCopilului + '")').există(), 'e menţionat numele copilului');
    ok($conţinut.find('p:contains("' + dataNaşteriiCopilului + '")').există(), 'e menţionată data naşterii copilului');
    ok($conţinut.find('p:contains("' + date.executor.telefon + '")').există(), 'e menţionat telefonul executorului');
    ok($conţinut.find('p:contains("' + dataPrezentăriiDebitorului + '")').există(), 'e menţionată data prezentării debitorului în oficiu');

    setTimeout(function () {
      $încheiere.find('.închide').click();

      start();
    }, app.PAUZĂ_DE_OBSERVABILITATE);
  });
});
