asyncTest('Încheiere de dare în căutare a mijlocului de transport', function() {
  /*global UtilitareÎncheiere:false */
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $buton, formular;

  app.$.fx.off = true;

  // ----------------------------------------
  function deschideŞiVerificăFormularulDeProcedură() {
    return $.Deferred(function(D) {
      ok($formular.is(':not(:visible)'), 'formularul de procedură e închis');

      $formular.one('populat', function() {
        ok(true, 'deschis formularul');

        $buton = app.Încheieri.$.find('a:contains("Încheiere de dare în căutare a mijlocului de transport")');
        formular = $buton.attr('href');

        ok($buton.există(), 'găsit butonaşul pentru încheiere');
        equal($buton.attr('formular'), '/formulare-încheieri/încheiere-de-dare-în-căutare-a-mijlocului-de-transport.html',
            'formularul corespunde');
        ok($buton.next('br').next().is('.scrisoare-de-însoţire'), 'găsit butonaşul pentru scrisoarea de însoţire');

        D.resolve();
      });
      app.ProceduriRecente.$.find('.item:first-child').click();
    }).promise();
  }

  // ----------------------------------------
  function deschideŞiVerificăÎncheierea() {
    return $.Deferred(function(D) {
      $buton.click();

      app.$(app.Încheieri.deschise[formular]).one('iniţializat', function() {
        ok(true, 'deschis tab pentru încheiere');

        var $încheiere = app.$(this.tab.document),
            context = this.tab.Încheiere.date;

        equal(context.mijloculDeTranspport, 'datele din subsecţiunea de sechestrare',
            'avem mijloculDeTranspport corespunzător în context');

        UtilitareÎncheiere.verificăSubtitlu($încheiere, 'de dare în căutare a mijlocului de transport');
        UtilitareÎncheiere.verificăSecţiuni($încheiere,
            ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

        var $dispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut');

        equal($dispoziţia.find('li').length, 3, 'în secţiunea “Dispoziţia” avem enumerate 10 puncte');
        ok($dispoziţia.find('p:contains("' + context.mijloculDeTranspport + '")').există(),
          'în secţiunea “Dispoziţia” se menţionează mijlocul de transport');

        var $motivele = $încheiere.find('section header:contains("Motivele")+.conţinut');

        ok($motivele.find('p:contains("' + context.mijloculDeTranspport + '")').există(),
          'în secţiunea “Dispoziţia” se menţionează mijlocul de transport');

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
