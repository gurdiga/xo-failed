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
    formular = app.Încheieri.formular($buton);

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

        $încheiere.find('.închide').click();
        start();
      });
    });
  });

});
