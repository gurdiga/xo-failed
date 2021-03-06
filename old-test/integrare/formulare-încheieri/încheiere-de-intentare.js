asyncTest('Încheiere de intentare', function() {
  /*global UtilitareÎncheiere:false */
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $buton = $formular.find('#încheieri a[href="/formulare-încheieri/încheiere-de-intentare.html"]'),
      încheiere;

  app.$.fx.off = true;

  ok($formular.is(':not(:visible)'), 'formularul de procedură e închis');

  app.ProceduriRecente.$.find('.item:first-child').click();
  $formular.one('populat', function() {
    ok(true, 'deschis formularul');
    ok($buton.există(), 'găsit butonul de formare a încheierii');
    $buton.click();

    var formular = $buton.attr('href'),
        meta = app.Încheieri.deschise[formular];

    app.$(meta).one('iniţializat', function() {
      ok(true, 'deschis tab pentru încheiere');

      încheiere = meta.tab;

      var $încheiere = app.$(încheiere.document),
          $butonDeSalvare = $încheiere.find('.salvează');

      ok(true, 'iniţializat încheiere');
      ok($butonDeSalvare.există(), 'avem buton de salvare');
      ok($încheiere.find('.bara-de-instrumente.pentru.încheiere').există(), 'avem bară de instrumente');
      ok($încheiere.find('div.conţinut.editabil[contenteditable="true"]').există(), 'avem secţiuni editabile');
      ok($încheiere.find('.închide').există(), 'avem buton de închidere');
      ok($încheiere.find('body').is('[spellcheck=false]'), 'dezavtivat verificarea gramaticii pentru Firefox');

      UtilitareÎncheiere.verificăSubtitlu($încheiere, 'cu privire la intentarea procedurii de executare');
      UtilitareÎncheiere.verificăSecţiuni($încheiere,
          ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

      verificăSalvareaÎncheierii(încheiere);
    });

    // ------------------------
    function verificăSalvareaÎncheierii(încheiere) {
      var $încheiere = încheiere.Încheiere.$,
          $butonDeSalvare = $încheiere.find('.salvează');

      $butonDeSalvare.click();

      app.$(încheiere).one('salvat', function() {
        încheiere = this;
        ok(true, 'salvat încheiere');

        var cale = decodeURIComponent(încheiere.location.pathname),
            caleER = new RegExp(
              '^/date/' + app.Utilizator.login + '/proceduri/' +
              app.FormularProcedură.număr() + '/încheieri/' +
              '\\d{13}\\.html'
            );

        ok(caleER.test(cale), 'adresa[' + cale + '] corespunde cu masca: ' + caleER.source);
        ok($buton.is('.salvat'), 'marcat butonul din procedură ca salvat');
        equal($buton.attr('href'), încheiere.Încheiere.pagina, 'setat href pe butonul din formularul de procedură');

        $butonDeSalvare.click();

        $formular.one('salvat', function() {
          ok(true, 'salvat şi procedura la salvarea încheierii');

          var $butonDeRegenerare = $încheiere.find('.regenerează'),
              încheiereaSalvată = încheiere.Încheiere.pagina,
              formular = încheiere.Încheiere.buton.attr('formular');

          $butonDeRegenerare.click();
          ok(!app.Încheieri.deschise[încheiereaSalvată], 'încheierea precedent salvată este deregistrată');
          ok(app.Încheieri.deschise[formular], 'încheierea nou generată nesalvată este înregistrată');

          app.$(app.Încheieri.deschise[formular]).one('iniţializat', function() {
            ok(true, 'regenerare: reiniţializat');

            $butonDeSalvare = încheiere.Încheiere.$.find('.salvează');
            $butonDeSalvare.click();

            app.$(încheiere).one('salvat', function() {
              ok(true, 'regenerare: resalvat');

              $formular.one('salvat', function() {
                ok(true, 'regenerare: salvat procedura *după* salvarea încheierii');

                verificăEditabilitate();
              });
            });
          });
        });
      });
    }

    // ------------------------
    function verificăEditabilitate() {
      var $buton = $formular.find('#încheieri a[formular="/formulare-încheieri/încheiere-de-intentare.html"]'),
          $încheiere = încheiere.Încheiere.$,
          cale = decodeURIComponent(încheiere.location.pathname),
          $secţiuneEditabilă = $încheiere.find('div.conţinut.editabil[contenteditable="true"]').first();

      $secţiuneEditabilă.append('<b class="adăugat">schimbare</b>');
      $încheiere.find('.salvează').click();

      app.$(încheiere).one('salvat', function() {
        ok(true, 'salvat după editarea unei secţiuni editabile');

        $încheiere.find('.închide').click();

        setTimeout(function() { // pauză pentru observabilitate
          cale = $buton.attr('href');
          $buton.click();

          app.$(app.Încheieri.deschise[cale]).one('iniţializat', function() {
            încheiere = app.Încheieri.deschise[cale].tab;

            var $încheiere = încheiere.Încheiere.$,
                $secţiuneEditabilă = $încheiere.find('div.conţinut.editabil[contenteditable="true"]').first();

            ok($secţiuneEditabilă.find('b.adăugat:contains("schimbare")').există(), 'modificările s-au salvat');

            verificăImprimarea(cale);
          });
        }, app.PAUZA_DE_OBSERVABILITATE);
      });
    }

    // --------------------------------------------------
    function verificăImprimarea(cale) {
      var $încheiere = încheiere.Încheiere.$,
          $butonDeImprimare = $încheiere.find('.imprimă');

      încheiere.print = function() { };

      app.$(încheiere).one('imprimat', function() {
        ok(true, 'click pe butonul de imprimare imprimă imediat dacă încheierea nu e modificată');

        $încheiere.find('.editabil').first().append('<b>modificare pentru testarea salvării la imprimare</b>');

        app.$(încheiere).one('salvat', function() { // înainte de imprimare încheierea se salvează
          ok(true, 'dacă încheierea e modificată click pe butonul de imprimare mai întîi salvează');

          app.$(încheiere).one('imprimat', function() {
            ok(true, '…şi pe urmă imprimă');

            $încheiere.find('.închide').click();
            equal(app.Încheieri.deschise[cale], undefined, 'fereastra încheierii s-a închis');

            $formular.one('închis', function() {
              app.$.fx.off = false;
              start();
            });
            $formular.find('.închide').click();
          });
        });
        $butonDeImprimare.click();

      });
      $butonDeImprimare.click();
    }
  });
});
