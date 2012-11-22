$('#app').one('load', function () {
  'use strict';


  module('Integrare');


  QUnit.config.testTimeout = 10000;

  var app = window.frames['app'];

  // --------------------------------------------------
  test('încărcat', function () {
    ok(app.$('#conţinut').există(), '#conţinut');
    equal(location.protocol, 'https:', 'HTTPS');
  });


  // --------------------------------------------------
  asyncTest('Creare precedură', function () {
    /*global Evenimente*/

    var dateProcedură = {
      'data-intentării': app.moment().format(app.FORMATUL_DATEI),
      'creditor': {
        'denumire': 'CREDITOR SRL',
        'idno': (new Date()).getTime(),
        'sediu': 'Moldova ON-LINE\nbd. Internetului 33\net. 55, of. 1'
      },
      'debitori': [{
        'nume': 'Debitor CUTĂRESCU',
        'idnp': (new Date()).getTime(),
        'data-naşterii': '10.10.1970'
      }],
      'document-executoriu': {
        'instanţa-de-judecată': app.Profil.date['instanţa-teritorială'],
        'numărul-de': '1234B/53',
        'data-hotărîrii': '06.06.2006',
        'dispozitivul': 'Cras a pharetra enim. In non lectus nulla,' +
          ' ut vehicula enim. Phasellus fermentum orci quis urna luctus tempus.' +
          ' Nullam tempor nulla id lectus volutpat sit amet ultricies nisi ultricies.',
        'data-rămînerii-definitive': '06.07.2006'
      },
      'obiectul-urmăririi': {
        'sume': {
          'Suma de bază': 1000,
          'Datorie adăugătoare': 600
        }
      },
      'cheltuieli': {
        'onorariu': 500 // implicit
      }
    };


    // TODO: de separat popularea şi verificarea în unităţi separate
    var file = app.$('#crează-procedură li[data-href]');

    ok(file.is(':visible'), 'avem file pentru proceduri noi');

    var filăProcedurăDeOrdinGeneral = file.filter('.g');

    filăProcedurăDeOrdinGeneral.click();

    function găseşteCîmpuri() {
      $dataIntentării = app.Procedura.$.find('#data-intentării');
      $creditor = app.Procedura.$.find('#creditor');
      $debitor = app.Procedura.$.find('.debitor');
      $de = app.Procedura.$.find('#document-executoriu');
      $obiectulUrmăririi = app.Procedura.$obiectulUrmăririi;
    }

    function verificăSetăriImplicite() {
      ok(app.Procedura.$.is(':visible'), 's-a afişat formularul');
      equal($creditor.find('#gen-persoană').val(), 'juridică',
        'pentru procedura de orgin general creditorul e implicit persoană juridică');
      equal($debitor.find('#gen-persoană').val(), 'fizică',
        'pentru procedura de orgin general debitorul e implicit persoană fizică');
      equal($obiectulUrmăririi.find('#caracter').val(), 'pecuniar',
         'pentru procedura de ordin general caracterul implicit este pcuniar');
      equal(app.Procedura.$.find('#total-taxe-şi-speze').suma(), app.UC,
        'cheltuieli: total implicit taxe şi speze == taxa de intentare');
      ok(app.Procedura.$.find('#cheltuieli .adăugate #taxaA1').există(),
        'cheltuieli: taxa de intentare este adăugată implicit');
    }

    var $dataIntentării, $creditor, creditor, $debitor, debitor, $de, de,
        $obiectulUrmăririi, sume;

    function completeazăFormular() {
      $dataIntentării.val(dateProcedură['data-intentării']);

      creditor = dateProcedură['creditor'];
      $creditor.find('#denumire').val(creditor['denumire']);
      $creditor.find('#idno').val(creditor['idno']);
      $creditor.find('#sediu').val(creditor['sediu']);

      debitor = dateProcedură['debitori'][0];
      $debitor.find('#nume').val(debitor['nume']);
      $debitor.find('#idnp').val(debitor['idnp']);
      $debitor.find('#data-naşterii').val(debitor['data-naşterii']);

      de = dateProcedură['document-executoriu'];
      $de.find('#instanţa-de-judecată').val(de['instanţa-de-judecată']);
      $de.find('#numărul-de').val(de['numărul-de']);
      $de.find('#data-hotărîrii').val(de['data-hotărîrii']);
      $de.find('#dispozitivul').val(de['dispozitivul']).trigger('input');
      $de.find('#data-rămînerii-definitive').val(de['data-rămînerii-definitive']);

      sume = dateProcedură['obiectul-urmăririi']['sume'];
      $obiectulUrmăririi.find('#suma-de-bază').val(sume['Suma de bază']);
      $obiectulUrmăririi.find('.adaugă-cîmp-personalizat').click();
      $obiectulUrmăririi.find('.personalizat:last')
        .find('.etichetă').val('Datorie adăugătoare').end()
        .find('.sumă').val(sume['Datorie adăugătoare']);
    }

    app.Procedura.$.one('finalizat-animaţie', function () {
      găseşteCîmpuri();
      verificăSetăriImplicite();
      completeazăFormular();

      Evenimente.aşteaptă('calculat-onorariul');
      app.$(app.document).one('calculat-onorariul', function () {
        equal(
          $obiectulUrmăririi.find('#total').suma(),
          sume['Suma de bază'] + sume['Datorie adăugătoare'],
          'totalul e suma sumelor'
        );

        var onorariuImplicit = dateProcedură['cheltuieli']['onorariu'];

        equal(app.Procedura.$.find('#onorariu').val(), onorariuImplicit,
          'cheltuieli: pentru procedura de ordin general onorariul implicit este ' + onorariuImplicit);

        Evenimente.anunţă('calculat-onorariul');
      });

      Evenimente.aşteaptă('încărcat-proceduri-recente');
      app.$(app.document).one('încărcat-proceduri-recente', verificăProceduraNouCreată);

      app.Procedura.$.find('.bara-de-instrumente .salvează').click();
      app.Procedura.$.find('.închide').click();
    });

    function verificăProceduraNouCreată() {
      var id = dateProcedură['creditor']['idno'],
          proceduraNouCreată = '#proceduri-recente .item .persoane .id:contains("' + id + '"):first',
          $proceduraNouCreată = app.$(proceduraNouCreată);

      ok($proceduraNouCreată.există(), 'procedura nou creată e adăugată prima în lista celor recente');

      Evenimente.aşteaptă('populat');
      Evenimente.anunţă('încărcat-proceduri-recente');

      $proceduraNouCreată.click();

      app.Procedura.$.one('populat', function () {
        app.Procedura.$.find('#data-intentării').siblings('[data-formular]').click();

        equal($dataIntentării.val(), dateProcedură['data-intentării'], 'salvat data intentării');
        equal($creditor.find('#denumire').val(), creditor['denumire'], 'salvat denumire creditor');
        equal($creditor.find('#idno').val(), creditor['idno'], 'salvat idno creditor');
        equal($debitor.find('#nume').val(), debitor['nume'], 'salvat nume debitor');
        equal($debitor.find('#idnp').val(), debitor['idnp'], 'salvat idnp debitor');
        equal($debitor.find('#data-naşterii').val(), debitor['data-naşterii'], 'salvat data naşterii debitor');
        equal($de.find('#instanţa-de-judecată').val(), de['instanţa-de-judecată'], 'salvat instanţa de judecată DE');
        equal($de.find('#numărul-de').val(), de['numărul-de'], 'salvat numărul DE');
        equal($de.find('#data-hotărîrii').val(), de['data-hotărîrii'], 'salvat data hotărîrii DE');
        equal($de.find('#dispozitivul').val(), de['dispozitivul'], 'salvat dispozitivul DE');
        equal($de.find('#data-rămînerii-definitive').val(), de['data-rămînerii-definitive'],
            'salvat data rămînerii definitive DE');
        equal($obiectulUrmăririi.find('#suma-de-bază').val(), sume['Suma de bază'], 'salvat valoare suma de bază');
        equal($obiectulUrmăririi.find('#suma-de-bază').next('.valuta').val(), 'MDL', 'salvat valuta suma de bază');

        var sumăPersonalizată = $obiectulUrmăririi.find('.personalizat .etichetă');

        equal(sumăPersonalizată.val(), 'Datorie adăugătoare',
          'salvat etichetă personalzată pentru datorie adăugătoare');
        equal(sumăPersonalizată.next('.sumă').val(), sume['Datorie adăugătoare'], 'salvat valoare datorie adăugătoare');
        equal(sumăPersonalizată.next('.sumă').next('.valuta').val(), 'MDL', 'salvat valuta datorie adăugătoare');

        Evenimente.aşteaptă('şters-procedura-nou-creată');
        Evenimente.anunţă('populat');

        $.ajax({
          url: '/date/' + app.Utilizator.login + '/proceduri/' + app.ProceduriRecente.numărulUltimei() + '/',
          type: 'DELETE',
          success: function () {
            ok(true, 'şters procedura de test');

            Evenimente.anunţă('şters-procedura-nou-creată');
            app.ProceduriRecente.încarcăFărăCache();
            app.Procedura.$.find('.închide').click();
          }
        });

      });
    }
  });


  // --------------------------------------------------
  test('TODO: Profil', function () {
    ok(true);
  });


  // --------------------------------------------------
  /*asyncTest('TODO: Căutare', function () {
    Evenimente.aşteaptă('actualizat-index');
    app.Căutare.încarcăIndexFărăCache();

    app.$(app.document).one('actualizat-index', function () {
      var $secţiune = app.$('#căutare');

      $secţiune.find('input').val(app.Utilizator.login).trigger('input');

      var rezultate = $secţiune.find('#rezultate .item');

      ok(rezultate.există(), 'găsit rezultate');
      rezultate.first().trigger('mouseenter').click();

      Evenimente.aşteaptă('populat');
      Evenimente.anunţă('actualizat-index');

      app.$(app.Procedura.$).one('populat', function () {
        ok(true, 'click pe itemi din lista de rezultate deschide procedura');
        app.Procedura.$.find('.închide').click();

        Evenimente.anunţă('populat');
      });
    });
  });*/

}).attr('src', 'https://dev.executori.org/').show();
