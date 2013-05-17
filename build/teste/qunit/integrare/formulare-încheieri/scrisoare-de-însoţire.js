asyncTest('Scrisoarea de însoţire', function () {
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $buton, formular, $scrisori;

  app.$.fx.off = true;

  // ----------------------------------------
  function deschideŞiVerificăFormularulDeProcedură() {
    return $.Deferred(function (D) {
      ok($formular.is(':not(:visible)'), 'formularul de procedură e închis');
      app.ProceduriRecente.$.find('.item:first-child').click();

      $formular.one('populat', function () {
        ok(true, 'deschis formularul');

        $buton = app.Încheieri.$.find('a[href="/formulare-încheieri/scrisoare-de-însoţire.html"]').first();
        formular = $buton.attr('href');
        ok($buton.există(), 'avem butonaş pentru scrisoarea de însoţire');
        ok($buton.is('[dinamică]'), '…marcat dinamic');
        ok(formular, '…cu href');

        var $butonaşe = $formular.find('#încheieri ul>li>a[formular] + br + a.scrisoare-de-însoţire');

        ok($butonaşe.există(), 'fiecare butonaş e precedat de cel pentru încheierea propriuzisă şi <br/>-ul');
        equal($butonaşe.filter('[destinatari]').length, $butonaşe.length,
            'tote butonaşele au destinatari desemnaţi');

        var destinatariValizi = ['alţi-destinatari', 'creditor', 'debitori', 'persoane-terţe'],
            destinatariGăsiţi = {};

        $butonaşe.each(function () {
          var destinatari = this.getAttribute('destinatari').split(' '),
              destinatar;

          for (var i = 0, l = destinatari.length; i < l; i++) {
            destinatar = destinatari[i];

            if (!destinatariGăsiţi[destinatar]) destinatariGăsiţi[destinatar] = true;
          }
        });

        destinatariGăsiţi = Object.keys(destinatariGăsiţi).sort();
        deepEqual(destinatariGăsiţi, destinatariValizi, 'destinatarii includ doar ' + destinatariValizi);

        D.resolve();
      });
    }).promise();
  }

  // ----------------------------------------
  function verificăCazulCîndEsteDoarCreditorulŞiUnDebitor() {
    return $.Deferred(function (D) {
      $formular.find('.secţiune.debitor').not(':first').remove();
      $formular.find('.secţiune.persoană-terţă').remove();
      app.Cheltuieli.$adăugate.find('#taxaB1').remove();

      $buton.click();

      app.$(app.Încheieri.deschise[formular]).one('iniţializat', function () {
        ok(true, 'deschis scrisoare doar petru debitor şi creditor');
        $scrisori = app.$(this.tab.document);

        var context = this.tab.Încheiere.context();

        ok(context.pentru.creditor, 'context: e pentru.creditor');
        ok(context.pentru.debitori, '…e pentru.debitor');
        equal(typeof context.debitori, typeof [], '…avem array debitori');
        equal(context.debitori.length, 1, '……unul singur');
        deepEqual(context.persoaneTerţe, [], '…persoaneTerţe == []');
        deepEqual(context.alţiDestinatari, [], '…alţiDestinatari == []');

        var $exemplare = $scrisori.find('.scrisoare-de-însoţire'),
            procedură = app.FormularProcedură.colectează();

        equal($exemplare.length, 2, 'avem 2 scrisori: de însoţire doar pentru creditor şi debitor');

        ok($exemplare.first().is('.pentru-creditor'), 'prima este pentru creditor');
        ok($exemplare.first().find('p:contains("Creditor:")').există(), '…conţine “Creditor:”');
        ok($exemplare.first().find('.data-adoptării').există(), '…are data');
        ok($exemplare.first().find('p:contains("' + procedură.creditor.denumire + '")').există(), '…conţine denumirea creditorului');
        ok($exemplare.first().find('p:contains("' + procedură.creditor.idno + '")').există(), '…conţine IDNO-ul creditorului');
        ok($exemplare.first().find('p:contains("' + procedură.creditor.sediu + '")').există(), '…conţine sediul creditorului');

        ok($exemplare.eq(1).is('.pentru-debitori'), 'a doua este pentru debitor');
        ok($exemplare.eq(1).find('p:contains("Debitor:")').există(), '…conţine “Debitor:”');
        ok($exemplare.eq(1).find('.data-adoptării').există(), '…are data');
        ok($exemplare.eq(1).find('p:contains("' + procedură.debitori[0].nume + '")').există(), '…conţine numele debitorului');
        ok($exemplare.eq(1).find('p:contains("' + procedură.debitori[0].idnp + '")').există(), '…conţine IDNP-ul debitorului');

        setTimeout(function () {
          $scrisori.find('.închide').click();
          D.resolve();
        }, app.PAUZĂ_DE_OBSERVABILITATE);
      });
    }).promise();
  }

  // ----------------------------------------
  function verificăCazulCîndEsteDoarCreditorŞiMaiMulţiDebitori() {
    return $.Deferred(function (D) {
      $formular.find('.secţiune.debitor').not(':first').remove();
      $formular.find('.secţiune.persoană-terţă').remove();
      app.Cheltuieli.$adăugate.find('#taxaB1').remove();

      $formular.find('.secţiune.debitor + button.adaugă').click();
      $formular.find('.secţiune.debitor:last')
        .find('#gen-persoană').val('fizică').trigger('change').end()
        .find('#nume').val('al doilea debitor').end()
        .find('#idnp').val('IDNP').end();

      $buton.click();

      app.$(app.Încheieri.deschise[formular]).one('iniţializat', function () {
        ok(true, 'deschis scrisoare doar petru creditor şi mai mulţi debitori');
        $scrisori = app.$(this.tab.document);

        var context = this.tab.Încheiere.context();

        ok(context.pentru.creditor, 'context: e pentru.creditor');
        ok(context.pentru.debitori, '…e pentru.debitor');
        equal(typeof context.debitori, typeof [], '…avem array debitori');
        equal(context.debitori.length, 2, '……2');
        deepEqual(context.persoaneTerţe, [], '…persoaneTerţe == []');
        deepEqual(context.alţiDestinatari, [], '…alţiDestinatari == []');

        var $exemplare = $scrisori.find('.scrisoare-de-însoţire');

        equal($exemplare.length, 3, 'avem 3 scrisori: de însoţire doar pentru creditor şi cîte una pentru debitori');

        ok($exemplare.first().is('.pentru-creditor'), 'prima este pentru creditor');
        ok($exemplare.eq(1).is('.pentru-debitori'), 'a doua este pentru debitor');
        ok($exemplare.eq(2).is('.pentru-debitori'), 'a treia este pentru debitor');

        setTimeout(function () {
          $scrisori.find('.închide').click();
          D.resolve();
        }, app.PAUZĂ_DE_OBSERVABILITATE);
      });
    }).promise();
  }

  // ----------------------------------------
  function verificăCazulCuPersoaneTerţe() {
    return $.Deferred(function (D) {
      $formular.find('.secţiune.debitor').not(':first').remove();
      $formular.find('.secţiune.persoană-terţă').remove();
      app.Cheltuieli.$adăugate.find('#taxaB1').remove();

      $formular.find('button.adaugă.persoană.terţă').click();
      $formular.find('.secţiune.persoană-terţă')
        .find('#gen-persoană').val('fizică').trigger('change').end()
        .find('#nume').val('nume persoană terţă').end()
        .find('#idnp').val('IDNP persoană terţă').end();

      $buton.click();

      app.$(app.Încheieri.deschise[formular]).one('iniţializat', function () {
        ok(true, 'deschis scrisoare pentru cazul cînd avem creditor, debitor, şi persoană terţă');
        $scrisori = app.$(this.tab.document);

        var context = this.tab.Încheiere.context();

        ok(context.pentru.creditor, 'context: e pentru.creditor');
        ok(context.pentru.debitori, '…e pentru.debitor');
        equal(typeof context.debitori, typeof [], '…avem array debitori');
        equal(context.debitori.length, 1, '……1');
        equal(typeof context.persoaneTerţe, typeof [], '…avem array persoaneTerţe');
        equal(context.persoaneTerţe.length, 1, '…avem o persoană terţă');
        deepEqual(context.alţiDestinatari, [], '…alţiDestinatari == []');

        var $exemplare = $scrisori.find('.scrisoare-de-însoţire');

        equal($exemplare.length, 3, 'avem 3 exemplare: cîte una pentru creditor, debitor, şi persoana terţă');

        ok($exemplare.first().is('.pentru-creditor'), 'prima este pentru creditor');
        ok($exemplare.eq(1).is('.pentru-debitori'), 'a doua este pentru debitor');
        ok($exemplare.eq(2).is('.pentru-persoane-terţe'), 'a treia este pentru persoana terţă');
        ok($exemplare.eq(2).find('p:contains("Persoană terţă:")').există(), '…conţine “Persoană terţă:”');
        ok($exemplare.eq(2).find('p:contains("nume persoană terţă")').există(), '…conţine numele persoanei terţe');
        ok($exemplare.eq(2).find('p:contains("IDNP persoană terţă")').există(), '…conţine IDNP-ul persoanei terţe');

        setTimeout(function () {
          $scrisori.find('.închide').click();
          D.resolve();
        }, app.PAUZĂ_DE_OBSERVABILITATE);
      });
    }).promise();
  }

  // ----------------------------------------
  function verificăCazulCuDocumenteAdresateAltorInstituţii() {
    return $.Deferred(function (D) {
      $formular.find('.secţiune.debitor').not(':first').remove();
      $formular.find('.secţiune.persoană-terţă').remove();
      app.Cheltuieli.$adăugate.find('#taxaB1').remove();

      app.Cheltuieli.categorii.$.find('#taxaB1').click();

      var $taxaB1 = app.Cheltuieli.$adăugate.find('#taxaB1');

      $taxaB1.find('.adaugă-destinatar').trigger('mouseenter')
        .find('.listă:first .adaugă-toate').click().end()
        // Dacă părţile procedurii (creditorul şi debitorul) se adaugă ca
        // destinatari ai documentului, atunci ei nu vor fi incluşi în
        // context.alţiDestinatari pentru că pentru ei deja se va fi format
        // scrisoare de însoţire.
        .find('.listă .titlu:contains("Părţile procedurii") .adaugă-toate').click();

      var pentruInstituţii = $taxaB1.find('.destinatari-adăugaţi').children().length - 2; // după cum am zis, părţile nu vor fi incluse

      ok($taxaB1.există(), 'adăugat taxa B1');
      ok(pentruInstituţii > 0, '…cu un document cu destinatari');

      $buton = app.Încheieri.$.find('a[formular*="încheiere-privind-aplicarea-măsurilor-de-asigurare"]+br+a.scrisoare-de-însoţire');
      formular = $buton.attr('href');
      $buton.click();

      app.$(app.Încheieri.deschise[formular]).one('iniţializat', function () {
        ok(true, 'deschis scrisoare pentru cazul cînd avem creditor, debitor, şi documente adresate unor instituţii');
        $scrisori = app.$(this.tab.document);

        var context = this.tab.Încheiere.context();

        equal(Object.keys(context.pentru).join(' '), 'creditor debitori persoane-terţe alţi-destinatari',
            'scrisoarea are destinatarii corespunzători');
        ok(context.pentru.creditor, 'context: e pentru.creditor');
        ok(context.pentru.debitori, '…e pentru.debitor');
        equal(typeof context.debitori, typeof [], '…avem array debitori');
        equal(context.debitori.length, 1, '……1');
        deepEqual(context.persoaneTerţe, [], '…avem array persoaneTerţe == []');
        equal(typeof context.alţiDestinatari, typeof [], '…avem array alţiDestinatari');
        equal(context.alţiDestinatari.length, pentruInstituţii, '……cu ' + pentruInstituţii + ' itemi');

        var $exemplare = $scrisori.find('.scrisoare-de-însoţire'),
            totalExemplare = pentruInstituţii + 2;

        equal($exemplare.length, totalExemplare, 'avem ' + totalExemplare + ' exemplare: cîte una pentru creditor şi debitor, şi ' +
            pentruInstituţii + ' pentru instituţii');

        ok($exemplare.first().is('.pentru-creditor'), 'prima este pentru creditor');
        ok($exemplare.eq(1).is('.pentru-debitori'), 'a doua este pentru debitor');

        setTimeout(function () {
          $scrisori.find('.închide').click();
          D.resolve();
        }, app.PAUZĂ_DE_OBSERVABILITATE);
      });
    }).promise();
  }

  // ----------------------------------------
  function închideTot() {
    return $.Deferred(function (D) {
      $scrisori.find('.închide').click();

      $formular.one('închidere', function () {
        ok(true, 'inchis formularul de procedură');
        app.$.fx.off = false;

        start();
        D.resolve();
      });
      $formular.find('.închide').click();
    }).promise();
  }

  // ----------------------------------------
  deschideŞiVerificăFormularulDeProcedură()
  .then(verificăCazulCîndEsteDoarCreditorulŞiUnDebitor)
  .then(verificăCazulCîndEsteDoarCreditorŞiMaiMulţiDebitori)
  .then(verificăCazulCuPersoaneTerţe)
  .then(verificăCazulCuDocumenteAdresateAltorInstituţii)
  .done(închideTot);
});
