(function() {
  'use strict';

  var app = window.frames['app'];


  test('SelecturiFoarteLate.init', function() {
    // stub
    app.SelecturiFoarteLate.afişeazăŞoaptăOriginal = app.SelecturiFoarteLate.afişeazăŞoaptă;
    app.SelecturiFoarteLate.afişeazăŞoaptePentruSelecturileUrmătoareOriginal =
      app.SelecturiFoarteLate.afişeazăŞoaptePentruSelecturileUrmătoare;
    app.FormularProcedură.$Original = app.FormularProcedură.$;

    // setup
    var afişatŞoapte = false,
        afişatŞoaptePentruSelecturileUrmătoare = false;

    app.SelecturiFoarteLate.afişeazăŞoaptă = function() { afişatŞoapte = true; };
    app.SelecturiFoarteLate.afişeazăŞoaptePentruSelecturileUrmătoare = function() { afişatŞoaptePentruSelecturileUrmătoare = true; };
    app.FormularProcedură.$ = $('<div/>');

    $('<select class="foarte lat"></select>').appendTo(app.FormularProcedură.$);
    $('<select class="care schimbă formularul"></select>').appendTo(app.FormularProcedură.$);

    // act & verify
    app.SelecturiFoarteLate.init();
    ok(afişatŞoapte, 'generează eveniment “change” pe selecturile foarte late');

    afişatŞoapte = false;
    app.FormularProcedură.$.find('select.foarte.lat').trigger('change');
    ok(afişatŞoapte, 'la schimbarea valorii unui select.foarte.lat se afişează şoapta');

    app.FormularProcedură.$.find('select.care.schimbă.formularul').trigger('change');
    ok(afişatŞoaptePentruSelecturileUrmătoare, 'la schimbarea valorii unui select.care.schimbă.formularul se afişează şoapta');

    // unstub
    app.SelecturiFoarteLate.afişeazăŞoaptă = app.SelecturiFoarteLate.afişeazăŞoaptăOriginal;
    app.SelecturiFoarteLate.afişeazăŞoaptePentruSelecturileUrmătoare =
      app.SelecturiFoarteLate.afişeazăŞoaptePentruSelecturileUrmătoareOriginal;
    app.FormularProcedură.$ = app.FormularProcedură.$Original;

    app.SelecturiFoarteLate.init();
  });


  test('SelecturiFoarteLate.afişeazăŞoaptă', function() {
    var $container = app.$('<div/>');
    var $select = app.$(
      '<select>' +
        '<option class="scurtă">prima opţiune</option>' +
        '<option selected>opţiunea a doua</option>' +
      '</select>'
    ).appendTo($container);

    app.SelecturiFoarteLate.afişeazăŞoaptă.call($select[0]);

    var $şoapta = $select.next('p');

    ok($şoapta.există(), 'inserat un <p> după select');
    ok($şoapta.is('.şoaptă'), '…cu clasa “şoaptă”');
    equal($şoapta.text(), $select.find('option:selected').text(), '…cu textul din opţiunea selectată');

    app.SelecturiFoarteLate.afişeazăŞoaptă.call($select[0]);
    equal($select.siblings('p.şoaptă').length, 1, 'la selectările succesive şoapta precedentă se elimină, deci rămîne doar una');

    $select.val('prima opţiune');
    app.SelecturiFoarteLate.afişeazăŞoaptă.call($select[0]);
    ok(!$select.siblings('p.şoaptă').există(), 'dacă opţiunea e marcată cu clasa “scurtă”, elimină şoapta');
  });


  test('SelecturiFoarteLate.afişeazăŞoaptePentruSelecturileUrmătoare', function() {
    var $secţiune = app.$(
      '<div class="conţinut">' +
        '<ul>' +
          '<li>' +
            '<select class="select care schimbă formularul"></select>' +
          '</li>' +
          '<li>' +
            '<select class="foarte lat"></label>' +
          '</li>' +
        '</ul>' +
      '</div>'
    );

    var $selectCareSchimbăFormularul = $secţiune.find('select.care.schimbă.formularul'),
        $selectFoarteLat = $secţiune.find('select.foarte.lat'),
        generatEvenmentChange = false;

    $selectFoarteLat.one('change', function() { generatEvenmentChange = true; });
    app.SelecturiFoarteLate.afişeazăŞoaptePentruSelecturileUrmătoare.call($selectCareSchimbăFormularul[0]);
    ok(generatEvenmentChange, 'generează evenimentul change din cîmpurile de mai jos (pentru a le afişa şoaptele)');
  });

})();
