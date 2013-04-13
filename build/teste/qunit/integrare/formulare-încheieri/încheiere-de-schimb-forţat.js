// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Încheiere de schimb forţat', function () {
  /*global UtilitareÎncheiere:false */
  /*jshint maxlen:148 */
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi,
      obiect = 'schimbul forţat';

  ok($formular.is(':visible'), 'formularul de procedură e deschis');
  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val(obiect).change();
  equal($secţiune.find('#obiect').val(), obiect, 'setat obiectul corespunzător');

  var $dataSchimbului = $secţiune.find('#data-şi-ora-schimbului');

  ok($dataSchimbului.există(), 'avem cîmp pentru data schimbului');
  equal($dataSchimbului.val(), '', '…implicit necompletat');
  ok($secţiune.find('#încăperea-pentru-creditor').există(), 'avem “Încăperea pentru creditor”');
  equal($secţiune.find('#încăperea-pentru-creditor').val(), '', '…implicit necompletat');
  ok($secţiune.find('#încăperea-pentru-debitor').există(), 'avem “Încăperea pentru debitor”');
  equal($secţiune.find('#încăperea-pentru-debitor').val(), '', '…implicit necompletat');
  ok(!$secţiune.find('.amînare.personalizat').există(), 'implicit nu avem cîmpuri pentru amănări');

  var adresaPentruCreditor = 'str. Creditorilor 17\nChişinău',
      adresaPentruDebitor = 'str. Debitorilor 17\nChişinău',
      dataSchimbului = '05.05.2013 ora 16:00';

  $secţiune.find('#încăperea-pentru-creditor').val(adresaPentruCreditor);
  $secţiune.find('#încăperea-pentru-debitor').val(adresaPentruDebitor);
  $dataSchimbului.val(dataSchimbului);

  // adăugăm o amînare
  var $container = $dataSchimbului.parent().next('.container-buton'),
      $butonDeAdăugare = $container.find('button.adaugă-cîmp-personalizat');

  ok($butonDeAdăugare.există(), 'avem buton de adăugare amînare');
  $butonDeAdăugare.click();

  var $amînare = $container.prev('.personalizat'),
      dataAmînării = '05.05.2013 15:15';

  ok($amînare.există(), 's-a adăugat cîmp pentru amînare');
  $amînare.find('.dată').val(dataAmînării);


  var procedură = app.FormularProcedură.colectează();

  (function verificăColectarea() {
    equal(procedură['obiectul-urmăririi']['data-şi-ora-schimbului'], dataSchimbului, 'colectarea: data şi ora schimbului');
    equal(procedură['obiectul-urmăririi']['încăperea-pentru-creditor'], adresaPentruCreditor, 'colectarea: adresa pentru creditor');
    equal(procedură['obiectul-urmăririi']['încăperea-pentru-debitor'], adresaPentruDebitor, 'colectarea: adresa pentru debitor');
    equal(procedură['obiectul-urmăririi']['amînări'].length, 1, 'colectarea: numărul amînărilor corespunde');
    equal(procedură['obiectul-urmăririi']['amînări'][0]['Amînat pînă la'], dataAmînării, 'colectarea: data şi ora amînării corespunde');
  })();


  $formular.find('.bara-de-instrumente .salvează').click();
  $formular.one('salvat', function () {
    ok(true, 'salvat');
    $formular.one('închis', function () {
      app.ProceduriRecente.$.find('.item:first').click();
      $formular.one('populat', function () {
        ok(true, 'redeschis şi populat');

        equal($secţiune.find('#încăperea-pentru-creditor').val(), adresaPentruCreditor, 'popularea: adresa pentru creditor');
        equal($secţiune.find('#încăperea-pentru-debitor').val(), adresaPentruDebitor, 'popularea: adresa pentru debitor');
        equal($secţiune.find('#data-şi-ora-schimbului').val(), dataSchimbului, 'popularea: data şi ora schimbului');
        equal($secţiune.find('.amînare.personalizat').length, 1, 'popularea: corespunde numărul de amînări');
        equal($secţiune.find('.amînare.personalizat .etichetă').val(), 'Amînat pînă la', 'popularea: corespunde eticheta amînării');
        equal($secţiune.find('.amînare.personalizat .dată').val(), dataAmînării, 'popularea: corespunde data şi ora amînării');


        var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

        ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
        $butonPentruÎncheiere.click();

        var formular = app.Încheieri.butonaşe.formular($butonPentruÎncheiere),
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
          equal($încheiere.find('address').eq(0).text(), adresaPentruCreditor, 'avem adresa pentru creditor');
          equal($încheiere.find('address').eq(1).text(), adresaPentruDebitor, 'avem adresa pentru debitor');

          UtilitareÎncheiere.verificăŞoaptăButon($încheiere, $butonPentruÎncheiere);
          UtilitareÎncheiere.verificăSubtitlu($încheiere, 'cu privire la schimbul forţat al locuinţelor');
          UtilitareÎncheiere.verificăSecţiuni($încheiere,
            ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

          setTimeout(function () {
            $încheiere.find('.închide').click();

            start();
          }, app.PAUZĂ_DE_OBSERVABILITATE);
        });
      }); // one populat
    }); // one închis

    $formular.find('button.închide').click();
  }); // one salvat
});
