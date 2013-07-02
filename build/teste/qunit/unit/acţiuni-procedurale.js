(function() {
  'use strict';

  var app = window.frames['app'];

  module('Unit: AcţiuniProcedurale');


  test('AcţiuniProcedurale.init', function() {
    var AcţiuniProcedurale = app.AcţiuniProcedurale,
        $Original = AcţiuniProcedurale.$,
        propuneOpţiuneaCorespunzătoareOriginal = AcţiuniProcedurale.propuneOpţiuneaCorespunzătoare,
        propusOpţiuneaCorespunzătoare = false,
        adaugăOriginal = AcţiuniProcedurale.adaugă,
        adăugat = false;

    AcţiuniProcedurale.$ = $('<ul>' +
      '<li acţiune><div class="intro"></div></li>' +
    '</ul>');
    AcţiuniProcedurale.propuneOpţiuneaCorespunzătoare = function() {
      propusOpţiuneaCorespunzătoare = true;
    };
    AcţiuniProcedurale.adaugă = function() {
      adăugat = true;
    };

    AcţiuniProcedurale.init();
    ok(propusOpţiuneaCorespunzătoare, 'propus opţiunea corespunzătoare');

    AcţiuniProcedurale.$.find('[acţiune] .intro').click();
    ok(adăugat, 'la click pe intro se adaugă itemul corespunzător');

    AcţiuniProcedurale.adaugă = adaugăOriginal;
    AcţiuniProcedurale.propuneOpţiuneaCorespunzătoare = propuneOpţiuneaCorespunzătoareOriginal;
    AcţiuniProcedurale.$ = $Original;
  });


  test('AcţiuniProcedurale.ceaMaiRecentă', function() {
    var AcţiuniProcedurale = app.AcţiuniProcedurale,
        $Original = AcţiuniProcedurale.$;

    var ultima = 'a treia';

    AcţiuniProcedurale.$ = $('<ul>' +
      '<li acţiune="prima">…</li>' +
      '<li acţiune="a doua">…</li>' +
      '<li acţiune="' + ultima + '">…</li>' +
    '</ul>');
    equal(AcţiuniProcedurale.ceaMaiRecentă(), ultima, 'îmi dă identificatorul la ultima acţiune-procedurală din listă');

    AcţiuniProcedurale.$ = $('<ul></ul>');
    equal(AcţiuniProcedurale.ceaMaiRecentă(), '', 'cînd nu sunt itemi întoarce “”');

    AcţiuniProcedurale.$ = $Original;
  });


  test('AcţiuniProcedurale.opţiuni', function() {
    var AcţiuniProcedurale = app.AcţiuniProcedurale;

    ok('' in AcţiuniProcedurale.opţiuni, 'avem cheia null (pentru început, cînd nu există paşi antecedenţi)');

    function valideazăOpţiune(opţiune) {
      ok(opţiune in AcţiuniProcedurale.opţiuni, 'opţiunea “' + opţiune  + '” pentru “' + item + '” este în listă');
    }

    for (var item in AcţiuniProcedurale.opţiuni) {
      ok($.isArray(AcţiuniProcedurale.opţiuni[item]), 'opţiunile pentru “' + item + '” este un array');
      ok(AcţiuniProcedurale.opţiuni[item].length > 0, '…nevid');
      ok(AcţiuniProcedurale.$şabloane.find('[acţiune="' + item + '"]').există(), '…găsit şablon corespunzător');

      AcţiuniProcedurale.opţiuni[item].forEach(valideazăOpţiune);
    }

  });


  test('AcţiuniProcedurale.propune', function() {
    var AcţiuniProcedurale = app.AcţiuniProcedurale,
        $Original = AcţiuniProcedurale.$,
        $şabloaneOriginal = AcţiuniProcedurale.$şabloane;

    var opţiuni = ['intentare', 'intentare-cu-asigurare'];

    AcţiuniProcedurale.$ = app.$('<ul></ul>');
    AcţiuniProcedurale.$şabloane = app.$('<ul>' +
      '<li acţiune="' + opţiuni[0] +'">…</li>'+
      '<li acţiune="' + opţiuni[1] +'">…</li>'+
    '</ul>');

    AcţiuniProcedurale.propune(opţiuni);

    var itemiPropuşi = AcţiuniProcedurale.$.find('[acţiune]').map(function() {
      return $(this).attr('acţiune');
    }).get().join(',');

    equal(itemiPropuşi, opţiuni.join(','), 'propune itemii corespunzători la listă în stare de propunere');

    AcţiuniProcedurale.$ = $Original;
    AcţiuniProcedurale.$şabloane = $şabloaneOriginal;
  });


  test('AcţiuniProcedurale.adaugă', function() {
    var AcţiuniProcedurale = app.AcţiuniProcedurale,
        eliminăCelelalteOpţiuniOriginal = app.AcţiuniProcedurale.eliminăCelelalteOpţiuni,
        eliminatCelelalteOpţiuni = false;

    app.AcţiuniProcedurale.eliminăCelelalteOpţiuni = function() {
      eliminatCelelalteOpţiuni = true;
    };

    var $item = $('<li acţiune="careva">' +
      '<div class="intro">…</div>' +
      '<div class="conţinut">…</div>' +
    '</li>');

    AcţiuniProcedurale.adaugă.call($item.find('.intro')[0]);
    ok($item.is('[adăugată]'), 'marcat item ca adăugat');
    ok(eliminatCelelalteOpţiuni, 'eliminat celelalte opţiuni');

    app.AcţiuniProcedurale.eliminăCelelalteOpţiuni = eliminăCelelalteOpţiuniOriginal;
  });


  test('AcţiuniProcedurale.eliminăCelelalteOpţiuni', function() {
    var AcţiuniProcedurale = app.AcţiuniProcedurale;

    AcţiuniProcedurale.$ = $('<ul>' +
      '<li acţiune="cutare" adăugată>…</li>' +
      '<li acţiune="cutare" adăugată>…</li>' +
      '<li acţiune="cutare">…</li>' +
    '</ul>');

    AcţiuniProcedurale.eliminăCelelalteOpţiuni();
    equal(AcţiuniProcedurale.$.find('li').length, 2, 'eliminat opţiunile neadăugate');
  });

})();
