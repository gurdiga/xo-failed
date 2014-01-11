asyncTest('Borderou de calcul', function() {
  /*global UtilitareÎncheiere:false */
  'use strict';

  var app = this.app,
      $cheltuieli = app.Cheltuieli.$,
      $cheltuieliAdăugate = app.Cheltuieli.$adăugate,
      $categorii = app.Cheltuieli.categorii.$;

  app.$.fx.off = true;
  app.Profil.date['cod-fiscal'] = ''; // pentru verificare ulterioară

  ok(app.FormularProcedură.$.is(':not(:visible)'), 'formularul de procedură e închis');

  app.FormularProcedură.$.one('populat', function() {
    app.Cheltuieli.$adăugate.children(':not(#taxaA1, #taxaA2)').remove();

    (function adaugăTaxaA6() {
      $categorii.find('#taxaA6').click();

      ok($cheltuieliAdăugate.children('#taxaA6').există(), 'adăugat taxaA6');
      $cheltuieliAdăugate.children('#taxaA6').find('#din-arhivă').prop('checked', true);
    })();


    (function adaugăSpeza1() {
      $categorii.find('#speza1').click();

      var $speza = $cheltuieli.find('.adăugate #speza1');

      $speza.find('button.adaugă-cîmp-personalizat').click();

      var $itemi = $speza.find('.subsecţiune .personalizat');

      equal($itemi.length, 2, 'avem două cheltuieli');

      ok($itemi.eq(0).find('.etichetă').val('Transport de ocazie').există(), '…setat descrierea pentru prima speză');
      ok($itemi.eq(0).find('.sumă').val('120').există(), '…setat sumă pentru prima speză');

      ok($itemi.eq(1).find('.etichetă').val('Taxi').există(), '…setat descrierea pentru a doua speză');
      ok($itemi.eq(1).find('.sumă').val('55').există(), '…setat suma pentru a doua speză');
    })();


    var speza5 = [{
      'data-şi-ora-deplasării': '10.10.2010 10:10',
      'note-deplasare': 'prima deplasare'
    }, {
      'data-şi-ora-deplasării': '11.11.2011 11:11',
      'note-deplasare': 'a doua deplasare'
    }];


    (function adaugăSpeza5() {
      $categorii.find('#speza5').click();

      var $speza5 = $cheltuieli.find('.adăugate #speza5');

      ok($speza5.există(), 'adăugat un exemplar de speza5');
      ok($speza5.find('#data-şi-ora-deplasării').val(speza5[0]['data-şi-ora-deplasării']).există(), 'setat data şi ora deplasării');
      ok($speza5.find('#note-deplasare').val(speza5[0]['note-deplasare']).există(), 'setat descrierea deplasării');
    })();


    (function adaugăÎncăOSpeză5() {
      $categorii.find('#speza5').click();

      var $speza5 = $cheltuieli.find('.adăugate #speza5').last();

      ok($speza5.există(), 'adăugat încă un exemplar de speza5');
      ok($speza5.find('#data-şi-ora-deplasării').val(speza5[1]['data-şi-ora-deplasării']).există(), 'setat data şi ora deplasării');
      ok($speza5.find('#note-deplasare').val(speza5[1]['note-deplasare']).există(), 'setat descrierea deplasării');
      ok($speza5.find('#în-afara-circumscripţiei').prop('checked', true).există(), 'setat în afara circumscripţiei');
    })();

    $cheltuieli.find('.adăugate #taxaA1 :checkbox').prop('checked', true);

    var $butonÎncheiere = $cheltuieli.find('a[href="/formulare-încheieri/borderou-de-calcul.html"]'),
        formular = $butonÎncheiere.attr('href');

    ok($butonÎncheiere.există(), 'avem buton pentru borderoul de calcul');
    $butonÎncheiere.click();

    var meta = app.Încheieri.deschise[formular],
        încheiere, $încheiere;

    app.$(meta).one('iniţializat', function() {
      ok(true, 'iniţializat borderoul de calcul');

      încheiere = meta.tab;
      $încheiere = app.$(încheiere.document);

      equal(încheiere.document.title, 'Borderou de calcul', 'avem <title>');
      ok($încheiere.find('h1:contains("Borderou de calcul")').există(), 'avem titlu');

      UtilitareÎncheiere.verificăSecţiuni($încheiere,
        ['Procedura', 'Creditorul', 'Debitorul', 'Calculele', 'Rechizite bancare', 'Executorul']);

      verificăTabelul($încheiere);
      verificăRechiziteleBancare($încheiere);

      încheiere.Încheiere.$.find('.închide').click();
      app.FormularProcedură.$.find('.închide').click();
      app.$.fx.off = false;

      start();
    });

    // --------------------------------------------------
    function verificăTabelul($încheiere) {
      var $tabel = $încheiere.find('table#borderou-de-calcul'),
          $titluriColoniţe = $tabel.children().first().find('th');

      ok($tabel.există(), 'avem tabelul');
      ok($titluriColoniţe.există(), 'avem titlurile pentru coloniţe');
      equal($titluriColoniţe.eq(0).text(), '', 'în coloniţa 1 nu avem nimic');
      equal($titluriColoniţe.eq(1).text(), '', 'în coloniţa 2 nu avem nimic');
      equal($titluriColoniţe.eq(2).text(), 'lei', 'în coloniţa 3 avem «lei»');
      equal($titluriColoniţe.eq(3).text(), 'achitat la', 'în coloniţa 4 avem «achitat la»');

      var $secţiuni = $tabel.find('thead.secţiune'),
          $taxe = $secţiuni.eq(0),
          $taxeItemi = $taxe.next('tbody').children(),
          $coloniţePrimaTaxă = $taxeItemi.eq(0).children(),
          $coloniţeADouaTaxă = $taxeItemi.eq(1).children(),
          $coloniţeTotalTaxe = $taxeItemi.eq(3).children(),
          $coloniţeTotalTaxeRămasDeAchitat = $taxeItemi.eq(4).children(),
          taxaDeIntentare = $cheltuieli.find('.adăugate #taxaA1 p').find('.uc').remove().end().contents().text().trim(),
          taxaDeArhivare = $cheltuieli.find('.adăugate #taxaA2 p').find('.uc').remove().end().contents().text().trim(),
          dataAchităriiTaxeiDeIntentare = $cheltuieli.find('.adăugate #taxaA1 .achitare .dată').val();

      equal($taxe.find('th').text(), 'Taxe', 'prima secţiune e Taxe');
      equal($coloniţePrimaTaxă.eq(0).text(), 1, 'în prima coloniţă e numărul de ordine: 1');
      equal($coloniţePrimaTaxă.eq(1).text(), taxaDeIntentare, 'în a doua coloniţă e descrierea: ' + taxaDeIntentare);
      equal($coloniţePrimaTaxă.eq(2).text(), app.UC, 'în a treia coloniţă e costul ' + app.UC + ' lei');
      equal($coloniţePrimaTaxă.eq(3).text(), dataAchităriiTaxeiDeIntentare, 'în a patra coloniţă e data achitării');
      equal($coloniţeADouaTaxă.eq(0).text(), 2, 'în a doua coloniţă e numărul de ordine: 1');
      equal($coloniţeADouaTaxă.eq(1).text(), taxaDeArhivare, 'în a doua coloniţă e descrierea: ' + taxaDeArhivare);
      equal($coloniţeADouaTaxă.eq(2).text(), app.UC * 3, 'în a treia coloniţă e costul ' + app.UC * 3 + ' lei');
      equal($coloniţeADouaTaxă.eq(3).text(), '—', 'în a patra coloniţă e data achitării');
      equal($coloniţeTotalTaxe.eq(1).text(), 'Total achitat', 'avem linia cu total taxe achitat');
      equal($coloniţeTotalTaxe.eq(2).text(), app.UC, 'totalul cheltuielilor achitate e caclulat corect');
      equal($coloniţeTotalTaxeRămasDeAchitat.eq(1).text(), 'Total rămas de achitat', 'avem linia cu total taxe rămas de achitat');
      equal($coloniţeTotalTaxeRămasDeAchitat.eq(2).text(), app.UC * (1 + 3 + 1), 'totalul cheltuielilor rămase de achitat e calculat corect');

      var $speze = $secţiuni.eq(1),
          $spezeItemi = $speze.next('tbody').children('tr'),
          $speza1 = $spezeItemi.eq(0).children(),
          descriereSpeză = $cheltuieli.find('.adăugate #speza1 p').text().trim(),
          $costuriItemiSpeză = $cheltuieli.find('.adăugate #speza1 .personalizat .sumă'),
          totalCostSpeză = $costuriItemiSpeză.eq(0).suma() + $costuriItemiSpeză.eq(1).suma(),
          U = încheiere.Încheiere.utilitare;

      equal($speze.find('th').text(), 'Speze', 'a doua secţiune e Speze');
      equal($speza1.eq(0).text(), 1, 'în prima coloniţă e numărul de ordine: 1');
      equal($speza1.eq(1).text(), descriereSpeză, 'în a doua coloniţă e descrierea: ' + descriereSpeză);
      equal($speza1.eq(2).text(), totalCostSpeză, 'în a treia coloniţă e suma costurilor itemilor din speză: ' + totalCostSpeză);
      equal($speza1.eq(3).text(), '—', 'în a patra coloniţă e liniuţă (nu e achitat)');

      var $speza5Exemplar1 = $spezeItemi.eq(1).children('td'),
          descriere = U.normalizeazăSpaţii($speza5Exemplar1.eq(1).text());

      equal($speza5Exemplar1.eq(0).text(), '2', 'în prima coloniţă e numărul de ordine 2');
      ok(descriere.indexOf(speza5[0]['note-deplasare']) > 0, 'în descrierea itemului se menţionează notele la deplasare: ' + descriere);
      equal($speza5Exemplar1.eq(2).text(), '300.00', '15 u.c. taxă unică');

      var $speza5Exemplar2 = $spezeItemi.eq(2).children('td');

      descriere = U.normalizeazăSpaţii($speza5Exemplar2.eq(1).text());

      equal($speza5Exemplar2.eq(0).text(), '3', 'în prima coloniţă e numărul de ordine 3');
      ok(descriere.indexOf(speza5[1]['note-deplasare']) > 0, 'în descrierea itemului se menţionează notele la deplasarea a doua: ' + descriere);
      equal($speza5Exemplar2.eq(2).text(), '100.00', '5 u.c. — e în afara circumscripţiei');

      var $totalSpezeRămasDeAchitat = $spezeItemi.eq(3);

      equal($totalSpezeRămasDeAchitat.find('td').eq(1).text(), 'Total rămas de achitat', 'avem linia cu total speze rămas de achitat');

      var $onorariu = $secţiuni.eq(2),
          $sumaOnorariu = $onorariu.next('tbody').children().eq(0).children();

      equal($onorariu.find('th').text(), 'Onorariu', 'a treia secţiune e Onorariu');
      equal($sumaOnorariu.eq(0).text(), 1, 'în prima coloniţă e numărul de ordine: 1');
      equal($sumaOnorariu.eq(1).text(), 'Suma', 'în a doua coloniţă e cuvîntul “Suma”');
      equal($sumaOnorariu.eq(2).text(), app.Onorariu.$.suma(), 'în a treia coloniţă e suma onorariului');
    }

    // --------------------------------------------------
    function verificăRechiziteleBancare($încheiere) {
      var $rechiziteBancare = $încheiere.find('table#rechizite-bancare'),
          profil = app.Profil.date;

      var $beneficiar = $rechiziteBancare.find('th:contains("Beneficiar:"):first'),
          $rîndBeneficiar = $beneficiar.parent('tr').children('td');

      ok($beneficiar.există(), '…avem Beneficiar');
      equal($rîndBeneficiar.eq(0).text(), profil['nume'], '…valoare pentru cauţiuni, taxe şi speze');
      equal($rîndBeneficiar.eq(1).text(), profil['nume'], '…valoare onorarii');

      var $codFiscal = $rechiziteBancare.find('th:contains("Cod fiscal:")'),
          $rîndCodFiscal = $codFiscal.parent('tr').children('td'),
          necompletat = app.Profil.cîmpNecompletat;

      ok($codFiscal.există(), '…avem Cod fiscal');
      equal($rîndCodFiscal.eq(0).text(), necompletat, '…valoare pentru cauţiuni, taxe şi speze');
      equal($rîndCodFiscal.eq(1).text(), necompletat, '…valoare onorarii');

      var $codBancar = $rechiziteBancare.find('th:contains("Cod bancar:")'),
          $rîndCodBancar = $codBancar.parent('tr').children('td');

      ok($codBancar.există(), '…avem Nr. cod bancar');
      equal($rîndCodBancar.eq(0).text(), profil['cont-taxe-speze'], '…valoare pentru cauţiuni, taxe şi speze');
      equal($rîndCodBancar.eq(1).text(), profil['cont-onorarii'], '…valoare pentru onorarii');

      var context = încheiere.Încheiere.context();

      var $banca = $rechiziteBancare.find('th:contains("Bancă:")'),
          $rîndBanca = $banca.parent('tr').children('td');

      ok($banca.există(), '…avem Banca beneficiară:');
      equal($rîndBanca.eq(0).text(), context.executor['denumire-bancă-taxe-speze'], '…valoare pentru cauţiuni, taxe şi speze');
      equal($rîndBanca.eq(1).text(), context.executor['denumire-bancă-onorarii'], '…valoare pentru onorarii');

      var $codBancă = $rechiziteBancare.find('th:contains("Cod bancă:")'),
          $rîndCodBancă = $codBancă.parent('tr').children('td');

      ok($codBancă.există(), '…avem Cod bancă:');
      equal($rîndCodBancă.eq(0).text(), context.executor['cod-bancă-taxe-speze'], '…valoare pentru cauţiuni, taxe şi speze');
      equal($rîndCodBancă.eq(1).text(), context.executor['cod-bancă-onorarii'], '…valoare pentru onorarii');
    }
  });

  app.ProceduriRecente.$.find('.item:first-child').click();
});

