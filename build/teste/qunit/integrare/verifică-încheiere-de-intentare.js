asyncTest('Procedură: verifică încheiere de intentare', function () {
  'use strict';

  var app = this.app,
      buton = app.Procedura.$.find('#data-intentării').siblings('[data-formular]'),
      formular = app.ButoanePentruÎncheieri.formular(buton);

  ok(buton.is(':not([dezactivat])'), 'butonul de formare a încheierii e activ');
  buton.click();

  var încheiere = app.Încheieri.deschise[formular].tab;

  app.$(încheiere).one('load', function () {
    ok(true, 'deschis tab pentru încheiere');

    app.$(încheiere).one('iniţializat', function () {
      var $încheiere = app.$(încheiere.document),
          $butonDeSalvare = $încheiere.find('.salvează');

      ok(true, 'iniţializat încheiere');
      ok($butonDeSalvare.există(), 'avem buton de salvare');
      ok($încheiere.find('.bara-de-instrumente.pentru.încheiere').există(), 'avem bară de instrumente');
      ok($încheiere.find('div.conţinut.editabil[contenteditable="true"]').există(), 'avem secţiuni editabile');
      ok($încheiere.find('.închide').există(), 'avem buton de închidere');

      verificăSalvareaÎncheierii(încheiere);
    });
  });

  // ------------------------
  function verificăSalvareaÎncheierii(încheiere) {
    var $buton = app.Procedura.$.find('#data-intentării').siblings('[data-formular]'),
        $încheiere = app.$(încheiere.document),
        $butonDeSalvare = $încheiere.find('.salvează'),
        formular = app.ButoanePentruÎncheieri.formular($buton);

    app.$(încheiere).one('salvat', function () {
      ok(true, 'salvat încheiere');

      var cale = decodeURIComponent(încheiere.location.pathname),
          caleER = new RegExp(
            '^/date/' + app.Utilizator.login + '/proceduri/' +
            app.Procedura.număr() + '/încheieri/' + $buton.data('formular') + '-\\d{12}\\.html'
          );

      ok(caleER.test(cale), 'adresa[' + cale + '] corespunde cu masca: ' + caleER.source);
      ok($buton.is('.salvat'), 'marcat butonul din procedură ca salvat');
      equal($buton.data('pagina'), încheiere.Încheiere.pagina, 'setat data-pagina pe butonul din procedură');

      app.Procedura.$.one('salvat salvat-deja', function () {
        ok(true, 'salvat şi procedura la salvarea încheierii');

        start();
      });

      verificăEditabilitate(încheiere);
      $butonDeSalvare.click();
    });
    $butonDeSalvare.click();
  }

  // ------------------------
  function verificăEditabilitate(încheiere) {
    var $încheiere = app.$(încheiere.document),
        cale = decodeURIComponent(încheiere.location.pathname),
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
        }, 100);
      });
    });
  }
});
