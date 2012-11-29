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

    stop(1);

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

        app.$(app.Procedura.$).one('salvat', function (e, procedură, număr) {
          numărulProceduriiCreate = număr;

          app.$(app.Procedura.$).one('închidere', function (e, procedură, număr) {
            app.$(app.document).one('încărcat-proceduri-recente', verificăProceduraCreată);
          });
          app.Procedura.$.find('.închide').click();
        });
        app.Procedura.$.find('.bara-de-instrumente .salvează').click();
      });
    });

    function localizeazăCîmpuri() {
      $dataIntentării = app.Procedura.$.find('#data-intentării');
      $creditor = app.Procedura.$.find('#creditor');
      $debitor = app.Procedura.$.find('.debitor');
      $de = app.Procedura.$.find('#document-executoriu');
      $obiectulUrmăririi = app.Procedura.$obiectulUrmăririi;
    }

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
    }

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

        verificăÎncheiereaDeIntentare();
      });
    }

    function verificăÎncheiereaDeIntentare() {
      var buton = app.Procedura.$.find('#data-intentării').siblings('[data-formular]'),
          încheieri = app.ButoanePentruÎncheieri,
          formular = încheieri.formular(buton);

      buton.click();

      app.$(încheieri[formular].tab).one('load', function () {
        var încheiere = this;

        ok(true, 'deschis tab pentru încheiere');

        app.$(app.document).one('iniţializat-încheiere', function () {
          var $încheiere = app.$(încheiere.document),
              butonDeSalvare = $încheiere.find('.salvează');

          ok(true, 'iniţializat încheiere');
          ok(butonDeSalvare.există(), 'avem buton de salvare');
          ok($încheiere.find('.bara-de-instrumente.pentru.încheiere').există(), 'avem bară de instrumente');
          ok($încheiere.find('div.conţinut.editabil[contenteditable="true"]').există(), 'avem secţiuni editabile');

          app.$(app.document).one('salvat-încheiere', function () {
            ok(true, 'salvat încheiere');

            var cale = decodeURIComponent(încheiere.location.pathname),
                caleER = new RegExp(
                  '^/date/' + app.Utilizator.login + '/proceduri/' +
                  app.Procedura.număr() + '/încheieri/încheiere-de-intentare-\\d{12}\\.html'
                );

            ok(caleER.test(cale), 'adresa[' + cale + '] corespunde cu masca: ' + caleER.source);
            ok(buton.is('.salvat'), 'butonul din procedură e marcat ca salvat');
            equal(buton.data('pagina'), încheiere.Încheiere.pagina, 'setat data-pagina pe butonul din procedură');

            var secţiuneEditabilă = $încheiere.find('div.conţinut.editabil[contenteditable="true"]').first();

            secţiuneEditabilă.append('<b class="adăugat">schimbare</b>');

            app.$(app.document).one('salvat-încheiere', function () {
              app.$(app.document).one('iniţializat-încheiere', function () {
                ok(secţiuneEditabilă.find('b.adăugat:contains("schimbare")').există(), 'modificările sunt prezente');

                ştergeProceduraCreată();
              });
              încheiere.location.reload(true);
            });
            butonDeSalvare.click();
          });
          butonDeSalvare.click();
        });
      });
    }

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
  test('TODO: Profil', function () {
    ok(true);
  });


  // --------------------------------------------------
  /*asyncTest('TODO: Căutare', function () {
    app.Căutare.încarcăIndexFărăCache();

    app.$(app.document).one('actualizat-index', function () {
      var $secţiune = app.$('#căutare');

      $secţiune.find('input').val(app.Utilizator.login).trigger('input');

      var rezultate = $secţiune.find('#rezultate .item');

      ok(rezultate.există(), 'găsit rezultate');
      rezultate.first().trigger('mouseenter').click();

      app.$(app.Procedura.$).one('populat', function () {
        ok(true, 'click pe itemi din lista de rezultate deschide procedura');
        app.Procedura.$.find('.închide').click();
        start();
      });
    });
  });*/

}).attr('src', 'https://dev.executori.org/').show();
