asyncTest('Procedură: verifică borderou de calcul', function () {
  'use strict';

  var app = this.app, încheiere;

  app.Profil.date['codul-fiscal'] = ''; // pentru verificare ulterioară
  app.ProceduriRecente.$.find('.item:first-child').click();

  app.$(app.Procedura.$).one('populat', function () {
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

        var numărComplet = app.Utilizator.login + app.Procedura.număr(),
            $secţiuneProcedură = $încheiere.find('section header:contains("Procedura")'),
            $secţiuneProcedurăConţinut = $secţiuneProcedură.next('.conţinut');

        ok($secţiuneProcedură.există(), 'avem secţiunea Procedura');
        ok($secţiuneProcedurăConţinut.is(':contains("' + numărComplet + '")'), 'avem numărul procedurii');
        ok($încheiere.find('section header:contains("Creditor")').există(), 'avem secţiunea Creditor');
        ok($încheiere.find('section header:contains("Debitor")').există(), 'avem secţiunea Debitor');
        ok($încheiere.find('section header:contains("Executor")').există(), 'avem secţiunea Executor');

        var tabel = $încheiere.find('section .conţinut table#borderou-de-calcul');

        ok(tabel.există(), 'avem tabelul');
        ok(tabel.find('th[colspan=5]:contains("Taxe")').există(), 'în el avem secţiunea Taxe');
        ok(tabel.find('th[colspan=5]:contains("Speze")').există(), 'în el avem secţiunea Speze');
        ok(tabel.find('th[colspan=5]:contains("Onorariu")').există(), 'în el avem secţiunea Onorariu');
        equal(tabel.find('tbody td:contains("Total")').length, 2,
            'în el avem 2 rînduri Total: pentru taxe şi pentru speze');

        var taxaDeIntentare = app.Cheltuieli.$.find('.adăugate #taxaA1 p').text().trim();

        ok(tabel.find('td:contains("' + taxaDeIntentare + '")').există(), 'găsit ' + taxaDeIntentare);

        verificăRechiziteleBancare($încheiere);

        ok($încheiere.find('#semnătura').există(), 'avem loc pentru semnătură');
        ok($încheiere.find('#ştampila').există(), 'avem loc pentru ştampila');

        app.Procedura.$.find('.închide').click();
        start();
      });
    });
  });

  // --------------------------------------------------
  function verificăRechiziteleBancare($încheiere) {
    var $rechiziteBancare = $încheiere.find('table#rechizite-bancare'),
        profil = app.Profil.date;

    var $beneficiar = $rechiziteBancare.find('th:contains("Beneficiar:"):first'),
        $rîndBeneficiar = $beneficiar.parent('tr');

    ok($beneficiar.există(), '…avem Beneficiar');
    equal($rîndBeneficiar.find('td').eq(0).text(), profil['nume'],
        '…valoare pentru cauţiuni, taxe şi speze');
    equal($rîndBeneficiar.find('td').eq(1).text(), profil['nume'],
        '…valoare onorarii');

    var $codFiscal = $rechiziteBancare.find('th:contains("Cod fiscal:")'),
        $rîndCodFiscal = $codFiscal.parent('tr');

    ok($codFiscal.există(), '…avem Cod fiscal');
    equal($rîndCodFiscal.find('td').eq(0).text(), app.Profil.cîmpNecompletat,
        '…valoare pentru cauţiuni, taxe şi speze');
    equal($rîndCodFiscal.find('td').eq(1).text(), app.Profil.cîmpNecompletat,
        '…valoare onorarii');

    var $codBancar = $rechiziteBancare.find('th:contains("Cod bancar:")'),
        $rîndCodBancar = $codBancar.parent('tr');

    ok($codBancar.există(), '…avem Nr. cod bancar');
    equal($rîndCodBancar.find('td').eq(0).text(), profil['cont-taxe-speze'],
        '…valoare pentru cauţiuni, taxe şi speze');
    equal($rîndCodBancar.find('td').eq(1).text(), profil['cont-onorarii'],
        '…valoare pentru onorarii');

    var context = încheiere.Încheiere.context();

    var $banca = $rechiziteBancare.find('th:contains("Bancă:")'),
        $rîndBanca = $banca.parent('tr');

    ok($banca.există(), '…avem Banca beneficiară:');
    equal($rîndBanca.find('td').eq(0).text(), context.executor['denumire-bancă-taxe-speze'],
        '…valoare pentru cauţiuni, taxe şi speze');
    equal($rîndBanca.find('td').eq(1).text(), context.executor['denumire-bancă-onorarii'],
        '…valoare pentru onorarii');

    var $codBancă = $rechiziteBancare.find('th:contains("Cod bancă:")'),
        $rîndCodBancă = $codBancă.parent('tr');

    ok($codBancă.există(), '…avem Cod bancă:');
    equal($rîndCodBancă.find('td').eq(0).text(), context.executor['cod-bancă-taxe-speze'],
        '…valoare pentru cauţiuni, taxe şi speze');
    equal($rîndCodBancă.find('td').eq(1).text(), context.executor['cod-bancă-onorarii'],
        '…valoare pentru onorarii');
  }
});

