// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Încheiere de evacuare', function () {
  /*global UtilitareÎncheiere:false */
  /*jshint maxlen:134 */
  'use strict';

  var app = this.app,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi;

  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val('evacuarea').change();

  // adăugăm o amînare
  var $dataEvacuării = $secţiune.find('li:has(#data-şi-ora-evacuării)'),
      $container = $dataEvacuării.next('.container-buton'),
      $butonDeAdăugare = $container.find('button.adaugă-cîmp-personalizat');

  ok($butonDeAdăugare.există(), 'avem buton de adăugare amînare');
  $butonDeAdăugare.click();

  var $amînare = $container.prev('.personalizat'),
      dataAmînării = '05.05.2013 15:15';

  ok($amînare.există(), 's-a adăugat cîmp pentru amînare');
  $amînare.find('.dată').val(dataAmînării);

  var $buton = $secţiune.find('#obiect~.buton[data-formular]');

  ok($buton.există(), 'găsit butonaşul pentru încheiere');
  $buton.click();

  var formular = app.ButoanePentruÎncheieri.formular($buton),
      meta = app.Încheieri.deschise[formular];

  app.$(meta).one('iniţializat', function () {
    var $încheiere = app.$(this.tab.document),
        date = this.tab.Încheiere.date;

    ok(date.amînată, 'context: setat amînată');
    equal(date.ultimaAmînare, dataAmînării, 'context: setat ultimaAmînare');

    var $paragrafDespreAmînare = $încheiere.find('p:contains("a fost amînată pînă la")');

    ok($paragrafDespreAmînare.există(), 'avem paragraf despre amînare');
    ok($paragrafDespreAmînare.find('span.atenţionare').există(), '…cu atenţionare să se introducă cauza');
    ok($încheiere.find('section header:contains("Motivele")+.conţinut').is('.editabil'), 'secţiunea “Motivele” este editabilă');
    equal($încheiere.find('address').text().trim(), date.procedură['obiectul-urmăririi']['din-încăperea'].trim(), 'avem adresa');

    UtilitareÎncheiere.verificăSubtitlu($încheiere, 'de numire a datei evacuării forţate');
    UtilitareÎncheiere.verificăSecţiuni($încheiere,
      ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

    setTimeout(function () { // pentru observabilitate
      start();
    }, app.PAUZĂ_DE_OBSERVABILITATE);
  });
});
