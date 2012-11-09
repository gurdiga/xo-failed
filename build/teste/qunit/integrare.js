$('#app').on('load', function () {
  'use strict';


  module('Integrare');


  QUnit.config.testTimeout = 10000;

  var app = window.frames['app'];

  // --------------------------------------------------
  test('încărcat', function () {
    ok(app.$('#conţinut').există(), '#conţinut');
    equal(location.protocol, 'https:', 'trecut la HTTPS');
  });


  // --------------------------------------------------
  test('TODO: Interfaţa', function () {
    ok(app.$('#crează-procedură a').is(':visible'), 'avem file pentru proceduri noi');
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


    app.location.hash = app.$('#crează-procedură li.g a').attr('href');

    var $dataIntentării, $creditor, creditor, $debitor, debitor, $de, de,
        $obiectulUrmăririi, sume;

    app.Procedura.$.one('finalizat-animaţie', function () {
      /*jshint maxstatements:100*/
      ok(app.Procedura.$.is(':visible'), 's-a afişat formularul');

      var $calendar;

      $dataIntentării = app.Procedura.$.find('#data-intentării'),
      $dataIntentării.focus().next('.ui-icon-calendar').click();
      $calendar = app.$('#ui-datepicker-div');
      ok($calendar.is(':visible'), 'data intentării: se afişează calendarul');

      $calendar.find('.ui-datepicker-today a').click();
      equal($dataIntentării.val(), dateProcedură['data-intentării'],
        'la click pe data de azi în calendar, se completează cîmpul data intentării');

      $creditor = app.Procedura.$.find('#creditor');
      creditor = dateProcedură['creditor'];

      equal($creditor.find('#gen-persoană').val(), 'juridică',
        'pentru procedura de orgin general creditorul e implicit persoană juridică');

      $creditor.find('#denumire').val(creditor['denumire']);
      $creditor.find('#idno').val(creditor['idno']);
      $creditor.find('#sediu').val(creditor['sediu']);

      $debitor = app.Procedura.$.find('.debitor');
      debitor = dateProcedură['debitori'][0];

      equal($debitor.find('#gen-persoană').val(), 'fizică',
        'pentru procedura de orgin general debitorul e implicit persoană fizică');

      $debitor.find('#nume').val(debitor['nume']);
      $debitor.find('#idnp').val(debitor['idnp']);
      $debitor.find('#data-naşterii').val(debitor['data-naşterii']);

      $de = app.Procedura.$.find('#document-executoriu');
      de = dateProcedură['document-executoriu'];

      $de.find('#instanţa-de-judecată').val(de['instanţa-de-judecată']);
      $de.find('#numărul-de').val(de['numărul-de']);
      $de.find('#data-hotărîrii').val(de['data-hotărîrii']);
      $de.find('#dispozitivul').val(de['dispozitivul']).trigger('input');
      $de.find('#data-rămînerii-definitive').val(de['data-rămînerii-definitive']);

      $obiectulUrmăririi = app.Procedura.$obiectulUrmăririi;
      sume = dateProcedură['obiectul-urmăririi']['sume'];

      equal($obiectulUrmăririi.find('#caracter').val(), 'pecuniar',
         'pentru procedura de ordin general caracterul implicit este pcuniar');

      $obiectulUrmăririi.find('#suma-de-bază').val(sume['Suma de bază']);
      $obiectulUrmăririi.find('.adaugă-cîmp-personalizat').click();
      $obiectulUrmăririi.find('.personalizat:last')
        .find('.etichetă').val('Datorie adăugătoare').end()
        .find('.sumă').val(sume['Datorie adăugătoare']);

      Evenimente.aşteaptă('calculat-onorariul');
      app.$(app.document).one('calculat-onorariul', function () {
        equal(
          $obiectulUrmăririi.find('#total').suma(),
          sume['Suma de bază'] + sume['Datorie adăugătoare'],
          'totalul e suma sumelor'
        );

        Evenimente.venit('calculat-onorariul');
      });

      var onorariuImplicit = dateProcedură['cheltuieli']['onorariu'];

      equal(app.Procedura.$.find('#onorariu').val(), onorariuImplicit,
        'cheltuieli: pentru procedura de ordin general onorariul implicit este ' + onorariuImplicit);
      equal(app.Procedura.$.find('#total-taxe-şi-speze').suma(), app.UC,
        'cheltuieli: total implicit taxe şi speze == taxa de intentare');
      ok(app.Procedura.$.find('#cheltuieli .adăugate #taxaA1').există(),
        'cheltuieli: taxa de intentare este adăugată implicit');

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
      Evenimente.venit('încărcat-proceduri-recente');
      $proceduraNouCreată.click();

      app.Procedura.$.one('populat', function () {
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
        equal(sumăPersonalizată.next('.sumă').val(), sume['Datorie adăugătoare'],
            'salvat valoare datorie adăugătoare');
        equal(sumăPersonalizată.next('.sumă').next('.valuta').val(), 'MDL',
            'salvat valuta datorie adăugătoare');

        Evenimente.aşteaptă('şters-procedura-nou-creată');
        Evenimente.venit('populat');

        $.ajax({
          url: '/date/' + app.Utilizator.login + '/proceduri/' + app.ProceduriRecente.numărulUltimei() + '.json',
          type: 'DELETE',
          success: function () {
            ok(true, 'şters procedura de test');

            Evenimente.venit('şters-procedura-nou-creată');
            app.ProceduriRecente.încarcăFărăCache();
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
  asyncTest('TODO: Căutare', function () {
    Evenimente.aşteaptă('actualizat-index');
    app.Căutare.încarcăIndexFărăCache();

    app.$(app.document).one('actualizat-index', function () {
      var $secţiune = app.$('#căutare');

      $secţiune.find('input').val(app.Utilizator.login).trigger('input');

      var rezultate = $secţiune.find('#rezultate .item');

      ok(rezultate.există(), 'găsit rezultate');
      rezultate.first().trigger('mouseenter').click();

      Evenimente.aşteaptă('populat');
      Evenimente.venit('actualizat-index');

      app.$(app.Procedura.$).one('populat', function () {
        ok(true, 'click pe itemi din lista de rezultate deschide procedura');
        app.Procedura.$.find('.închide').click();

        Evenimente.venit('populat');
      });
    });
  });

}).attr('src', 'https://dev.executori.org/').show();
