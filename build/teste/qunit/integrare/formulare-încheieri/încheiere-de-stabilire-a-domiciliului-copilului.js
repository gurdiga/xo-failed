// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Încheiere de stabilire a domiciliului copilului', function () {
  /*global UtilitareÎncheiere:false */
  /*jshint maxlen:162 */
  'use strict';

  var app = this.app,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi;

  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val('stabilirea domiciliului copilului').change();

  ok($secţiune.find('#numele-copilului').există(), 'avem cîmp pentru numele copilului');
  ok($secţiune.find('#data-naşterii-copilului').există(), 'avem cîmp pentru data naşterii copilului');
  ok($secţiune.find('#data-prezentării-debitorului').există(), 'avem cîmp pentru data prezentării creditorului în oficiu');

  var numeleCopilului = 'John DOE',
      dataNaşteriiCopilului = '01.01.2000',
      dataPrezentăriiDebitorului = '05.06.2012 ora 12:00';

  $secţiune.find('#numele-copilului').val(numeleCopilului);
  $secţiune.find('#data-naşterii-copilului').val(dataNaşteriiCopilului);
  $secţiune.find('#data-prezentării-debitorului').val(dataPrezentăriiDebitorului);

  var $buton = $secţiune.find('#obiect~.buton[data-formular]');

  ok($buton.există(), 'găsit butonaşul pentru încheiere');
  $buton.click();

  var formular = app.ButoanePentruÎncheieri.formular($buton),
      meta = app.Încheieri.deschise[formular];

  app.$(meta).one('iniţializat', function () {
    var $încheiere = app.$(this.tab.document),
        subtitlu = 'cu privire la schimbul forţat al locuinţelor',
        date = this.tab.Încheiere.date;

    UtilitareÎncheiere.verificăSecţiuni($încheiere, ['Procedura', 'Creditorul', 'Debitorul', 'Executorul']);

    var $conţinut = $încheiere.find('section .conţinut.pe-toată-foaia');

    ok($conţinut.find('p:contains("' + numeleCopilului + '")').există(), 'e menţionat numele copilului');
    ok($conţinut.find('p:contains("' + dataNaşteriiCopilului + '")').există(), 'e menţionată data naşterii copilului');
    ok($conţinut.find('p:contains("' + date.executor.telefon + '")').există(), 'e menţionat telefonul executorului');
    ok($conţinut.find('p:contains("' + dataPrezentăriiDebitorului + '")').există(), 'e menţionată data prezentării debitorului în oficiu');

    app.FormularProcedură.$.find('.închide').click();
    app.$(app.FormularProcedură.$).one('închidere', function () {
      ok(true, 'închis formularul de procedură');

      start();
    });
  });
});
