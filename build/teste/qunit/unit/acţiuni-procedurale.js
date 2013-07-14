(function() {
  'use strict';

  var app = window.frames['app'];

  module('Unit: AcţiuniProcedurale');

  // TODO de testat structura fragmentele acţiunilor?

  test('.init()', function() {
    // stub
    var AcţiuniProcedurale = app.AcţiuniProcedurale,
        $OpţiuniOriginal = app.AcţiuniProcedurale.$opţiuni,
        ataşatLaEveniment = false;

    AcţiuniProcedurale.$opţiuni = {
      on: function(eveniment, selector, callback) {
        ataşatLaEveniment =
          eveniment === 'click' &&
          selector === '.opţiune' &&
          callback === AcţiuniProcedurale.adaugă;
      },
      append: function() {}
    };

    var propuneCorespunzătorAcţiunileUrmătoareOriginal = AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare,
        propusOpţiuneaCorespunzătoare = false;

    AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare = function() {
      propusOpţiuneaCorespunzătoare = true;
    };

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

    // TODO: aici
    app.AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare();
    ok(app.AcţiuniProcedurale.$opţiuni.find('.opţiune:contains("Încheiere de continuare")').există(),
      'propus încheierea de continuare');
    ok(app.AcţiuniProcedurale.$opţiuni.find('.opţiune:contains("Încheiere de încetare")').există(),
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

    for (var item in app.AcţiuniProcedurale.opţiuni) {
      ok($.isArray(app.AcţiuniProcedurale.opţiuni[item]), 'opţiunile pentru “' + item + '” este un array');
      ok(app.AcţiuniProcedurale.opţiuni[item].length > 0, '…nevid');

      if (item) {
        ok(app.AcţiuneProcedurală.există(item), '…găsit şablon corespunzător');
      }

      app.AcţiuniProcedurale.opţiuni[item].forEach(valideazăOpţiune);
    }

  });


  test('.eliminăOpţiuni()', function() {
    var $OpţiuniOriginal = app.AcţiuniProcedurale.$opţiuni;

    app.AcţiuniProcedurale.$opţiuni = app.$('<div>' +
      '<p class="opţiune">…</p>' +
      '<p class="opţiune">…</p>' +
    '</div>');

    app.AcţiuniProcedurale.eliminăOpţiuni();
    ok(!app.AcţiuniProcedurale.$opţiuni.find('.opţiune').există(), 'eliminat opţiunile');

    app.AcţiuniProcedurale.$opţiuni = $OpţiuniOriginal;
  });


  test('.$opţiuni', function() {
    ok('$opţiuni' in app.AcţiuniProcedurale, 'definit');
    ok('jquery' in app.AcţiuniProcedurale.$opţiuni, '…obiect jQuery');
    equal(app.AcţiuniProcedurale.$opţiuni.length, 1, '…cu un item');
  });

})();
