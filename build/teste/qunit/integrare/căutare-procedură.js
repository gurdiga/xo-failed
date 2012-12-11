asyncTest('Procedură: căutare', function () {
  'use strict';

  var app = this.app,
      $secţiune = app.$('#căutare'),
      numărComplet = app.Utilizator.login + app.ProceduriRecente.numărulUltimei();

  ok($secţiune.există(), 'avem secţiune de căutare');
  $secţiune.find('input').val(numărComplet).trigger('input');
  setTimeout(function () {
    var rezultate = $secţiune.find('#rezultate .item');

    ok(rezultate.există(), 'găsit procedura');
    rezultate.first().click();

    app.$(app.Procedura.$).one('populat', function () {
      ok(true, 'click pe itemi din lista de rezultate ale căutării deschide procedura');
      app.Procedura.$.find('.închide').click();
      $secţiune.find('input').val('').trigger('input');

      ştergeProceduraCreată();
    });
  }, app.Căutare.pauză + 10);

  // ------------------------
  function ştergeProceduraCreată() {
    // aşteptăm oleacă să se termine alte eventuale request-uri
    // pentru a evita 500 la PUT
    setTimeout(function () {
      $.ajax({
        url: '/date/' + app.Utilizator.login + '/proceduri/' + app.ProceduriRecente.numărulUltimei() + '/',
        type: 'DELETE',
        success: function () {
          ok(true, 'şters procedura de test');

          app.ProceduriRecente.încarcăFărăCache();
          app.Procedura.$.find('.închide').click();

          start();
        }
      });
    }, 1000);
  }
});
