asyncTest('Încheiere de intentare a procedurii de executare şi de asigurare a executării documentului executoriu', function () {
  // *global UtilitareÎncheiere:false */
  'use strict';

  var app = this.app,
      $buton = app.FormularProcedură.$.find('#data-intentării')
        .siblings('[data-formular="încheiere-de-intentare-şi-aplicarea-măsurilor-de-asigurare-a-acţiunii"]'),
      formular = app.ButoanePentruÎncheieri.formular($buton);

  ok(app.FormularProcedură.$.is(':visible'), 'formularul de procedură e deschis');
  ok($buton.există(), 'avem butonaş de formare a încheierii');
  ok($buton.is(':not([dezactivat])'), 'butonul de formare a încheierii e activ');
  $buton.click();

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
      ok($încheiere.find('body').is('[spellcheck=false]'), 'dezavtivat verificarea gramaticii pentru Firefox');

      UtilitareÎncheiere.verificăSubtitlu($încheiere, 'de intentare a procedurii de executare şi de asigurare a executării documentului executoriu');
      UtilitareÎncheiere.verificăSecţiuni($încheiere,
          ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

      start();
    });
  });

});
