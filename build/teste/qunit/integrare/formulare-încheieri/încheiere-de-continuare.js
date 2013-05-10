asyncTest('Încheiere de continuare', function () {
  /*global UtilitareÎncheiere:false */
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $buton = $formular.find('#încheieri a[href="/formulare-încheieri/încheiere-de-continuare.html"]');

  ok($formular.is(':not(:visible)'), 'formularul de procedură e închis');
  ok($buton.next('br').next().is('.scrisoare-de-însoţire'), 'avem linkuleţ pentru scrisoarea de însoţire');

  app.ProceduriRecente.$.find('.item:first-child').click();
  $formular.one('populat', function () {
    ok(true, 'deschis formularul');
    ok($buton.există(), 'găsit butonul de formare a încheierii');
    $buton.click();

    var formular = $buton.attr('href'),
        meta = app.Încheieri.deschise[formular],
        încheiere;

    app.$(meta).one('iniţializat', function () {
      ok(true, 'deschis tab pentru încheiere');

      încheiere = meta.tab;

      var $încheiere = app.$(încheiere.document);

      ok(true, 'iniţializat încheiere');

      UtilitareÎncheiere.verificăSubtitlu($încheiere, 'cu privire la continuarea procedurii de executare');
      UtilitareÎncheiere.verificăSecţiuni($încheiere,
          ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

      var $motivele = $încheiere.find('section header:contains("Motivele")+.conţinut'),
          $dispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut'),
          frazaCheie = 'În termenul acordat potrivit legii, DEBITORUL nu a executat benevol documentul executoriu sus menţionat.';

      ok($motivele.find('p:contains("' + frazaCheie + '")').există(), 'avem fraza cheie încsecţiunea “Motivele”');
      equal($dispoziţia.find('li').length, 3, 'în secţiunea “Dispoziţia” avem enumerate 3 puncte');

      $încheiere.find('.închide').click();

      $formular.one('închidere', function () {
        start();
      });
      $formular.find('.închide').click();
    });
  });
});
