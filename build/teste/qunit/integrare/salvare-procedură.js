asyncTest('Precedură: salvare', function () {
  'use strict';

  var app = this.app,
      dateProcedură = this.dateProcedură,
      context = this,
      $cheltuieli = app.Cheltuieli.$,
      $taxaA1 = $cheltuieli.find('.adăugate #taxaA1'),
      dataAchităriiTaxeiA1 = app.moment().format(app.FORMATUL_DATEI),
      $formular = app.FormularProcedură.$,
      numărulProceduriiNouCreate;

  $taxaA1.find('.achitare :checkbox').prop('checked', true);
  $taxaA1.find('.achitare .dată').val(dataAchităriiTaxeiA1);

  $formular.find('.bara-de-instrumente .salvează').click();
  $formular.one('salvat', function (e, procedură, număr) {
    numărulProceduriiNouCreate = număr;

    $formular.find('.închide').click();
    app.$($formular).one('închidere', function () {
      app.$(app.document).one('încărcat-proceduri-recente', function () {
        var proceduraCreată = '.item[data-href="#formular?' + numărulProceduriiNouCreate + '"]',
            $proceduraCreată = app.ProceduriRecente.$.find(proceduraCreată);

        ok($proceduraCreată.există(), 'procedura nou creată e în lista celor recente');
        ok($proceduraCreată.is(':first-child'), 'pe prima poziţie');

        $proceduraCreată.click();
        $formular.one('populat', function () {
          var creditor = dateProcedură['creditor'],
              debitor = dateProcedură['debitori'][0],
              de = dateProcedură['document-executoriu'],
              sume = dateProcedură['obiectul-urmăririi']['sume'];

          equal(context.$dataIntentării.val(), dateProcedură['data-intentării'], 'salvat data intentării');
          equal(context.$creditor.find('#denumire').val(), creditor['denumire'], 'salvat denumire creditor');
          equal(context.$creditor.find('#idno').val(), creditor['idno'], 'salvat idno creditor');
          equal(context.$debitor.find('#nume').val(), debitor['nume'], 'salvat nume debitor');
          equal(context.$debitor.find('#idnp').val(), debitor['idnp'], 'salvat idnp debitor');
          equal(context.$debitor.find('#data-naşterii').val(), debitor['data-naşterii'], 'salvat data naşterii debitor');
          equal(context.$de.find('#instanţa-de-judecată').val(), de['instanţa-de-judecată'], 'salvat instanţa de judecată DE');
          equal(context.$de.find('#numărul-de').val(), de['numărul-de'], 'salvat numărul DE');
          equal(context.$de.find('#data-hotărîrii').val(), de['data-hotărîrii'], 'salvat data hotărîrii DE');
          equal(context.$de.find('#dispozitivul').val(), de['dispozitivul'], 'salvat dispozitivul DE');
          equal(context.$de.find('#data-rămînerii-definitive').val(), de['data-rămînerii-definitive'], 'salvat data rămînerii definitive DE');
          equal(context.$obiectulUrmăririi.find('#suma-de-bază').val(), sume['Suma de bază'], 'salvat valoare suma de bază');
          equal(context.$obiectulUrmăririi.find('#suma-de-bază').next('.valuta').val(), 'MDL', 'salvat valuta suma de bază');
          ok($formular.find('#data-ultimei-modificări span').text().trim() !== '', 'se afişează data ultimei modificări');

          var sumăPersonalizată = context.$obiectulUrmăririi.find('.personalizat.sumă .etichetă');

          ok(sumăPersonalizată.există(), 'adăugat cîmp pentru datorie adăugătoare');
          equal(sumăPersonalizată.val(), 'Datorie adăugătoare', 'salvat etichetă personalzată pentru datorie adăugătoare');
          equal(sumăPersonalizată.next('.sumă').val(), sume['Datorie adăugătoare'], 'salvat valoare datorie adăugătoare');
          equal(sumăPersonalizată.next('.sumă').next('.valuta').val(), 'MDL', 'salvat valuta datorie adăugătoare');

          verificăSecţiuneaCheltuieli();

          setTimeout(function () {
            start();
          }, app.PAUZĂ_DE_OBSERVABILITATE);
        });
      });
    });
  });

  function verificăSecţiuneaCheltuieli() {
    equal($cheltuieli.find('#total-taxe-şi-speze').val(), app.UC * (1 + 3), 'avem totalul pe taxe şi speze');
    ok($taxaA1.există(), 'avem taxa de intentare şi formare a procedurii de executare');
    ok($taxaA1.find('.achitare :checkbox').is(':checked'), '…e bifată achitată');
    equal($taxaA1.find('.achitare .dată').val(), dataAchităriiTaxeiA1, '…avem data achitării');
  }
});
