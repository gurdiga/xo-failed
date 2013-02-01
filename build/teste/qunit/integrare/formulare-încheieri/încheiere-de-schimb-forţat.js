// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Încheiere de schimb forţat', function () {
  /*global UtilitareÎncheiere:false */
  /*jshint maxlen:148 */
  'use strict';

  var app = this.app,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi;

  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val('schimbul forţat').change();

  ok($secţiune.find('#încăperea-pentru-creditor').există(), 'avem “Încăperea pentru creditor”');
  ok($secţiune.find('#încăperea-pentru-debitor').există(), 'avem “Încăperea pentru debitor”');

  // adăugăm o amînare
  var $dataSchimbului = $secţiune.find('li:has(#data-şi-ora-schimbului)'),
      $container = $dataSchimbului.next('.container-buton'),
      $butonDeAdăugare = $container.find('button.adaugă-cîmp-personalizat');

  ok($butonDeAdăugare.există(), 'avem buton de adăugare amînare');
  $butonDeAdăugare.click();

  var $amînare = $container.prev('.personalizat'),
      dataAmînării = '05.05.2013 15:15';

  ok($amînare.există(), 's-a adăugat cîmp pentru amînare');
  $amînare.find('.dată').val(dataAmînării);

  var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

  ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
  $butonPentruÎncheiere.click();

  var formular = app.ButoanePentruÎncheieri.formular($butonPentruÎncheiere),
      meta = app.Încheieri.deschise[formular];

  app.$(meta).one('iniţializat', function () {
    var $încheiere = app.$(this.tab.document),
        date = this.tab.Încheiere.date;

    ok(true, 'iniţializat încheierea');

    ok(date.amînată, 'context: setat amînată');
    equal(date.ultimaAmînare, dataAmînării, 'context: setat ultimaAmînare');

    var $paragrafDespreAmînare = $încheiere.find('p:contains("a fost amînată pînă la")');

    ok($paragrafDespreAmînare.există(), 'avem paragraf despre amînare');
    ok($paragrafDespreAmînare.find('span.atenţionare').există(), '…cu atenţionare să se introducă cauza');
    ok($încheiere.find('section header:contains("Motivele")+.conţinut').is('.editabil'), 'secţiunea “Motivele” este editabilă');

    var $secţiuneaDispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut');

    ok($secţiuneaDispoziţia.contents(':contains("' + dataAmînării + '")').există(), 'data este în secţiunea “Dispoziţia”');
    equal($încheiere.find('address').text(), date.procedură['obiectul-urmăririi']['încăperea-pentru-creditor'], 'avem adresa pentru creditor');
    equal($încheiere.find('address').text(), date.procedură['obiectul-urmăririi']['încăperea-pentru-debitor'], 'avem adresa pentru debitor');

    UtilitareÎncheiere.verificăŞoaptăButon($încheiere, $butonPentruÎncheiere);
    UtilitareÎncheiere.verificăSubtitlu($încheiere, 'cu privire la schimbul forţat al locuinţelor');
    UtilitareÎncheiere.verificăSecţiuni($încheiere,
      ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

    setTimeout(function () {
      start();
    }, app.PAUZĂ_DE_OBSERVABILITATE);
  });
});
