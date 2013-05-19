asyncTest('Formular procedură: lista de încheieri', function () {
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $încheieri = app.Încheieri.$;

  app.$.fx.off = true;
  ok($formular.is(':not(:visible)'), 'formularul e închis');

  app.ProceduriRecente.$.find('.item:first-child').click();
  $formular.one('populat', function () {
    ok(true, 'deschis formularul');

    ok($încheieri.există(), 'găsit secţiunea încheieri');
    ok($încheieri.find('ul.încheieri').există, 'găsit lista de încheieri');

    var încheieri = {
      'încheiere-de-intentare.html': ':visible',
      'încheiere-de-intentare-şi-aplicarea-măsurilor-de-asigurare-a-acţiunii.html': ':visible',
      'borderou-de-calcul.html': ':visible:not(.salvat)',
      'încheiere-de-continuare.html': ':visible'
    }, formular, $încheiere, nume, stare;

    for (formular in încheieri) {
      stare = încheieri[formular];
      nume = formular.substring(0, formular.length - 5);
      $încheiere = $încheieri.find('a[formular="/formulare-încheieri/' + formular + '"]');

      ok($încheiere.există(), 'găsit ' + nume);
      ok($încheiere.is(stare), '…e ' + stare);
    }

    // TODO de verificat visibilitatea înfuncţie de #caracter/#obiect/#măsură-de-asigurare.

    închideFormularul();
  });

  // ------------------------------------------------
  function închideFormularul() {
    $formular.one('închis', function () {
      ok(true, 'închis formularul');

      app.$.fx.off = false;
      start();
    });

    $formular.find('.închide').click();
  }
});
