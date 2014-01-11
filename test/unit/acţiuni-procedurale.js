(function() {
  'use strict';

  var app = window.frames['app'];

  module('Unit: AcţiuniProcedurale', {
    setup: function() {
      sinon.qunit.setup(this);
    },

    teardown: function() {
      sinon.qunit.teardown(this);
    }
  });

  test('.init() animaţie', function() {
    this.stub(app.AcţiuniProcedurale.efecte, 'init');

    app.AcţiuniProcedurale.init();
    ok(app.AcţiuniProcedurale.efecte.init.called, 'iniţializat');
  });


  test('.init(): înregistrează fragmente parţiale', function() {
    this.stub(app.AcţiuniProcedurale, 'înregistreazăFragmenteParţiale');

    app.AcţiuniProcedurale.init();
    ok(app.AcţiuniProcedurale.înregistreazăFragmenteParţiale.called, 'înregistrat fragmente parţiale');
  });


  test('.init(): propune corespunzător acţiunile următoare', function() {
    this.stub(app.AcţiuniProcedurale, 'propuneAcţiunileUrmătoare');

    app.AcţiuniProcedurale.init();
    ok(app.AcţiuniProcedurale.propuneAcţiunileUrmătoare.called, 'propus opţiunea corespunzătoare');
  });


  test('.init(): adăugare opţiune', function() {
    var original = {
      $opţiuni: app.AcţiuniProcedurale.$opţiuni
    };

    this.stub(app.AcţiuniProcedurale, 'adaugă');
    app.AcţiuniProcedurale.$opţiuni.html('<a class="propunere">text</a>');

    app.AcţiuniProcedurale.init();
    app.AcţiuniProcedurale.$opţiuni.find('.propunere').trigger('click');
    ok(app.AcţiuniProcedurale.adaugă.called, 'la click pe una din opţiuni, ea se adaugă în listă');

    app.AcţiuniProcedurale.$opţiuni = original.$opţiuni;
  });


  test('.init(): eliminare-item', function() {
    this.stub(app.AcţiuniProcedurale, 'propuneAcţiunileUrmătoare');

    app.AcţiuniProcedurale.init();
    app.AcţiuniProcedurale.$.parent().trigger('eliminat-item');
    ok(app.AcţiuniProcedurale.propuneAcţiunileUrmătoare.called, 'la eliminarea unei acţiuni se reafişează opţiunile');
  });


  test('.efecte', function() {
    ok('efecte' in app.AcţiuniProcedurale, 'defini');
    ok($.isPlainObject(app.AcţiuniProcedurale.efecte), '…obiect');
  });


  test('.efecte.init', function() {
    ok('init' in app.AcţiuniProcedurale.efecte, 'defini');
    ok($.isFunction(app.AcţiuniProcedurale.efecte.init), '…funcţie');

    var original = {
      $: app.AcţiuniProcedurale.$
    };

    app.AcţiuniProcedurale.$ = $('<div/>');
    this.stub(app.AcţiuniProcedurale.efecte, 'afişează');
    this.stub(app.AcţiuniProcedurale.efecte, 'ascunde');

    app.AcţiuniProcedurale.efecte.init();

    app.AcţiuniProcedurale.$.trigger('înainte-de.adăugare-acţiune');
    ok(app.AcţiuniProcedurale.efecte.ascunde.called, 'ascunde înainte de adăugare');

    app.AcţiuniProcedurale.$.trigger('după.adăugare-acţiune');
    ok(app.AcţiuniProcedurale.efecte.afişează.called, 'afişat după adăugare');

    app.AcţiuniProcedurale.$ = original.$;
  });


  test('.efecte.ascunde', function() {
    ok('ascunde' in app.AcţiuniProcedurale.efecte, 'defini');
    ok($.isFunction(app.AcţiuniProcedurale.efecte.ascunde), '…funcţie');
    equal(app.AcţiuniProcedurale.efecte.ascunde.length, 2, '…acceptă doi parametri');

    var $el = $('<div/>').appendTo('#qunit-fixture');

    app.AcţiuniProcedurale.efecte.ascunde(null, $el);
    ok($el.is(':not(:visible)'), 'ascunde elementul');
  });


  test('.efecte.afişează', function() {
    ok('afişează' in app.AcţiuniProcedurale.efecte, 'defini');
    ok($.isFunction(app.AcţiuniProcedurale.efecte.afişează), '…funcţie');

    var $el = $('<div/>').appendTo('#qunit-fixture');

    app.AcţiuniProcedurale.efecte.ascunde(null, $el);
    app.AcţiuniProcedurale.efecte.afişează(null, $el);
    ok($el.is(':visible'), 'afişează elementul');
  });


  test('.propuneAcţiunileUrmătoare()', function() {
    ok('propuneAcţiunileUrmătoare' in app.AcţiuniProcedurale, 'definit');
    ok($.isFunction(app.AcţiuniProcedurale.propuneAcţiunileUrmătoare), '…funcţie');
    equal(app.AcţiuniProcedurale.propuneAcţiunileUrmătoare.length, 0, '…fără parametri');

    // stub
    var original = {
      opţiuni: app.AcţiuniProcedurale.opţiuni,
      $opţiuni: app.AcţiuniProcedurale.$opţiuni
    };

    app.AcţiuniProcedurale.opţiuni = {'intentare': ['continuare', 'încetare']};
    app.AcţiuniProcedurale.$opţiuni = app.$('<div/>');
    this.stub(app.AcţiuniProcedurale, 'ceaMaiRecentă', function() { return 'intentare'; });

    app.AcţiuniProcedurale.propuneAcţiunileUrmătoare();
    ok(app.AcţiuniProcedurale.$opţiuni.find('.propunere:contains("Încheiere de continuare")').există(),
      'propus încheierea de continuare');
    ok(app.AcţiuniProcedurale.$opţiuni.find('.propunere:contains("Încheiere de încetare")').există(),
      'propus încheierea de încetare');

    // unstub
    app.AcţiuniProcedurale.opţiuni = original.opţiuni;
    app.AcţiuniProcedurale.$opţiuni = original.$opţiuni;
  });


  test('.ceaMaiRecentă()', function() {
    var AcţiuniProcedurale = app.AcţiuniProcedurale;

    ok('ceaMaiRecentă' in AcţiuniProcedurale, 'definit');
    ok($.isFunction(AcţiuniProcedurale.ceaMaiRecentă), '…funcţie');
    equal(AcţiuniProcedurale.ceaMaiRecentă.length, 0, '…fără parametri');

    var original = {
      $: AcţiuniProcedurale.$
    };

    var ceaMaiRecentă = 'a treia';

    AcţiuniProcedurale.$ = $('<table>' +
      '<tr acţiune="prima">…</tr>' +
      '<tr acţiune="a doua">…</tr>' +
      '<tr acţiune="' + ceaMaiRecentă + '">…</tr>' +
    '</table>');
    equal(AcţiuniProcedurale.ceaMaiRecentă(), ceaMaiRecentă,
      'îmi dă identificatorul la cea mai recentă acţiune-procedurală din listă');

    AcţiuniProcedurale.$ = $('<table></table>');
    equal(AcţiuniProcedurale.ceaMaiRecentă(), '', 'cînd nu sunt itemi întoarce “”');

    AcţiuniProcedurale.$ = original.$;
  });


  test('.opţiuni', function() {
    ok('opţiuni' in app.AcţiuniProcedurale, 'definit');
    ok('' in app.AcţiuniProcedurale.opţiuni, 'avem cheia “” (pentru început, cînd nu există paşi antecedenţi)');

    function valideazăOpţiune(opţiune) {
      ok(opţiune in app.AcţiuniProcedurale.opţiuni, 'opţiunea “' + opţiune  + '” pentru “' + item + '” este în listă');
    }

    var item, acţiune;

    for (item in app.AcţiuniProcedurale.opţiuni) {
      ok($.isArray(app.AcţiuniProcedurale.opţiuni[item]), 'opţiunile pentru “' + item + '” este un array');

      if (item) {
        ok(app.AcţiuneProcedurală.există(item), '…găsit şablon corespunzător');

        acţiune = new app.AcţiuneProcedurală(item);
        equal(acţiune.areStructuraCorespunzătoare(), true, '…are structura corespunzătoare');
      }

      app.AcţiuniProcedurale.opţiuni[item].forEach(valideazăOpţiune);
    }

  });


  test('.eliminăOpţiuni()', function() {
    var original = {
      $opţiuni: app.AcţiuniProcedurale.$opţiuni
    };

    app.AcţiuniProcedurale.$opţiuni = app.$('<div>' +
      '<p class="propunere">…</p>' +
      '<p class="propunere">…</p>' +
    '</div>');

    app.AcţiuniProcedurale.eliminăOpţiuni();
    ok(!app.AcţiuniProcedurale.$opţiuni.find('.propunere').există(), 'eliminat opţiunile');

    app.AcţiuniProcedurale.$opţiuni = original.$opţiuni;
  });


  test('.$opţiuni', function() {
    ok('$opţiuni' in app.AcţiuniProcedurale, 'definit');
    ok('jquery' in app.AcţiuniProcedurale.$opţiuni, '…obiect jQuery');
    equal(app.AcţiuniProcedurale.$opţiuni.length, 1, '…cu un item');
  });


  test('.adaugă()', function() {
    ok('adaugă' in app.AcţiuniProcedurale, 'definit');
    ok($.isFunction(app.AcţiuniProcedurale.adaugă), '…funcţie');
    equal(app.AcţiuniProcedurale.adaugă.length, 0, '…fără parametri');

    var original = {
      $: app.AcţiuniProcedurale.$
    };

    app.AcţiuniProcedurale.$ = app.$('<div/>');
    this.stub(app.AcţiuniProcedurale, 'actualizeazăOpţiunile');
    this.stub(app.AcţiuniProcedurale, 'ajusteazăEliminabilitate');

    var $script = app.$('<script type="text/x-fragment" id="acţiune-procedurală-identificator">' +
      '<div id="identificator"/>' +
    '</script>').appendTo(app.document.body);

    var acţiune = new app.AcţiuneProcedurală('identificator');

    app.AcţiuniProcedurale.adaugă.call($(acţiune.propunere()).get(0));
    ok(app.AcţiuniProcedurale.$.find('div#identificator').există(), 'adaugă acţiunea în lista');
    ok(app.AcţiuniProcedurale.actualizeazăOpţiunile.called, 'actualizat opţiunile');
    ok(app.AcţiuniProcedurale.ajusteazăEliminabilitate.called, 'ajustat eliminabilitatea');

    app.AcţiuniProcedurale.$ = original.$;

    $script.remove();
  });


  test('.elimină()', function() {
    ok('elimină' in app.AcţiuniProcedurale, 'definit');
    ok($.isFunction(app.AcţiuniProcedurale.elimină), '…funcţie');
    equal(app.AcţiuniProcedurale.elimină.length, 0, '…fără parametri');

    this.stub(app.AcţiuniProcedurale, 'ajusteazăEliminabilitate');
    this.stub(app.AcţiuniProcedurale, 'propuneAcţiunileUrmătoare');

    app.AcţiuniProcedurale.elimină();
    ok(app.AcţiuniProcedurale.ajusteazăEliminabilitate.called, 'ajustat eliminabilitatea');
    ok(app.AcţiuniProcedurale.propuneAcţiunileUrmătoare.called, 'propus acţiunile următoare');
  });


  test('.ajusteazăEliminabilitate()', function() {
    ok('ajusteazăEliminabilitate' in app.AcţiuniProcedurale, 'definit');
    ok($.isFunction(app.AcţiuniProcedurale.ajusteazăEliminabilitate), '…funcţie');
    equal(app.AcţiuniProcedurale.ajusteazăEliminabilitate.length, 0, 'fără arametri');

    var original = {
      $: app.AcţiuniProcedurale.$
    };

    app.AcţiuniProcedurale.$.html(
      '<div acţiune>prima</div>' +
      '<div acţiune>a doua</div>' +
      '<div acţiune>a treia</div>'
    );
    app.AcţiuniProcedurale.ajusteazăEliminabilitate();

    var itemi = app.AcţiuniProcedurale.$.find('[acţiune]');

    ok(itemi.eq(0).is(':not(.eliminabil)'), 'itemii alţii decît ultimul nu sunt eliminabil');
    ok(itemi.eq(1).is(':not(.eliminabil)'), 'itemii alţii decît ultimul nu sunt eliminabil');
    ok(itemi.eq(2).is('.eliminabil.de.tot'), 'ultimul item este eliminabil');

    app.AcţiuniProcedurale.$ = original.$;
  });


  test('.actualizeazăOpţiunile()', function() {
    ok('actualizeazăOpţiunile' in app.AcţiuniProcedurale, 'definit');
    ok($.isFunction(app.AcţiuniProcedurale.actualizeazăOpţiunile), '…funcţie');
    equal(app.AcţiuniProcedurale.actualizeazăOpţiunile.length, 0, '…fără parametri');

    this.stub(app.AcţiuniProcedurale, 'eliminăOpţiunileCurente');
    this.stub(app.AcţiuniProcedurale, 'propuneAcţiunileUrmătoare');

    app.AcţiuniProcedurale.actualizeazăOpţiunile();
    ok(app.AcţiuniProcedurale.eliminăOpţiunileCurente.called, 'eliminat opţiunile curente');
    ok(app.AcţiuniProcedurale.propuneAcţiunileUrmătoare.called, 'propus opţiunile următoare');
  });


  test('.eliminăOpţiunileCurente()', function() {
    ok('eliminăOpţiunileCurente' in app.AcţiuniProcedurale, 'definit');
    ok($.isFunction(app.AcţiuniProcedurale.eliminăOpţiunileCurente), '…funcţie');
    equal(app.AcţiuniProcedurale.eliminăOpţiunileCurente.length, 0, '…fără parametri');

    var original = { $opţiuni: app.AcţiuniProcedurale.$opţiuni };

    app.AcţiuniProcedurale.$opţiuni = app.$('<div>' +
      '<p class="propunere">prima propunere</p>' +
      '<p class="propunere">a doua propunere</p>' +
    '</div>');
    app.AcţiuniProcedurale.eliminăOpţiunileCurente();
    ok(!app.AcţiuniProcedurale.$opţiuni.find('.propunere').există(), 'eliminat');

    app.AcţiuniProcedurale.$opţiuni = original.$opţiuni;
  });


  test('structura şabloanelor de acţiuni', function() {
    for (var identificator in app.AcţiuniProcedurale.opţiuni) {
      if (identificator === '') continue;

      var acţiune = new app.AcţiuneProcedurală(identificator);

      equal(acţiune.areStructuraCorespunzătoare(), true, identificator + ': are structura corespunzătoare');
    }
  });

})();
