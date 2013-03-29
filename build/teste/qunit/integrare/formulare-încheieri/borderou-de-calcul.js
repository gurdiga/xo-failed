asyncTest('Borderou de calcul', function () {
  /*global UtilitareÎncheiere:false */
  /*jshint maxlen:143 */
  'use strict';

  var app = this.app, încheiere;

  app.$.fx.off = true;
  app.Profil.date['cod-fiscal'] = ''; // pentru verificare ulterioară
  app.ProceduriRecente.$.find('.item:first-child').click();


  (function adaugăTaxaA6() {
    app.Cheltuieli.$.find('#categorii-taxe-şi-speze').find('#taxaA6').click();

    var $taxa = app.Cheltuieli.$.find('.adăugate #taxaA6');

    $taxa.find('#din-arhivă').attr('checked', true);
  })();


  (function adaugăOSpeză() {
    app.Cheltuieli.$.find('#categorii-taxe-şi-speze').find('#speza1').click();

    var $speza = app.Cheltuieli.$.find('.adăugate #speza1');

    $speza.find('button.adaugă').click();

    var $itemi = $speza.find('.subformular .document');

    $itemi.eq(0).find('.descriere').val('Transport de ocazie');
    $itemi.eq(0).find('.sumă').val('120');

    $itemi.eq(1).find('.descriere').val('Taxi');
    $itemi.eq(1).find('.sumă').val('55');
  })();


  (function marcheazăPrimaTaxăAchitată() {
    app.Cheltuieli.$.find('.adăugate #taxaA1 :checkbox').attr('checked', true);
  })();


  var cîmpTotalTaxeŞiSpeze = app.Cheltuieli.$.find('#total-taxe-şi-speze'),
      $butonÎncheiere = cîmpTotalTaxeŞiSpeze.siblings('.buton[data-formular="borderou-de-calcul"]'),
      formular = app.ButoanePentruÎncheieri.formular($butonÎncheiere);

  ok($butonÎncheiere.există(), 'avem buton pentru borderoul de calcul');
  $butonÎncheiere.click();

  încheiere = app.Încheieri.deschise[formular].tab;

  app.$(încheiere).one('iniţializat', function () {
    ok(true, 'iniţializat borderoul de calcul');

    var $încheiere = app.$(încheiere.document);

    equal(încheiere.document.title, 'Borderou de calcul', 'avem <title>');
    ok($încheiere.find('h1:contains("Borderou de calcul")').există(), 'avem titlu');

    verificăStructura($încheiere);
    verificăTabelul($încheiere);
    verificăRechiziteleBancare($încheiere);

    setTimeout(function () { // aşteptăm o leacă să se vadă borderoul
      app.$(încheiere).one('închis', function () {
        setTimeout(function () { // mai aşteptăm o leacă să se vadă formularul de procedură după închiderea borderoului
          app.FormularProcedură.$.find('.închide').click();
          app.$.fx.off = false;

          start();
        }, app.PAUZĂ_DE_OBSERVABILITATE);
      });

      $încheiere.find('.închide').click();
    }, app.PAUZĂ_DE_OBSERVABILITATE);
  });


  // --------------------------------------------------
  function verificăStructura($încheiere) {
    UtilitareÎncheiere.verificăSecţiuni($încheiere,
      ['Procedura', 'Creditorul', 'Debitorul', 'Calculele', 'Rechizite bancare', 'Executorul']);
  }

  // --------------------------------------------------
  function verificăTabelul($încheiere) {
    /*jshint maxstatements:33 */
    var $tabel = $încheiere.find('section .conţinut table#borderou-de-calcul'),
        $titluriColoniţe = $tabel.find('thead:first-child:not(.secţiune)');

    ok($tabel.există(), 'avem tabelul');
    ok($titluriColoniţe.există(), 'avem titlurile pentru coloniţe');
    equal($titluriColoniţe.find('th').eq(0).text(), '', 'în coloniţa 1 nu avem nimic');
    equal($titluriColoniţe.find('th').eq(1).text(), '', 'în coloniţa 2 nu avem nimic');
    equal($titluriColoniţe.find('th').eq(2).text(), 'lei', 'în coloniţa 3 avem «lei»');
    equal($titluriColoniţe.find('th').eq(3).text(), 'achitat la', 'în coloniţa 4 avem «achitat la»');

    var $secţiuni = $tabel.find('thead.secţiune'),
        $taxe = $secţiuni.eq(0),
        $taxeItemi = $taxe.next('tbody'),
        $primaTaxă = $taxeItemi.children('tr').eq(0),
        $aDouaTaxă = $taxeItemi.children('tr').eq(1),
        $totalTaxeAchitat = $taxeItemi.children('tr').eq(3),
        $totalTaxeRămasDeAchitat = $taxeItemi.children('tr').eq(4),
        $cheltuieli = app.Cheltuieli.$,
        taxaDeIntentare = $cheltuieli.find('.adăugate #taxaA1 p').contents(':not(.uc)').text().trim(),
        taxaDeArhivare = $cheltuieli.find('.adăugate #taxaA2 p').contents(':not(.uc)').text().trim(),
        dataAchităriiTaxeiDeIntentare = $cheltuieli.find('.adăugate #taxaA1 .achitare .dată').val();

    equal($taxe.find('th').text(), 'Taxe', 'prima secţiune e Taxe');
    equal($primaTaxă.find('td').eq(0).text(), 1, 'în prima coloniţă e numărul de ordine: 1');
    equal($primaTaxă.find('td').eq(1).text(), taxaDeIntentare, 'în a doua coloniţă e descrierea: ' + taxaDeIntentare);
    equal($primaTaxă.find('td').eq(2).text(), app.UC, 'în a treia coloniţă e costul ' + app.UC + ' lei');
    equal($primaTaxă.find('td').eq(3).text(), dataAchităriiTaxeiDeIntentare, 'în a patra coloniţă e data achitării');
    equal($aDouaTaxă.find('td').eq(0).text(), 2, 'în a doua coloniţă e numărul de ordine: 1');
    equal($aDouaTaxă.find('td').eq(1).text(), taxaDeArhivare, 'în a doua coloniţă e descrierea: ' + taxaDeArhivare);
    equal($aDouaTaxă.find('td').eq(2).text(), app.UC * 3, 'în a treia coloniţă e costul ' + app.UC * 3 + ' lei');
    equal($aDouaTaxă.find('td').eq(3).text(), '—', 'în a patra coloniţă e data achitării');
    equal($totalTaxeAchitat.find('td').eq(1).text(), 'Total achitat', 'avem linia cu total taxe achitat');
    equal($totalTaxeAchitat.find('td').eq(2).text(), app.UC, 'totalul cheltuielilor achitate e caclulat corect');
    equal($totalTaxeRămasDeAchitat.find('td').eq(1).text(), 'Total rămas de achitat', 'avem linia cu total taxe rămas de achitat');
    equal($totalTaxeRămasDeAchitat.find('td').eq(2).text(), app.UC * (1 + 3 + 1), 'totalul cheltuielilor rămase de achitat e calculat corect');

    var $speze = $secţiuni.eq(1),
        $spezeItemi = $speze.next('tbody'),
        $primaSpeză = $spezeItemi.children('tr').eq(0),
        descriereSpeză = app.Cheltuieli.$.find('.adăugate #speza1 p').text().trim(),
        $costuriItemiSpeză = app.Cheltuieli.$.find('.adăugate #speza1 .document .sumă'),
        $totalSpezeRămasDeAchitat = $spezeItemi.children('tr').eq(1),
        totalCostSpeză = $costuriItemiSpeză.eq(0).suma() + $costuriItemiSpeză.eq(1).suma();

    equal($speze.find('th').text(), 'Speze', 'a doua secţiune e Speze');
    equal($primaSpeză.find('td').eq(0).text(), 1, 'în prima coloniţă e numărul de ordine: 1');
    equal($primaSpeză.find('td').eq(1).text(), descriereSpeză, 'în a doua coloniţă e descrierea: ' + descriereSpeză);
    equal($primaSpeză.find('td').eq(2).text(), totalCostSpeză, 'în a treia coloniţă e suma costurilor itemilor din speză: ' + totalCostSpeză);
    equal($primaSpeză.find('td').eq(3).text(), '—', 'în a patra coloniţă e liniuţă (nu e achitat)');
    equal($totalSpezeRămasDeAchitat.find('td').eq(1).text(), 'Total rămas de achitat', 'avem linia cu total speze rămas de achitat');

    var $onorariu = $secţiuni.eq(2),
        $sumaOnorariu = $onorariu.next('tbody').children('tr').eq(0);

    equal($onorariu.find('th').text(), 'Onorariu', 'a treia secţiune e Onorariu');
    equal($sumaOnorariu.find('td').eq(0).text(), 1, 'în prima coloniţă e numărul de ordine: 1');
    equal($sumaOnorariu.find('td').eq(1).text(), 'Suma', 'în a doua coloniţă e cuvîntul “Suma”');
    equal($sumaOnorariu.find('td').eq(2).text(), app.Onorariu.$.suma(), 'în a treia coloniţă e suma onorariului');
  }

  // --------------------------------------------------
  function verificăRechiziteleBancare($încheiere) {
    /*jshint maxlen:136*/
    var $rechiziteBancare = $încheiere.find('table#rechizite-bancare'),
        profil = app.Profil.date;

    var $beneficiar = $rechiziteBancare.find('th:contains("Beneficiar:"):first'),
        $rîndBeneficiar = $beneficiar.parent('tr');

    ok($beneficiar.există(), '…avem Beneficiar');
    equal($rîndBeneficiar.find('td').eq(0).text(), profil['nume'], '…valoare pentru cauţiuni, taxe şi speze');
    equal($rîndBeneficiar.find('td').eq(1).text(), profil['nume'], '…valoare onorarii');

    var $codFiscal = $rechiziteBancare.find('th:contains("Cod fiscal:")'),
        $rîndCodFiscal = $codFiscal.parent('tr'),
        necompletat = app.Profil.cîmpNecompletat;

    ok($codFiscal.există(), '…avem Cod fiscal');
    equal($rîndCodFiscal.find('td').eq(0).text(), necompletat, '…valoare pentru cauţiuni, taxe şi speze');
    equal($rîndCodFiscal.find('td').eq(1).text(), necompletat, '…valoare onorarii');

    var $codBancar = $rechiziteBancare.find('th:contains("Cod bancar:")'),
        $rîndCodBancar = $codBancar.parent('tr');

    ok($codBancar.există(), '…avem Nr. cod bancar');
    equal($rîndCodBancar.find('td').eq(0).text(), profil['cont-taxe-speze'], '…valoare pentru cauţiuni, taxe şi speze');
    equal($rîndCodBancar.find('td').eq(1).text(), profil['cont-onorarii'], '…valoare pentru onorarii');

    var context = încheiere.Încheiere.context();

    var $banca = $rechiziteBancare.find('th:contains("Bancă:")'),
        $rîndBanca = $banca.parent('tr');

    ok($banca.există(), '…avem Banca beneficiară:');
    equal($rîndBanca.find('td').eq(0).text(), context.executor['denumire-bancă-taxe-speze'], '…valoare pentru cauţiuni, taxe şi speze');
    equal($rîndBanca.find('td').eq(1).text(), context.executor['denumire-bancă-onorarii'], '…valoare pentru onorarii');

    var $codBancă = $rechiziteBancare.find('th:contains("Cod bancă:")'),
        $rîndCodBancă = $codBancă.parent('tr');

    ok($codBancă.există(), '…avem Cod bancă:');
    equal($rîndCodBancă.find('td').eq(0).text(), context.executor['cod-bancă-taxe-speze'], '…valoare pentru cauţiuni, taxe şi speze');
    equal($rîndCodBancă.find('td').eq(1).text(), context.executor['cod-bancă-onorarii'], '…valoare pentru onorarii');
  }
});

