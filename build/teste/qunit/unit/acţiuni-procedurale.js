(function() {
  'use strict';

  var app = window.frames['app'];

  module('Unit: AcţiuniProcedurale');

  test('.init() animaţie', function() {
    var original = app.AcţiuniProcedurale.efecte,
        iniţializat = false;

    app.AcţiuniProcedurale.efecte = { init: function() { iniţializat = true ; } };

    app.AcţiuniProcedurale.init();
    ok(iniţializat, 'iniţializat');

    app.AcţiuniProcedurale.efecte = original;
  });


  test('.init(): înregistrează fragmente parţiale', function() {
    var original = app.AcţiuniProcedurale.înregistreazăFragmenteParţiale,
        înregistrat = false;

    app.AcţiuniProcedurale.înregistreazăFragmenteParţiale = function() { înregistrat = true; };

    app.AcţiuniProcedurale.init();
    ok(înregistrat, 'înregistrat fragmente parţiale');

    app.AcţiuniProcedurale.înregistreazăFragmenteParţiale = original;
  });


  test('.init(): propune corespunzător acţiunile următoare', function() {
    var original = app.AcţiuniProcedurale.propuneAcţiunileUrmătoare,
        propus = false;

    app.AcţiuniProcedurale.propuneAcţiunileUrmătoare = function() { propus = true; };

    app.AcţiuniProcedurale.init();
    ok(propus, 'propus opţiunea corespunzătoare');

    app.AcţiuniProcedurale.propuneAcţiunileUrmătoare = original;
  });


  test('.init(): adăugare opţiune', function() {
    var adăugat = false;

    var original = {
      adaugă: app.AcţiuniProcedurale.adaugă,
      $opţiuni: app.AcţiuniProcedurale.$opţiuni
    };

    app.AcţiuniProcedurale.adaugă = function() { adăugat = true; };
    app.AcţiuniProcedurale.$opţiuni.html('<a class="propunere">text</a>');

    app.AcţiuniProcedurale.init();
    app.AcţiuniProcedurale.$opţiuni.find('.propunere').trigger('click');
    ok(adăugat, 'la click pe una din opţiuni, ea se adaugă în listă');

    app.AcţiuniProcedurale.adaugă = original.adaugă;
    app.AcţiuniProcedurale.$opţiuni = original.$opţiuni;
  });


  test('.init(): eliminare-item', function() {
    var original = app.AcţiuniProcedurale.propuneAcţiunileUrmătoare,
        propus = false;

    app.AcţiuniProcedurale.propuneAcţiunileUrmătoare = function() { propus = true; };

    app.AcţiuniProcedurale.init();
    app.AcţiuniProcedurale.$.parent().trigger('eliminat-item');
    ok(propus, 'la eliminarea unei acţiuni se reafişează opţiunile');

    app.AcţiuniProcedurale.propuneAcţiunileUrmătoare = original;
  });


  test('.efecte', function() {
    ok('efecte' in app.AcţiuniProcedurale, 'defini');
    ok($.isPlainObject(app.AcţiuniProcedurale.efecte), '…obiect');
  });


  test('.efecte.init', function() {
    ok('init' in app.AcţiuniProcedurale.efecte, 'defini');
    ok($.isFunction(app.AcţiuniProcedurale.efecte.init), '…funcţie');

    var ascuns = false,
        afişat = false;

    var original = {
      $: app.AcţiuniProcedurale.$,
      ascunde: app.AcţiuniProcedurale.efecte.ascunde,
      afişează: app.AcţiuniProcedurale.efecte.afişează
    };

    app.AcţiuniProcedurale.$ = $('<div/>');
    app.AcţiuniProcedurale.efecte.afişează = function() { afişat = true; };
    app.AcţiuniProcedurale.efecte.ascunde = function() { ascuns = true; };

    app.AcţiuniProcedurale.efecte.init();

    app.AcţiuniProcedurale.$.trigger('înainte-de.adăugare-acţiune');
    ok(ascuns, 'ascunde înainte de adăugare');

    app.AcţiuniProcedurale.$.trigger('după.adăugare-acţiune');
    ok(afişat, 'afişat după adăugare');

    app.AcţiuniProcedurale.$ = original.$;
    app.AcţiuniProcedurale.efecte.ascunde = original.ascunde;
    app.AcţiuniProcedurale.efecte.afişează = original.afişează;
  });


  test('.efecte.ascunde', function() {
    ok('ascunde' in app.AcţiuniProcedurale.efecte, 'defini');
    ok($.isFunction(app.AcţiuniProcedurale.efecte.ascunde), '…funcţie');
    equal(app.AcţiuniProcedurale.efecte.ascunde.length, 2, '…acceptă doi parametri');

    var $el = $('<div/>').appendTo(document.body);

    app.AcţiuniProcedurale.efecte.ascunde(null, $el);
    ok($el.is(':not(:visible)'), 'ascunde elementul');

    $el.remove();
  });


  test('.efecte.afişează', function() {
    ok('afişează' in app.AcţiuniProcedurale.efecte, 'defini');
    ok($.isFunction(app.AcţiuniProcedurale.efecte.afişează), '…funcţie');

    var $el = $('<div/>').appendTo(document.body);

    app.AcţiuniProcedurale.efecte.ascunde(null, $el);
    app.AcţiuniProcedurale.efecte.afişează(null, $el);
    ok($el.is(':visible'), 'afişează elementul');

    $el.remove();
  });


  test('.propuneAcţiunileUrmătoare()', function() {
    ok('propuneAcţiunileUrmătoare' in app.AcţiuniProcedurale, 'definit');
    ok($.isFunction(app.AcţiuniProcedurale.propuneAcţiunileUrmătoare), '…funcţie');
    equal(app.AcţiuniProcedurale.propuneAcţiunileUrmătoare.length, 0, '…fără parametri');

    // stub
    var original = {
      opţiuni: app.AcţiuniProcedurale.opţiuni,
      $opţiuni: app.AcţiuniProcedurale.$opţiuni,
      ceaMaiRecentă: app.AcţiuniProcedurale.ceaMaiRecentă
    };

    app.AcţiuniProcedurale.opţiuni = {'intentare': ['continuare', 'încetare']};
    app.AcţiuniProcedurale.$opţiuni = app.$('<div/>');
    app.AcţiuniProcedurale.ceaMaiRecentă = function() { return 'intentare'; };

    app.AcţiuniProcedurale.propuneAcţiunileUrmătoare();
    ok(app.AcţiuniProcedurale.$opţiuni.find('.propunere:contains("Încheiere de continuare")').există(),
      'propus încheierea de continuare');
    ok(app.AcţiuniProcedurale.$opţiuni.find('.propunere:contains("Încheiere de încetare")').există(),
      'propus încheierea de încetare');

    // unstub
    app.AcţiuniProcedurale.opţiuni = original.opţiuni;
    app.AcţiuniProcedurale.$opţiuni = original.$opţiuni;
    app.AcţiuniProcedurale.ceaMaiRecentă = original.ceaMaiRecentă;
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

    var actualizatOpţiunile = false,
        ajustatEliminabilitatea = false;

    var original = {
      $: app.AcţiuniProcedurale.$,
      actualizeazăOpţiunile: app.AcţiuniProcedurale.actualizeazăOpţiunile,
      ajusteazăEliminabilitate: app.AcţiuniProcedurale.ajusteazăEliminabilitate
    };

    app.AcţiuniProcedurale.$ = app.$('<div/>');
    app.AcţiuniProcedurale.actualizeazăOpţiunile = function() { actualizatOpţiunile = true; };
    app.AcţiuniProcedurale.ajusteazăEliminabilitate = function() { ajustatEliminabilitatea = true; };

    var $script = app.$('<script type="text/x-fragment" id="acţiune-procedurală-identificator">' +
      '<div id="identificator"/>' +
    '</script>').appendTo(app.document.body);

    var acţiune = new app.AcţiuneProcedurală('identificator');

    app.AcţiuniProcedurale.adaugă.call($(acţiune.propunere()).get(0));
    ok(app.AcţiuniProcedurale.$.find('div#identificator').există(), 'adaugă acţiunea în lista');
    ok(actualizatOpţiunile, 'actualizat opţiunile');
    ok(ajustatEliminabilitatea, 'ajustat eliminabilitatea');

    app.AcţiuniProcedurale.$ = original.$;
    app.AcţiuniProcedurale.actualizeazăOpţiunile = original.actualizeazăOpţiunile;
    app.AcţiuniProcedurale.ajusteazăEliminabilitate = original.ajusteazăEliminabilitate;

    $script.remove();
  });


  test('.elimină()', function() {
    ok('elimină' in app.AcţiuniProcedurale, 'definit');
    ok($.isFunction(app.AcţiuniProcedurale.elimină), '…funcţie');
    equal(app.AcţiuniProcedurale.elimină.length, 0, '…fără parametri');

    var ajustat = false,
        propus = false;

    var original = {
      ajusteazăEliminabilitate: app.AcţiuniProcedurale.ajusteazăEliminabilitate,
      propuneAcţiunileUrmătoare: app.AcţiuniProcedurale.propuneAcţiunileUrmătoare
    };

    app.AcţiuniProcedurale.ajusteazăEliminabilitate = function() { ajustat = true; };
    app.AcţiuniProcedurale.propuneAcţiunileUrmătoare = function() { propus = true; };

    app.AcţiuniProcedurale.elimină();
    ok(ajustat, 'ajustat eliminabilitatea');
    ok(propus, 'propus acţiunile următoare');

    app.AcţiuniProcedurale.ajusteazăEliminabilitate = original.ajusteazăEliminabilitate;
    app.AcţiuniProcedurale.propuneAcţiunileUrmătoare = original.propuneAcţiunileUrmătoare;
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

    var eliminatOpţiunileCurente = false,
        propusCorespunzătorAcţiunileUrmătoare = false;

    var original = {
      eliminăOpţiunileCurente: app.AcţiuniProcedurale.eliminăOpţiunileCurente,
      propuneAcţiunileUrmătoare: app.AcţiuniProcedurale.propuneAcţiunileUrmătoare
    };

    app.AcţiuniProcedurale.eliminăOpţiunileCurente = function() { eliminatOpţiunileCurente = true; };
    app.AcţiuniProcedurale.propuneAcţiunileUrmătoare = function() { propusCorespunzătorAcţiunileUrmătoare = true; };

    app.AcţiuniProcedurale.actualizeazăOpţiunile();
    ok(eliminatOpţiunileCurente, 'eliminat opţiunile curente');
    ok(propusCorespunzătorAcţiunileUrmătoare, 'propus opţiunile următoare');

    app.AcţiuniProcedurale.eliminăOpţiunileCurente = original.eliminăOpţiunileCurente;
    app.AcţiuniProcedurale.propuneAcţiunileUrmătoare = original.propuneAcţiunileUrmătoare;
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
