asyncTest('Procedură: verifică borderou de calcul', function () {
  'use strict';

  var app = this.app;

  app.ProceduriRecente.$.find('.item:first-child').click();

  app.$(app.Procedura.$).one('populat', function () {
    var cîmpTotalTaxeŞiSpeze = app.Cheltuieli.$.find('#total-taxe-şi-speze'),
        $butonÎncheiere = cîmpTotalTaxeŞiSpeze.siblings('.buton[data-formular="borderou-de-calcul"]'),
        formular = app.ButoanePentruÎncheieri.formular($butonÎncheiere);

    ok($butonÎncheiere.există(), 'avem buton pentru borderoul de calcul');
    $butonÎncheiere.click();

    var încheiere = app.Încheieri.deschise[formular].tab;

    app.$(încheiere).one('iniţializat', function () {
      ok(true, 'iniţializat borderoul de calcul');

      var $încheiere = app.$(încheiere.document),
          $butonDeSalvare = $încheiere.find('.salvează');

      $butonDeSalvare.click();

      app.$(încheiere).one('salvat', function () {
        ok(true, 'salvat borderoul de calcul');
        equal(app.Procedura.colectează().cheltuieli.încheiere, încheiere.Încheiere.pagina,
            '…înregistrat în procedură');

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
        equal(tabel.find('tbody th:contains("Total")').length, 2,
            'în el avem 2 rînduri Total: pentru taxe şi pentru speze');

        var $rechiziteBancare = $încheiere.find('table#rechizite-bancare');

        ok($rechiziteBancare.find('th:contains("Beneficiar:")').există(), '…avem Beneficiar');
        equal($rechiziteBancare.find('th:contains("Beneficiar:")').next('td').text(),
            app.Profil.date['nume'], '…cu valoare a corespunzătoare');
        ok($rechiziteBancare.find('th:contains("Cod fiscal:")').există(), '…avem Cod fiscal');
        // TODO de verificat celelalte cîmpuri, inclusiv cînd nu sunt completate în profil
        ok($rechiziteBancare.find('th:contains("Nr. cod bancar:")').există(), '…avem Nr. cod bancar');
        ok($rechiziteBancare.find('th:contains("Banca beneficiară:")').există(), '…avem Banca beneficiară:');
        ok($rechiziteBancare.find('th:contains("Cod bancă:")').există(), '…avem Cod bancă:');

        ok($încheiere.find('#semnătura').există(), 'avem loc pentru semnătură');
        ok($încheiere.find('#ştampila').există(), 'avem loc pentru ştampila');

        app.Procedura.$.find('.închide').click();
        start();
      });
    });
  });
});

