(function () {
  /*jshint maxlen:142 */
  'use strict';

  var app = window.frames['app'];


  test('SelecturiFoarteLate.init', function () {
    // stub
    app.SelecturiFoarteLate.afişeazăŞoaptăOriginal = app.SelecturiFoarteLate.afişeazăŞoaptă;
    app.SelecturiFoarteLate.afişeazăŞoaptePentruSelecturileUrmătoareOriginal =
      app.SelecturiFoarteLate.afişeazăŞoaptePentruSelecturileUrmătoare;
    app.FormularProcedură.$Original = app.FormularProcedură.$;

    // setup
    var afişatŞoapte = false,
        afişatŞoaptePentruSelecturileUrmătoare = false;

    app.SelecturiFoarteLate.afişeazăŞoaptă = function () { afişatŞoapte = true; };
    app.SelecturiFoarteLate.afişeazăŞoaptePentruSelecturileUrmătoare = function () { afişatŞoaptePentruSelecturileUrmătoare = true; };
    app.FormularProcedură.$ = $('<div/>');

    var $selectFoarteLat = $('<select class="foarte lat"></select>').appendTo(app.FormularProcedură.$),
        $selectCareSchimbăFormularul = $('<select class="care schimbă formularul"></select>').appendTo(app.FormularProcedură.$);

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


  test('SelecturiFoarteLate.afişeazăŞoaptă', function () {
    ok(true, 'TODO');
  });


  test('SelecturiFoarteLate.afişeazăŞoaptePentruSelecturileUrmătoare', function () {
    ok(true, 'TODO');
  });

})();
