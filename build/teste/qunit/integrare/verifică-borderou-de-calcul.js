asyncTest('Procedură: verifică borderou de calcul', function () {
  'use strict';

  var app = this.app, încheiere;

  app.Profil.date['codul-fiscal'] = ''; // pentru verificare ulterioară
  app.ProceduriRecente.$.find('.item:first-child').click();

  app.$(app.Procedura.$).one('populat', function () {
    adaugăOSpeză();
    marcheazăPrimaTaxăAchitată();

    setTimeout(function () { // aşteptăm o leacă să se termine animaţia
      var cîmpTotalTaxeŞiSpeze = app.Cheltuieli.$.find('#total-taxe-şi-speze'),
          $butonÎncheiere = cîmpTotalTaxeŞiSpeze.siblings('.buton[data-formular="borderou-de-calcul"]'),
          formular = app.ButoanePentruÎncheieri.formular($butonÎncheiere);

      ok($butonÎncheiere.există(), 'avem buton pentru borderoul de calcul');
      $butonÎncheiere.click();

      încheiere = app.Încheieri.deschise[formular].tab;

      app.$(încheiere).one('iniţializat', function () {
        ok(true, 'iniţializat borderoul de calcul');

        var $încheiere = app.$(încheiere.document),
            $butonDeSalvare = $încheiere.find('.salvează');

        $butonDeSalvare.click();

        app.$(încheiere).one('salvat', function () {
          ok(true, 'salvat borderoul de calcul');

          var procedura = app.Procedura.colectează();

          equal(procedura.cheltuieli.încheiere, încheiere.Încheiere.pagina, '…înregistrat în procedură');
          equal(încheiere.document.title, 'Borderou de calcul', 'avem <title>');
          ok($încheiere.find('h1:contains("Borderou de calcul")').există(), 'avem titlu');

          verificăStructura($încheiere);
          verificăTabelul($încheiere);
          verificăRechiziteleBancare($încheiere);

          app.Procedura.$.find('.închide').click();
          start();
        });
      });
    }, 500);
  });

  // --------------------------------------------------
  function adaugăOSpeză() {
    app.Cheltuieli.$.find('#categorii-taxe-şi-speze').find('#speza1').click();

    var $speza = app.Cheltuieli.$.find('.adăugate #speza1');

    $speza.find('button.adaugă').click();

    var $itemi = $speza.find('.subformular .document');

    $itemi.eq(0).find('.descriere').val('Transport de ocazie');
    $itemi.eq(0).find('.sumă').val('120');

    $itemi.eq(1).find('.descriere').val('Taxi');
    $itemi.eq(1).find('.sumă').val('55');
  }

  // --------------------------------------------------
  function marcheazăPrimaTaxăAchitată() {
    app.Cheltuieli.$.find('.adăugate #taxaA1 :checkbox').attr('checked', true);
  }

  // --------------------------------------------------
  function verificăStructura($încheiere) {
    var numărComplet = app.Utilizator.login + app.Procedura.număr(),
        $secţiuneProcedură = $încheiere.find('section header:contains("Procedura")'),
        $secţiuneProcedurăConţinut = $secţiuneProcedură.next('.conţinut');

    ok($secţiuneProcedură.există(), 'avem secţiunea Procedura');
    ok($secţiuneProcedurăConţinut.is(':contains("' + numărComplet + '")'), 'avem numărul procedurii');
    ok($încheiere.find('section header:contains("Creditor")').există(), 'avem secţiunea Creditor');
    ok($încheiere.find('section header:contains("Debitor")').există(), 'avem secţiunea Debitor');
    ok($încheiere.find('section header:contains("Executor")').există(), 'avem secţiunea Executor');

    ok($încheiere.find('#semnătura').există(), 'avem loc pentru semnătură');
    ok($încheiere.find('#ştampila').există(), 'avem loc pentru ştampila');
  }

  // --------------------------------------------------
  function verificăTabelul($încheiere) {
    /*jshint maxlen:142*/
    var $tabel = $încheiere.find('section .conţinut table#borderou-de-calcul');

    ok($tabel.există(), 'avem tabelul');

    var $secţiuni = $tabel.find('thead'),
        $taxe = $secţiuni.eq(0),
        $primaTaxă = $taxe.next('tbody').children('tr').eq(0),
        taxaDeIntentare = app.Cheltuieli.$.find('.adăugate #taxaA1 p').text().trim(),
        dataAchitării = app.Cheltuieli.$.find('.adăugate #taxaA1 .achitare .dată').val();

    ok($primaTaxă.is('.achitat'), 'rîndul e marcat achitat');
    equal($taxe.find('th').text(), 'Taxe', 'prima secţiune e Taxe');
    equal($primaTaxă.find('td').eq(0).text(), 1, 'în prima coloniţă e numărul de ordine: 1');
    equal($primaTaxă.find('td').eq(1).text(), taxaDeIntentare, 'în a doua coloniţă e descrierea: ' + taxaDeIntentare);
    equal($primaTaxă.find('td').eq(2).text(), app.UC, 'în a treia coloniţă e costul' + app.UC + 'lei');
    equal($primaTaxă.find('td').eq(3).text(), dataAchitării, 'în a patra coloniţă e data achitării');

    var $speze = $secţiuni.eq(1),
        $primaSpeză = $speze.next('tbody').children('tr').eq(0),
        descriereSpeză = app.Cheltuieli.$.find('.adăugate #speza1 p').text().trim(),
        $costuriItemiSpeză = app.Cheltuieli.$.find('.adăugate #speza1 .document .sumă'),
        totalCostSpeză = $costuriItemiSpeză.eq(0).suma() + $costuriItemiSpeză.eq(1).suma();

    ok($primaSpeză.find('td').is(':not(.achitat)'), 'rîndul nu e marcat achitat');
    equal($speze.find('th').text(), 'Speze', 'a doua secţiune e Speze');
    equal($primaSpeză.find('td').eq(0).text(), 1, 'în prima coloniţă e numărul de ordine: 1');
    equal($primaSpeză.find('td').eq(1).text(), descriereSpeză, 'în a doua coloniţă e descrierea: ' + descriereSpeză);
    equal($primaSpeză.find('td').eq(2).text(), totalCostSpeză, 'în a treia coloniţă e suma costurilor itemilor din speză: ' + totalCostSpeză);
    equal($primaSpeză.find('td').eq(3).text(), '—', 'în a patra coloniţă e liniuţă (nu e achitat)');

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

