asyncTest('Încheiere de asigurare a executării documentului executoriu', function() {
  /*global UtilitareÎncheiere:false */
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $buton, formular;


  // ----------------------------------------
  function deschideŞiVerificăFormularulDeProcedură() {
    return $.Deferred(function(D) {
      ok($formular.is(':not(:visible)'), 'formularul de procedură e închis');

      app.ProceduriRecente.$.find('.item:first-child').click();
      $formular.one('populat', function() {
        ok(true, 'deschis formularul');

        $buton = app.Încheieri.$.find('a:contains("Încheiere de asigurare a executării documentului executoriu")');
        formular = $buton.attr('href');

        ok($buton.există(), 'găsit butonaşul pentru încheiere');
        equal($buton.attr('formular'), '/formulare-încheieri/încheiere-de-asigurare-a-executării-documentului-executoriu.html',
            'formularul corespunde');
        ok($buton.next('br').next().is('.scrisoare-de-însoţire'), 'găsit butonaţul pentru scrisoarea de însoţire');

        D.resolve();
      });
    }).promise();
  }

  // ----------------------------------------
  function deschideŞiVerificăÎncheierea() {
    return $.Deferred(function(D) {
      $buton.click();

      app.$(app.Încheieri.deschise[formular]).one('iniţializat', function() {
        ok(true, 'deschis tab pentru încheiere');

        var $încheiere = app.$(this.tab.document);

        UtilitareÎncheiere.verificăSubtitlu($încheiere, 'de asigurare a executării documentului executoriu');
        UtilitareÎncheiere.verificăSecţiuni($încheiere,
            ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

        var $dispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut');

        equal($dispoziţia.find('li').length, 10, 'în secţiunea “Dispoziţia” avem enumerate 10 puncte');

        setTimeout(function() {
          D.resolve();
          $încheiere.find('.închide').click();
        }, app.PAUZĂ_DE_OBSERVABILITATE);
      });
    }).promise();
  }

  // ----------------------------------------
  function închideTot() {
    return $.Deferred(function(D) {
      $formular.one('închis', function() {
        ok(true, 'inchis formularul de procedură');
        app.$.fx.off = false;

        D.resolve();
        start();
      });
      $formular.find('.închide').click();
    }).promise();
  }

  // ----------------------------------------
  deschideŞiVerificăFormularulDeProcedură()
  .then(deschideŞiVerificăÎncheierea)
  .done(închideTot);

});
