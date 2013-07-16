(function() {
  'use strict';

  var app = window.frames['app'];

  module('Unit: AcţiuniProcedurale');

  // TODO de testat structura fragmentele acţiunilor?

  test('.init()', function() {
    this.spy(app.AcţiuniProcedurale.$opţiuni, 'on');
    this.spy(app.AcţiuniProcedurale, 'propuneCorespunzătorAcţiunileUrmătoare');

    app.AcţiuniProcedurale.init();
    ok(app.AcţiuniProcedurale.$opţiuni.on.calledWith('click', '.propunere', app.AcţiuniProcedurale.adaugă),
      'ataşat la evenimentele corespunzătoare');
    ok(app.AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare.called, 'propus opţiunea corespunzătoare');
  });


  test('.propuneCorespunzătorAcţiunileUrmătoare()', function() {
    ok('propuneCorespunzătorAcţiunileUrmătoare' in app.AcţiuniProcedurale, 'definit');
    ok($.isFunction(app.AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare), '…funcţie');
    equal(app.AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare.length, 0, '…fără parametri');

    // stub
    var opţiuniOriginal = app.AcţiuniProcedurale.opţiuni,
        $OpţiuniOriginal = app.AcţiuniProcedurale.$opţiuni;

    app.AcţiuniProcedurale.opţiuni = {'intentare': ['continuare', 'încetare']};
    app.AcţiuniProcedurale.$opţiuni = app.$('<div/>');
    this.stub(app.AcţiuniProcedurale, 'ceaMaiRecentă').returns('intentare');

    // TODO: aici
    app.AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare();
    ok(app.AcţiuniProcedurale.$opţiuni.find('.propunere:contains("Încheiere de continuare")').există(),
      'propus încheierea de continuare');
    ok(app.AcţiuniProcedurale.$opţiuni.find('.propunere:contains("Încheiere de încetare")').există(),
      'propus încheierea de încetare');

    // unstub
    app.AcţiuniProcedurale.opţiuni = opţiuniOriginal;
    app.AcţiuniProcedurale.$opţiuni = $OpţiuniOriginal;
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

    var $Original = app.AcţiuniProcedurale.$;

    app.AcţiuniProcedurale.$ = app.$('<div/>');
    this.spy(app.AcţiuniProcedurale, 'actualizeazăOpţiunile');

    var $script = app.$('<script type="text/x-fragment" id="acţiune-procedurală-identificator">' +
      '<div id="identificator"/>' +
    '</script>').appendTo(app.document.body);

    var acţiune = new app.AcţiuneProcedurală('identificator');

    app.AcţiuniProcedurale.adaugă.call($(acţiune.propunere()).get(0));
    ok(app.AcţiuniProcedurale.$.find('div#identificator').există(), 'adaugă acţiunea în lista');
    ok(app.AcţiuniProcedurale.actualizeazăOpţiunile.called, 'actualizat opţiunile');

    app.AcţiuniProcedurale.$ = $Original;
    $script.remove();
  });


  test('.actualizeazăOpţiunile', function() {
    ok('actualizeazăOpţiunile' in app.AcţiuniProcedurale, 'definit');
    ok($.isFunction(app.AcţiuniProcedurale.actualizeazăOpţiunile), '…funcţie');
    equal(app.AcţiuniProcedurale.actualizeazăOpţiunile.length, 0, '…fără parametri');

    this.spy(app.AcţiuniProcedurale, 'eliminăOpţiunileCurente');
    this.spy(app.AcţiuniProcedurale, 'propuneCorespunzătorAcţiunileUrmătoare');

    app.AcţiuniProcedurale.actualizeazăOpţiunile();
    ok(app.AcţiuniProcedurale.eliminăOpţiunileCurente.called, 'eliminat opţiunile curente');
    ok(app.AcţiuniProcedurale.propuneCorespunzătorAcţiunileUrmătoare.called, 'propus opţiunile următoare');
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
