asyncTest('Somaţie cu privire la ieşirea la faţa locului', function() {
  /*global UtilitareÎncheiere:false */
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $buton, formular, dataŞiOraDeplasării;


  // ----------------------------------------
  function deschideŞiVerificăFormularulDeProcedură() {
    return $.Deferred(function(D) {
      ok($formular.is(':not(:visible)'), 'formularul de procedură e închis');

      app.ProceduriRecente.$.find('.item:first-child').click();
      $formular.one('populat', function() {
        ok(true, 'deschis formularul');

        $buton = app.Încheieri.$.find('a:contains("Somaţie cu privire la ieşirea la faţa locului")');
        formular = $buton.attr('href');

        app.Cheltuieli.categorii.$.find('#speza5').click();

        var speza5 = app.Cheltuieli.$adăugate.children('#speza5');

        dataŞiOraDeplasării = '10.10.2013 ora 11:00';
        ok(speza5.există(), 'adăugat speza 5');
        ok(speza5.find('[nume-cîmp="data-şi-ora-deplasării"]').val(dataŞiOraDeplasării).există(), '…completat data şi ora deplasării');

        ok($buton.există(), 'găsit butonaşul pentru încheiere');
        equal($buton.attr('formular'), '/formulare-încheieri/somaţie-cu-privire-la-ieşirea-la-faţa-locului.html',
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

        UtilitareÎncheiere.verificăSubtitlu($încheiere, 'cu privire la ieşirea la faţa locului');
        UtilitareÎncheiere.verificăSecţiuni($încheiere,
            ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

        var $dispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut');

        equal($dispoziţia.find('li').length, 4, 'în secţiunea “Dispoziţia” avem enumerate 4 puncte');

        ok($dispoziţia.find('p:contains("' + dataŞiOraDeplasării + '")').există(),
            '…sunt menţionate data şi ora deplasării');

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
