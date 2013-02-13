// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Încheiere de instalare', function () {
  /*global UtilitareÎncheiere:false */
  /*jshint maxlen:129 */
  'use strict';

  var app = this.app,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi;

  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val('instalarea').change();

  ok($secţiune.find('#în-încăperea').există(), 'avem cîmpul “În încăperea”');

  var adresa = 'str. Cutărescu 17\nChişinău';

  $secţiune.find('#în-încăperea').val(adresa);

  // adăugăm o amînare
  var $dataEvacuării = $secţiune.find('li:has(#data-şi-ora-instalării)'),
      $container = $dataEvacuării.next('.container-buton'),
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

    ok(date.amînată, 'context: setat amînată');
    equal(date.ultimaAmînare, dataAmînării, 'context: setat ultimaAmînare');

    var $paragrafDespreAmînare = $încheiere.find('p:contains("a fost amînată pînă la")');

    ok($paragrafDespreAmînare.există(), 'avem paragraf despre amînare');
    ok($paragrafDespreAmînare.find('span.atenţionare').există(), '…cu atenţionare să se introducă cauza');
    ok($încheiere.find('section header:contains("Motivele")+.conţinut').is('.editabil'), 'secţiunea “Motivele” este editabilă');
    equal($încheiere.find('address').first().text().trim(), adresa, 'avem adresa');

    UtilitareÎncheiere.verificăŞoaptăButon($încheiere, $butonPentruÎncheiere);
    UtilitareÎncheiere.verificăSubtitlu($încheiere, 'cu privire la instalarea în spaţiul locativ');
    UtilitareÎncheiere.verificăSecţiuni($încheiere,
      ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

    setTimeout(function () { // pentru observabilitate
      $încheiere.find('.închide').click();

      start();
    }, app.PAUZĂ_DE_OBSERVABILITATE);
  });
});
