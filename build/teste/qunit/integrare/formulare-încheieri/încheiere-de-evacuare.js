// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Încheiere de evacuare', function() {
  /*global UtilitareÎncheiere:false */
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi,
      obiect = 'evacuarea';

  ok($formular.is(':visible'), 'formularul de procedură e deschis');

  if ($formular.is(':not(:visible)')) {
    start();
    return;
  }

  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val(obiect).change();
  equal($secţiune.find('#obiect').val(), obiect, 'setat obiectul corespunzător');

  var $dataEvacuării = $secţiune.find('li:has(#data-şi-ora-evacuării)');

  ok($dataEvacuării.există(), 'avem cîmp pentru data şi ora evacuării');
  equal($dataEvacuării.val(), '', '…implicit necompletată');
  ok($secţiune.find('#se-acordă-alt-spaţiu').există(), 'avem bifă “Se acordă alt spaţiu”');
  ok($secţiune.find('#se-acordă-alt-spaţiu').is(':not(:checked)'), '…implicit nebifată');
  ok($secţiune.find('#din-încăperea').există(), 'avem cîmpul “Din încăperea”');
  equal($secţiune.find('#din-încăperea').val(), '', '…implicit necompletat');

  var adresa = 'str. Cutărescu 17\nChişinău',
      dataŞiOraEvacuării = '03.03.2013 ora 15:30';

  $secţiune.find('#din-încăperea').val(adresa);
  $secţiune.find('#data-şi-ora-evacuării').val(dataŞiOraEvacuării);
  $secţiune.find('#se-acordă-alt-spaţiu').click();

  // adăugăm o amînare
  var $container = $dataEvacuării.next('.container-buton'),
      $butonDeAdăugare = $container.find('button.adaugă-cîmp-personalizat');

  ok($butonDeAdăugare.există(), 'avem buton de adăugare amînare');
  $butonDeAdăugare.click();

  var $amînare = $container.prev('.personalizat'),
      dataAmînării = '05.05.2013 15:15';

  ok($amînare.există(), 's-a adăugat cîmp pentru amînare');
  $amînare.find('.dată').val(dataAmînării);


  var procedură = app.FormularProcedură.colectează();

  (function verificăColectarea() {
    equal(procedură['obiectul-urmăririi']['data-şi-ora-evacuării'], dataŞiOraEvacuării, 'colectarea: data şi ora evacuării');
    ok(procedură['obiectul-urmăririi']['se-acordă-alt-spaţiu'], 'colectarea: “Se acordă alt spaţiu”');
    equal(procedură['obiectul-urmăririi']['din-încăperea'], adresa, 'colectarea: adresa');
    equal(procedură['obiectul-urmăririi']['amînări'].length, 1, 'colectarea: numărul amînărilor corespunde');
    equal(procedură['obiectul-urmăririi']['amînări'][0]['Amînat pînă la'], dataAmînării, 'colectarea: data şi ora amînării corespunde');
  })();


  $formular.find('.bara-de-instrumente .salvează').click();
  $formular.one('salvat', function() {
    ok(true, 'salvat');
    $formular.one('închis', function() {
      app.ProceduriRecente.$.find('.item:first').click();
      $formular.one('populat', function() {
        ok(true, 'redeschis şi populat');

        equal($secţiune.find('#din-încăperea').val(), adresa, 'popularea: adresa');
        ok($secţiune.find('#se-acordă-alt-spaţiu').is(':checked'), 'popularea: “Se acordă alt spaţiu” s-a bifat');
        equal($secţiune.find('#data-şi-ora-evacuării').val(), dataŞiOraEvacuării, 'popularea: data şi ora evacuării');
        equal($secţiune.find('.amînare.personalizat').length, 1, 'popularea: corespunde numărul de amînări');
        equal($secţiune.find('.amînare.personalizat .etichetă').val(), 'Amînat pînă la', 'popularea: corespunde eticheta amînării');
        equal($secţiune.find('.amînare.personalizat .dată').val(), dataAmînării, 'popularea: corespunde data şi ora amînării');

        var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

        ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
        $butonPentruÎncheiere.click();

        var formular = app.Încheieri.formular($butonPentruÎncheiere),
            meta = app.Încheieri.deschise[formular];

        app.$(meta).one('iniţializat', function() {
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
          UtilitareÎncheiere.verificăSubtitlu($încheiere, 'de numire a datei evacuării forţate');
          UtilitareÎncheiere.verificăSecţiuni($încheiere,
            ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

          setTimeout(function() { // pentru observabilitate
            $încheiere.find('.închide').click();

            start();
          }, app.PAUZĂ_DE_OBSERVABILITATE);
        });
      }); // one populat
    }); // one închis

    $formular.find('button.închide').click();
  }); // one salvat
});
