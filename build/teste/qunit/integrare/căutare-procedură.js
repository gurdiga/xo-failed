asyncTest('Procedură: căutare', function () {
  'use strict';

  var app = this.app;

  ok(app.FormularProcedură.$.is(':not(:visible)'), 'formularul de procedură este închis');

  var $secţiune = app.$('#căutare'),
      număr = app.ProceduriRecente.numărulUltimei();

  ok($secţiune.există(), 'avem secţiune de căutare');
  $secţiune.find('input').val(număr).trigger('input');

  setTimeout(function () { // aşteptăm o leacă după afişarea rezultatelor să fie testul urmăribil
    var rezultate = $secţiune.find('#rezultate .item');

    ok(rezultate.există(), 'găsit procedura');
    rezultate.first().click();

    app.$(app.FormularProcedură.$).one('populat', function () {
      ok(true, 'click pe itemi din lista de rezultate ale căutării deschide procedura');
      app.FormularProcedură.$.find('.închide').click();
      $secţiune.find('input').val('').trigger('input');

      ştergeProceduraCreată();
    });
  }, app.Căutare.pauză + app.PAUZĂ_DE_OBSERVABILITATE);

  // ------------------------
  function ştergeProceduraCreată() {
    // aşteptăm o leacă să se termine alte eventuale request-uri
    // pentru a evita 500 la PUT
    setTimeout(function () {
      $.ajax({
        url: '/date/' + app.Utilizator.login + '/proceduri/' + app.ProceduriRecente.numărulUltimei() + '/',
        type: 'DELETE',
        success: function () {
          ok(true, 'şters procedura de test');

          app.ProceduriRecente.încarcăFărăCache();
          app.FormularProcedură.$.find('.închide').click();

          start();
        }
      });
    }, 1000);
  }
});
