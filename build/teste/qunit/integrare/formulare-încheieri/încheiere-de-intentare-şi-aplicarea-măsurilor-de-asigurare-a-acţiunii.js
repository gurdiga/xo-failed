/*jshint maxlen:164 */
/*global UtilitareÎncheiere:false */
asyncTest('Încheiere de intentare a procedurii de executare şi de asigurare a executării documentului executoriu', function () {
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      formular, $buton, $încheiere;

  app.$.fx.off = false;

  ok($formular.is(':not(:visible)'), 'formularul de procedură e închis');
  app.ProceduriRecente.$.find('.item:first-child').click();

  $formular.one('populat', function () {
    $buton = $formular.find('#data-intentării')
      .siblings('[data-formular="încheiere-de-intentare-şi-aplicarea-măsurilor-de-asigurare-a-acţiunii"]');
    formular = app.ButoanePentruÎncheieri.formular($buton);

    ok($buton.există(), 'avem butonaş de formare a încheierii');
    ok($buton.is(':not([dezactivat])'), 'butonul de formare a încheierii e activ');
    $buton.click();

    var încheiere = app.Încheieri.deschise[formular].tab;

    app.$(încheiere).one('load', function () {
      ok(true, 'deschis tab pentru încheiere');

      app.$(încheiere).one('iniţializat', function () {
        $încheiere = app.$(încheiere.document);

        ok(true, 'iniţializat încheiere');

        var $butonDeSalvare = $încheiere.find('.salvează'),
            $secţiuneaDispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut'),
            clauze = încheiere.Încheiere.date.clauze,
            descriereClauză;

        ok(!$secţiuneaDispoziţia.find('.clauze-referitoare-la-bănci').există(), 'nu sunt clauzele referitoare la bănci');
        ok($butonDeSalvare.există(), 'avem buton de salvare');
        ok($încheiere.find('.bara-de-instrumente.pentru.încheiere').există(), 'avem bară de instrumente');
        ok($încheiere.find('div.conţinut.editabil[contenteditable="true"]').există(), 'avem secţiuni editabile');
        ok($încheiere.find('.închide').există(), 'avem buton de închidere');
        ok($încheiere.find('body').is('[spellcheck=false]'), 'dezavtivat verificarea gramaticii pentru Firefox');

        UtilitareÎncheiere.verificăSubtitlu($încheiere,
          'de intentare a procedurii de executare şi de asigurare a executării documentului executoriu');
        UtilitareÎncheiere.verificăSecţiuni($încheiere,
          ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

        for (var clauză in clauze) {
          descriereClauză = clauze[clauză];
          ok(!$secţiuneaDispoziţia.find('.clauze-referitoare-la' + clauză).există(), 'iniţial nu se afişează clauzele referitoare la ' + descriereClauză);
        }

        app.$(încheiere).one('închis', function () {
          verificăPrezenţa(clauze);
        });

        $încheiere.find('.închide').click();
      });
    });
  });


  function verificăPrezenţa(clauze) {
    equal(Object.keys(app.Încheieri.deschise).length, 0, 'nu sunt încheieri deschise');

    var itemi = Object.keys(clauze),
        clauză = itemi.shift(),
        descriereClauză = clauze[clauză];

    $formular.find('#categorii-taxe-şi-speze #taxaB1').click();

    var $taxaB1 = app.Cheltuieli.$.find('.adăugate #taxaB1');

    ok($taxaB1.există(), 'adăugat taxaB1');
    $taxaB1.find('.document:first .adaugă-destinatar').trigger('mouseenter');
    app.Destinatari.$.find(clauză).click();
    ok($taxaB1.find('.document:first .destinatari-adăugaţi ' + clauză).există(), 'adăugat ' + descriereClauză);

    $buton.click();

    app.$(app.Încheieri.deschise[formular]).one('iniţializat', function (e, window) {
      var încheiere = window,
          date = încheiere.Încheiere.date,
          $încheiere = app.$(încheiere.document.body),
          $secţiuneaDispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut');

      ok(date.afişeazăClauza[clauză], 'context: setat flag de afişare pentru ' + descriereClauză);
      $încheiere = app.$(încheiere.document.body);

      ok($secţiuneaDispoziţia.find('.clauze-referitoare-la' + clauză).există(), 'găsit clauzele referitoare la ' + descriereClauză);

      setTimeout(function () { // pentru observabilitate
        app.$(încheiere).one('închis', function () {
          equal(Object.keys(app.Încheieri.deschise).length, 0, 'nu au rămas încheieri deschise înregistrate');
          app.Cheltuieli.$.find('.adăugate #taxaB1').remove();

          delete clauze[clauză];

          if ($.isEmptyObject(clauze)) {
            app.$.fx.off = false;
            start();
          } else {
            verificăPrezenţa(clauze);
          }
        });

        $încheiere.find('.închide').click();
      }, app.PAUZĂ_DE_OBSERVABILITATE);
    });
  }

});
