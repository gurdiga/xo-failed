// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Încheiere de instalare', function() {
  /*global UtilitareÎncheiere:false */
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi,
      obiect = 'instalarea';

  ok($formular.is(':visible'), 'formularul de procedură e deschis');
  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val(obiect).change();
  equal($secţiune.find('#obiect').val(), obiect, 'setat obiectul corespunzător');

  var $dataŞiOraInstalării = $secţiune.find('#data-şi-ora-instalării');

  ok($dataŞiOraInstalării.există(), 'avem cîmp pentru data şi ora instalării');
  equal($dataŞiOraInstalării.val(), '', '…implicit necompletat');
  ok($secţiune.find('#în-încăperea').există(), 'avem cîmpul “În încăperea”');
  equal($secţiune.find('#în-încăperea').val(), '', '…implicit necompletat');
  ok(!$secţiune.find('.amînare.personalizat').există(), 'implicit nu sunt cîmpuri pentru amînări');

  var adresa = 'str. Cutărescu 17\nChişinău',
      dataŞiOraInstalării = '04.04.2014 ora 14:30';

  $secţiune.find('#în-încăperea').val(adresa);
  $dataŞiOraInstalării.val(dataŞiOraInstalării);

  // adăugăm o amînare
  var $container = $dataŞiOraInstalării.parent().next('.container-buton'),
      $butonDeAdăugare = $container.find('button.adaugă-cîmp-personalizat');

  ok($butonDeAdăugare.există(), 'avem buton de adăugare amînare');
  $butonDeAdăugare.click();

  var $amînare = $container.prev('.personalizat'),
      dataAmînării = '05.05.2013 15:15';

  ok($amînare.există(), 's-a adăugat cîmp pentru amînare');
  $amînare.find('.dată').val(dataAmînării);


  var procedură = app.FormularProcedură.colectează();

  (function verificăColectarea() {
    equal(procedură['obiectul-urmăririi']['data-şi-ora-instalării'], dataŞiOraInstalării, 'colectarea: data şi ora instalării');
    equal(procedură['obiectul-urmăririi']['în-încăperea'], adresa, 'colectarea: adresa');
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

        equal($secţiune.find('#în-încăperea').val(), adresa, 'popularea: adresa');
        equal($secţiune.find('#data-şi-ora-instalării').val(), dataŞiOraInstalării, 'popularea: data şi ora instalării');
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
          UtilitareÎncheiere.verificăSubtitlu($încheiere, 'cu privire la instalarea în spaţiul locativ');
          UtilitareÎncheiere.verificăSecţiuni($încheiere,
            ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

          setTimeout(function() { // pentru observabilitate
            $încheiere.find('.închide').click();

            start();
          }, app.PAUZA_DE_OBSERVABILITATE);
        });
      }); // one populat
    }); // one închis

    $formular.find('button.închide').click();
  }); // one salvat
});
