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
  test('Creare precedură', function () {
    stop(3);

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

    var $dataIntentării, $creditor, creditor, $debitor, debitor, $de, de,
        $obiectulUrmăririi, sume, numărulProceduriiCreate;

    var file = app.$('#crează-procedură li[data-href]'),
        filăProcedurăDeOrdinGeneral = file.filter('.g');

    ok(file.is(':visible'), 'avem file pentru proceduri noi');
    filăProcedurăDeOrdinGeneral.click();

    app.Procedura.$.one('iniţializat', function () {
      localizeazăCîmpuri();
      verificăValoriImplicite();
      completeazăFormular();

      app.$(app.document).one('calculat-onorariul', function () {
        equal(
          $obiectulUrmăririi.find('#total').suma(),
          sume['Suma de bază'] + sume['Datorie adăugătoare'],
          'totalul e suma sumelor'
        );

        var onorariuImplicit = dateProcedură['cheltuieli']['onorariu'];

        equal(app.Procedura.$.find('#onorariu').val(), onorariuImplicit,
          'cheltuieli: pentru procedura de ordin general onorariul implicit este ' + onorariuImplicit);

        app.Procedura.$.one('salvat', function (e, procedură, număr) {
          numărulProceduriiCreate = număr;

          app.$(app.Procedura.$).one('închidere', function (e, procedură, număr) {
            app.$(app.document).one('încărcat-proceduri-recente', verificăProceduraCreată);
          });
          app.Procedura.$.find('.închide').click();
        });
        app.Procedura.$.find('.bara-de-instrumente .salvează').click();
      });
    });

    // ------------------------
    function localizeazăCîmpuri() {
      $dataIntentării = app.Procedura.$.find('#data-intentării');
      $creditor = app.Procedura.$.find('#creditor');
      $debitor = app.Procedura.$.find('.debitor');
      $de = app.Procedura.$.find('#document-executoriu');
      $obiectulUrmăririi = app.Procedura.$obiectulUrmăririi;
    }

    // ------------------------
    function verificăValoriImplicite() {
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

      var butoaneÎncheiere = app.Procedura.$.find('.buton[data-formular]'),
          butoaneÎncheiereDezactivate = butoaneÎncheiere.filter('[dezactivat]');

      equal(butoaneÎncheiere.length, butoaneÎncheiereDezactivate.length,
          'butoanele pentru încheieri sunt dezactivate');
    }

    // ------------------------
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

    // ------------------------
    function verificăProceduraCreată() {
      var proceduraCreată = '.item[data-href="#formular?' + numărulProceduriiCreate + '"]',
          $proceduraCreată = app.ProceduriRecente.$.find(proceduraCreată);

      ok($proceduraCreată.există(), 'procedura nou creată e în lista celor recente');
      ok($proceduraCreată.is(':first-child'), 'pe prima poziţie');

      $proceduraCreată.click();

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
        equal(sumăPersonalizată.next('.sumă').val(), sume['Datorie adăugătoare'], 'salvat valoare datorie adăugătoare');
        equal(sumăPersonalizată.next('.sumă').next('.valuta').val(), 'MDL', 'salvat valuta datorie adăugătoare');

        verificăBorderouDeCalcul();
        verificăÎncheiereDeIntentare();
      });
    }

    // ------------------------
    function verificăBorderouDeCalcul() {
      var cîmpTotalTaxeŞiSpeze = app.Cheltuieli.$.find('#total-taxe-şi-speze'),
          butonÎncheiere = cîmpTotalTaxeŞiSpeze.siblings('.buton[data-formular="borderou-de-calcul"]'),
          formular = app.ButoanePentruÎncheieri.formular(butonÎncheiere);

      ok(butonÎncheiere.există(), 'avem buton pentru borderoul de calcul');

      butonÎncheiere.click();

      var încheiere = app.Încheieri.deschise[formular].tab;

      app.$(încheiere).one('load', function () {
        ok(true, 'avem formular borderoul de calcul');

        app.$(încheiere).one('iniţializat', function () {
          ok(true, 'iniţializat borderoul de calcul');

          var $încheiere = app.$(încheiere.document),
              butonDeSalvare = $încheiere.find('.salvează');

          app.$(încheiere).one('salvat', function () {
            ok(true, 'salvat borderoul de calcul');

            // TODO: verifică că la salvare + colectare încheierea nouă se
            // salvează în date
            //console.log(app.Procedura.colectează());
            //console.log(încheiere.location.pathname);
            start();
          });
          butonDeSalvare.click();
        });
      });
    }

    // ------------------------
    function verificăÎncheiereDeIntentare() {
      var buton = app.Procedura.$.find('#data-intentării').siblings('[data-formular]'),
          formular = app.ButoanePentruÎncheieri.formular(buton);

      ok(buton.is(':not([dezactivat])'), 'butonul de formare a încheierii e activ');
      buton.click();

      var încheiere = app.Încheieri.deschise[formular].tab;

      app.$(încheiere).one('load', function () {
        ok(true, 'deschis tab pentru încheiere');

        app.$(încheiere).one('iniţializat', function () {
          var $încheiere = app.$(încheiere.document),
              butonDeSalvare = $încheiere.find('.salvează');

          ok(true, 'iniţializat încheiere');
          ok(butonDeSalvare.există(), 'avem buton de salvare');
          ok($încheiere.find('.bara-de-instrumente.pentru.încheiere').există(), 'avem bară de instrumente');
          ok($încheiere.find('div.conţinut.editabil[contenteditable="true"]').există(), 'avem secţiuni editabile');
          ok($încheiere.find('.închide').există(), 'avem buton de închidere');

          verificăSalvareaÎncheierii(încheiere);
        });
      });
    }

    // ------------------------
    function verificăSalvareaÎncheierii(încheiere) {
      var buton = app.Procedura.$.find('#data-intentării').siblings('[data-formular]'),
          $încheiere = app.$(încheiere.document),
          butonDeSalvare = $încheiere.find('.salvează'),
          formular = app.ButoanePentruÎncheieri.formular(buton);

      app.$(încheiere).one('salvat', function () {
        ok(true, 'salvat încheiere');

        var cale = decodeURIComponent(încheiere.location.pathname),
            caleER = new RegExp(
              '^/date/' + app.Utilizator.login + '/proceduri/' +
              app.Procedura.număr() + '/încheieri/' + buton.data('formular') + '-\\d{12}\\.html'
            );

        ok(caleER.test(cale), 'adresa[' + cale + '] corespunde cu masca: ' + caleER.source);
        ok(buton.is('.salvat'), 'marcat butonul din procedură ca salvat');
        equal(buton.data('pagina'), încheiere.Încheiere.pagina, 'setat data-pagina pe butonul din procedură');

        app.Procedura.$.one('salvat', function () {
          ok(true, 'salvat şi procedura la salvarea încheierii');
          start();
        });

        verificăEditabilitate(încheiere);
        butonDeSalvare.click();
      });
      butonDeSalvare.click();
    }

    // ------------------------
    function verificăEditabilitate(încheiere) {
      var $încheiere = app.$(încheiere.document),
          cale = decodeURIComponent(încheiere.location.pathname),
          butonDeSalvare = $încheiere.find('.salvează'),
          secţiuneEditabilă = $încheiere.find('div.conţinut.editabil[contenteditable="true"]').first();

      secţiuneEditabilă.append('<b class="adăugat">schimbare</b>');

      app.$(încheiere).one('salvat', function () {
        încheiere.close();
        app.Încheieri.deschise[cale].buton.click();
        încheiere = app.Încheieri.deschise[cale].tab;

        app.$(încheiere).one('iniţializat', function () {
          ok(secţiuneEditabilă.find('b.adăugat:contains("schimbare")').există(), 'modificările sunt prezente');

          $încheiere.find('.închide').click();

          // închiderea ferestrei poate dura un pic
          setTimeout(function () {
            equal(app.Încheieri.deschise[cale], undefined, 'tabul încheierii s-a închis');
            app.Procedura.$.find('.închide').click();

            verificăCăutarea();
          }, 100);
        });
      });
    }

    // ------------------------
    function verificăCăutarea() {
      var $secţiune = app.$('#căutare');

      ok($secţiune.există(), 'avem secţiune de căutare');
      $secţiune.find('input').val(numărulProceduriiCreate).trigger('input');

      var rezultate = $secţiune.find('#rezultate .item');

      ok(rezultate.există(), 'găsit procedura');
      rezultate.first().click();

      app.$(app.Procedura.$).one('populat', function () {
        ok(true, 'click pe itemi din lista de rezultate ale căutării deschide procedura');
        app.Procedura.$.find('.închide').click();
        $secţiune.find('input').val('').trigger('input');

        ştergeProceduraCreată();
      });
    }

    // ------------------------
    function ştergeProceduraCreată() {
      $.ajax({
        url: '/date/' + app.Utilizator.login + '/proceduri/' + app.ProceduriRecente.numărulUltimei() + '/',
        type: 'DELETE',
        success: function () {
          ok(true, 'şters procedura de test');

          app.ProceduriRecente.încarcăFărăCache();
          app.Procedura.$.find('.închide').click();
          start();
        }
      });
    }

  });


  // --------------------------------------------------
  asyncTest('Profil', function () {
    var buton = app.$('#bara-de-sus button.profil');

    ok(buton.există(), 'avem buton pentru profil');
    ok(buton.is(':visible'), 'butonul este visibil');

    buton.click();

    // fade-in durează un pic
    setTimeout(function () {
      var dialog = buton.prev('.dialog');

      ok(dialog.există(), 'avem dialog');
      ok(dialog.is(':visible'), 'afişat dialogul');
      ok(dialog.find('legend label:contains("Profil")').există(), 'dialogul are titlu');

      ok(dialog.find('#nume-executor').există(), 'dialogul are cîmp pentru nume');
      equal(dialog.find('#nume-executor').val(), app.Profil.date.nume, '…completat corespunzător');
      ok(dialog.find('#adresa-executor').există(), 'dialogul are cîmp pentru adresă');
      equal(dialog.find('#adresa-executor').val(), app.Profil.date.adresa, '…completat corespunzător');
      ok(dialog.find('#număr-licenţă').există(), 'dialogul are cîmp pentru numărul licenţei');
      equal(dialog.find('#număr-licenţă').val(), app.Utilizator.login, '…completat corespunzător');
      ok(dialog.find('#număr-licenţă').is('[readonly]'), 'cîmpul pentru numărul licenţei nu este editabil');
      ok(dialog.find('#codul-fiscal').există(), 'dialogul are cîmp pentru codul fiscal');
      equal(dialog.find('#codul-fiscal').val(), app.Profil.date['codul-fiscal'], '…completat corespunzător');
      ok(dialog.find('#instanţa-teritorială').există(), 'dialogul are cîmp pentru instanţa teritorială');
      equal(dialog.find('#instanţa-teritorială').val(), app.Profil.date['instanţa-teritorială'],
          '…completat corespunzător');
      ok(dialog.find('#email').există(), 'dialogul are cîmp pentru email');
      equal(dialog.find('#email').val(), app.Profil.date.email, '…completat corespunzător');

      var subsecţiuneContCauţiune = dialog.find('.subsecţiune .titlu:contains("cont pentru cauţiuni, taxe şi speze")');

      ok(subsecţiuneContCauţiune.există(), 'are subsecţiune cont pentru cauţiuni, taxe şi speze');
      ok(subsecţiuneContCauţiune.find('#cont-taxe-speze'), '...cu cîmp pentru numărul contului');
      ok(subsecţiuneContCauţiune.find('#banca-taxe-speze'), '...cu cîmp pentru numărul băncii');

      var subsecţiuneContPentruOnorarii = dialog.find('.subsecţiune .titlu:contains("cont pentru onorarii")');

      ok(subsecţiuneContPentruOnorarii.există(), 'are subsecţiune cont pentru cauţiuni, taxe şi speze');
      ok(subsecţiuneContPentruOnorarii.find('#cont-onorarii'), '...cu cîmp pentru numărul contului');
      ok(subsecţiuneContPentruOnorarii.find('#banca-onorarii'), '...cu cîmp pentru numărul băncii');

      var butonDeSalvare = dialog.find('legend button.salvează.semiascuns'),
          butonDeÎnchidere = dialog.find('button.închide');

      ok(butonDeSalvare.există(), 'dialogul are buton de salvare');
      ok(butonDeÎnchidere.există(), 'dialogul are buton de închidere');

      app.Profil.$.one('salvat', function () {
        ok(true, 'salvat');

        setTimeout(function () {
          ok(dialog.is(':not(:visible)'), 'dialogul se închide după salvare');

          start();
        }, 200);
        butonDeÎnchidere.click();
      });
      butonDeSalvare.click();
    }, 200);
  });

}).attr('src', 'https://dev.executori.org/').show();
