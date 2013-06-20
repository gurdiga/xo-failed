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

})();
