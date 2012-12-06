asyncTest('Precedură: salvare', function () {
  'use strict';

  var app = this.app,
      dateProcedură = this.dateProcedură,
      context = this,
      numărulProceduriiNouCreate;

  app.Procedura.$.find('.bara-de-instrumente .salvează').click();
  app.Procedura.$.one('salvat salvat-deja', function (e, procedură, număr) {
    numărulProceduriiNouCreate = număr;

    app.$(app.Procedura.$).one('închidere', function (e, procedură, număr) {
      app.$(app.document).one('încărcat-proceduri-recente', function () {
        var proceduraCreată = '.item[data-href="#formular?' + numărulProceduriiNouCreate + '"]',
            $proceduraCreată = app.ProceduriRecente.$.find(proceduraCreată);

        ok($proceduraCreată.există(), 'procedura nou creată e în lista celor recente');
        ok($proceduraCreată.is(':first-child'), 'pe prima poziţie');

        $proceduraCreată.click();

        app.Procedura.$.one('populat', function () {
          var creditor = dateProcedură['creditor'],
              debitor = dateProcedură['debitori'][0],
              de = dateProcedură['document-executoriu'],
              sume = dateProcedură['obiectul-urmăririi']['sume'];

          equal(context.$dataIntentării.val(), dateProcedură['data-intentării'], 'salvat data intentării');
          equal(context.$creditor.find('#denumire').val(), creditor['denumire'], 'salvat denumire creditor');
          equal(context.$creditor.find('#idno').val(), creditor['idno'], 'salvat idno creditor');
          equal(context.$debitor.find('#nume').val(), debitor['nume'], 'salvat nume debitor');
          equal(context.$debitor.find('#idnp').val(), debitor['idnp'], 'salvat idnp debitor');
          equal(context.$debitor.find('#data-naşterii').val(), debitor['data-naşterii'],
              'salvat data naşterii debitor');
          equal(context.$de.find('#instanţa-de-judecată').val(), de['instanţa-de-judecată'],
              'salvat instanţa de judecată DE');
          equal(context.$de.find('#numărul-de').val(), de['numărul-de'], 'salvat numărul DE');
          equal(context.$de.find('#data-hotărîrii').val(), de['data-hotărîrii'], 'salvat data hotărîrii DE');
          equal(context.$de.find('#dispozitivul').val(), de['dispozitivul'], 'salvat dispozitivul DE');
          equal(context.$de.find('#data-rămînerii-definitive').val(), de['data-rămînerii-definitive'],
              'salvat data rămînerii definitive DE');
          equal(context.$obiectulUrmăririi.find('#suma-de-bază').val(), sume['Suma de bază'],
              'salvat valoare suma de bază');
          equal(context.$obiectulUrmăririi.find('#suma-de-bază').next('.valuta').val(), 'MDL',
              'salvat valuta suma de bază');

          var sumăPersonalizată = context.$obiectulUrmăririi.find('.personalizat .etichetă');

          equal(sumăPersonalizată.val(), 'Datorie adăugătoare',
              'salvat etichetă personalzată pentru datorie adăugătoare');
          equal(sumăPersonalizată.next('.sumă').val(), sume['Datorie adăugătoare'],
              'salvat valoare datorie adăugătoare');
          equal(sumăPersonalizată.next('.sumă').next('.valuta').val(), 'MDL', 'salvat valuta datorie adăugătoare');

          start();
        });
      });
    });
    app.Procedura.$.find('.închide').click();
  });
});

