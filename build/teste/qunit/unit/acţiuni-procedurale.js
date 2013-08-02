(function() {
  'use strict';

  var app = window.frames['app'];

  module('Unit: AcţiuniProcedurale');

  test('.init()', function() {
    // stub
    var AcţiuniProcedurale = app.AcţiuniProcedurale,
        $OpţiuniOriginal = app.AcţiuniProcedurale.$opţiuni,
        ataşatLaEveniment = false;

    AcţiuniProcedurale.$opţiuni = {
      on: function(eveniment, selector, callback) {
        ataşatLaEveniment =
          eveniment === 'click' &&
          selector === '.propunere' &&
          callback === AcţiuniProcedurale.adaugă;
      },
      append: function() {}
    };

    var propuneCorespunzătorAcţiunileUrmătoareOriginal = AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare,
        propusOpţiuneaCorespunzătoare = false;

        AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare = function() { propusOpţiuneaCorespunzătoare = true; };

    AcţiuniProcedurale.init();
    ok(ataşatLaEveniment, 'ataşat la evenimentele corespunzătoare');
    ok(propusOpţiuneaCorespunzătoare, 'propus opţiunea corespunzătoare');

    // unstub
    AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare = propuneCorespunzătorAcţiunileUrmătoareOriginal;
    AcţiuniProcedurale.$opţiuni = $OpţiuniOriginal;
  });


  test('.propuneCorespunzătorAcţiunileUrmătoare()', function() {
    ok('propuneCorespunzătorAcţiunileUrmătoare' in app.AcţiuniProcedurale, 'definit');
    ok($.isFunction(app.AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare), '…funcţie');
    equal(app.AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare.length, 0, '…fără parametri');

    // stub
    var opţiuniOriginal = app.AcţiuniProcedurale.opţiuni,
        $OpţiuniOriginal = app.AcţiuniProcedurale.$opţiuni,
        ceaMaiRecentăOriginal = app.AcţiuniProcedurale.ceaMaiRecentă;

    app.AcţiuniProcedurale.opţiuni = {'intentare': ['continuare', 'încetare']};
    app.AcţiuniProcedurale.$opţiuni = app.$('<div/>');
    app.AcţiuniProcedurale.ceaMaiRecentă = function() { return 'intentare'; };

    app.AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare();
    ok(app.AcţiuniProcedurale.$opţiuni.find('.propunere:contains("Încheiere de continuare")').există(),
      'propus încheierea de continuare');
    ok(app.AcţiuniProcedurale.$opţiuni.find('.propunere:contains("Încheiere de încetare")').există(),
      'propus încheierea de încetare');

    // unstub
    app.AcţiuniProcedurale.opţiuni = opţiuniOriginal;
    app.AcţiuniProcedurale.$opţiuni = $OpţiuniOriginal;
    app.AcţiuniProcedurale.ceaMaiRecentă = ceaMaiRecentăOriginal;
  });


  test('.ceaMaiRecentă()', function() {
    var AcţiuniProcedurale = app.AcţiuniProcedurale;

    ok('ceaMaiRecentă' in AcţiuniProcedurale, 'definit');
    ok($.isFunction(AcţiuniProcedurale.ceaMaiRecentă), '…funcţie');
    equal(AcţiuniProcedurale.ceaMaiRecentă.length, 0, '…fără parametri');

    var $Original = AcţiuniProcedurale.$;
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

    AcţiuniProcedurale.$ = $Original;
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
      ok(app.AcţiuniProcedurale.opţiuni[item].length > 0, '…nevid');

      if (item) {
        ok(app.AcţiuneProcedurală.există(item), '…găsit şablon corespunzător');

        acţiune = new app.AcţiuneProcedurală(item);
        equal(acţiune.areStructuraCorespunzătoare(), true, '…are structura corespunzătoare');
      }

      app.AcţiuniProcedurale.opţiuni[item].forEach(valideazăOpţiune);
    }

  });


  test('.eliminăOpţiuni()', function() {
    var $OpţiuniOriginal = app.AcţiuniProcedurale.$opţiuni;

    app.AcţiuniProcedurale.$opţiuni = app.$('<div>' +
      '<p class="propunere">…</p>' +
      '<p class="propunere">…</p>' +
    '</div>');

    app.AcţiuniProcedurale.eliminăOpţiuni();
    ok(!app.AcţiuniProcedurale.$opţiuni.find('.propunere').există(), 'eliminat opţiunile');

    app.AcţiuniProcedurale.$opţiuni = $OpţiuniOriginal;
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

    var $Original = app.AcţiuniProcedurale.$,
        actualizeazăOpţiunileOriginal = app.AcţiuniProcedurale.actualizeazăOpţiunile,
        actualizatOpţiunile = false;

    app.AcţiuniProcedurale.$ = app.$('<div/>');
    app.AcţiuniProcedurale.actualizeazăOpţiunile = function() { actualizatOpţiunile = true; };

    var $script = app.$('<script type="text/x-fragment" id="acţiune-procedurală-identificator">' +
      '<div id="identificator"/>' +
    '</script>').appendTo(app.document.body);

    var acţiune = new app.AcţiuneProcedurală('identificator');

    app.AcţiuniProcedurale.adaugă.call($(acţiune.propunere()).get(0));
    ok(app.AcţiuniProcedurale.$.find('div#identificator').există(), 'adaugă acţiunea în lista');
    ok(actualizatOpţiunile, 'actualizat opţiunile');

    app.AcţiuniProcedurale.$ = $Original;
    app.AcţiuniProcedurale.actualizeazăOpţiunile = actualizeazăOpţiunileOriginal;
    $script.remove();
  });


  test('.actualizeazăOpţiunile', function() {
    ok('actualizeazăOpţiunile' in app.AcţiuniProcedurale, 'definit');
    ok($.isFunction(app.AcţiuniProcedurale.actualizeazăOpţiunile), '…funcţie');
    equal(app.AcţiuniProcedurale.actualizeazăOpţiunile.length, 0, '…fără parametri');

    var eliminăOpţiunileCurenteOiriginal = app.AcţiuniProcedurale.eliminăOpţiunileCurente,
        eliminatOpţiunileCurente = false,
        propuneCorespunzătorAcţiunileUrmătoareOriginal = app.AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare,
        propusCorespunzătorAcţiunileUrmătoare = false;

    app.AcţiuniProcedurale.eliminăOpţiunileCurente = function() { eliminatOpţiunileCurente = true; };
    app.AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare = function() { propusCorespunzătorAcţiunileUrmătoare = true; };

    app.AcţiuniProcedurale.actualizeazăOpţiunile();
    ok(eliminatOpţiunileCurente, 'eliminat opţiunile curente');
    ok(propusCorespunzătorAcţiunileUrmătoare, 'propus opţiunile următoare');

    app.AcţiuniProcedurale.eliminăOpţiunileCurente = eliminăOpţiunileCurenteOiriginal;
    app.AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare = propuneCorespunzătorAcţiunileUrmătoareOriginal;
  });


  test('.eliminăOpţiunileCurente', function() {
    ok('eliminăOpţiunileCurente' in app.AcţiuniProcedurale, 'definit');
    ok($.isFunction(app.AcţiuniProcedurale.eliminăOpţiunileCurente), '…funcţie');
    equal(app.AcţiuniProcedurale.eliminăOpţiunileCurente.length, 0, '…fără parametri');

    var $OpţiuniOriginal = app.AcţiuniProcedurale.$opţiuni;

    app.AcţiuniProcedurale.$opţiuni = app.$('<div>' +
      '<p class="propunere">prima propunere</p>' +
      '<p class="propunere">a doua propunere</p>' +
    '</div>');
    app.AcţiuniProcedurale.eliminăOpţiunileCurente();
    ok(!app.AcţiuniProcedurale.$opţiuni.find('.propunere').există(), 'eliminat');

    app.AcţiuniProcedurale.$opţiuni = $OpţiuniOriginal;
  });

})();
