(function() {
  'use strict';

  var app = window.frames['app'];

  module('Unit: AcţiuniProcedurale');


  test('AcţiuniProcedurale.ceaMaiRecentă', function() {
    var AcţiuniProcedurale = app.AcţiuniProcedurale,
        $Original = AcţiuniProcedurale.$;

    var ultima = 'a treia';

    AcţiuniProcedurale.$ = $('<ul>' +
      '<li class="acţiune-procedurală" identificator="prima">…</li>' +
      '<li class="acţiune-procedurală" identificator="a doua">…</li>' +
      '<li class="acţiune-procedurală" identificator="' + ultima + '">…</li>' +
    '</ul>');
    equal(AcţiuniProcedurale.ceaMaiRecentă(), ultima, 'îmi dă identificatorul la ultima acţiune-procedurală din listă');

    AcţiuniProcedurale.$ = $('<ul></ul>');
    equal(AcţiuniProcedurale.ceaMaiRecentă(), undefined, 'cînd nu sunt itemi întoarce undefined');

    AcţiuniProcedurale.$ = $Original;
  });


  test('AcţiuniProcedurale.lista', function() {
    var AcţiuniProcedurale = app.AcţiuniProcedurale;

    ok(undefined in AcţiuniProcedurale.lista, 'avem cheia undefined (pentru început, cînd nu există ceaMaiRecentă)');

    for (var item in AcţiuniProcedurale.lista) {
      ok($.isArray(AcţiuniProcedurale.lista[item]), 'opţiunile pentru “' + item + '” este un array');
    }
  });


  test('AcţiuniProcedurale.adaugă', function() {
    var AcţiuniProcedurale = app.AcţiuniProcedurale,
        $Original = AcţiuniProcedurale.$,
        $şabloaneOriginal = AcţiuniProcedurale.$şabloane;

    var identificator = 'identificator-acţiune';

    AcţiuniProcedurale.$ = app.$('<ul></ul>');
    AcţiuniProcedurale.$şabloane = app.$('<ul>' +
      '<li class="acţiune-procedurală" identificator="' + identificator +'">…</li>'+
    '</ul>');

    AcţiuniProcedurale.adaugă(identificator);
    ok(AcţiuniProcedurale.$.find('.acţiune-procedurală[identificator="' + identificator + '"]').există(),
        'adaugă itemul corespunzător la listă');

    AcţiuniProcedurale.$ = $Original;
    AcţiuniProcedurale.$şabloane = $şabloaneOriginal;
  });

  // TODO: cum facem cu afişarea opţiunilor la fiecare moment?

})();
