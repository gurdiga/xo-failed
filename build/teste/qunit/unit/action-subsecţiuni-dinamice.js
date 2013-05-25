(function() {
  'use strict';

  var app = window.frames['app'];


  test('SubsecţiuniDinamice.init', function() {
    equal(app.SubsecţiuniDinamice.selector, 'select.care.schimbă.formularul', 'selectorul e definit');

    // stub
    app.FormularProcedură.$Original = app.FormularProcedură.$;
    app.SubsecţiuniDinamice.insereazăOriginal = app.SubsecţiuniDinamice.inserează;

    // setup
    app.FormularProcedură.$ = app.$(
      '<ul>' +
        '<li>' +
          '<select class="care schimbă formularul"></select>' +
        '</li>' +
      '</ul>'
    );

    var inserat = false;

    app.SubsecţiuniDinamice.inserează = function() { inserat = true; };
    app.SubsecţiuniDinamice.init();

    app.FormularProcedură.$.find(app.SubsecţiuniDinamice.selector).trigger('change');
    ok(inserat, 'leagă SubsecţiuniDinamice.inserează de evenimentul “change”');

    // unstub
    app.FormularProcedură.$ = app.FormularProcedură.$Original;
    app.SubsecţiuniDinamice.inserează = app.SubsecţiuniDinamice.insereazăOriginal;
  });


  test('SubsecţiuniDinamice.inserează', function() {
    // stub
    app.$şabloaneOriginal = app.$şabloane;

    // setup
    app.$şabloane = app.$(
      '<div id="şabloane">' +
        '<ul class="conţinut denumire-cîmp" title="text opţiune">' +
          '<li class="adăugate">alt cîmp 1</li>' +
          '<li class="adăugate">alt cîmp 2</li>' +
          '<li class="adăugate">' +
            '<select class="care schimbă formularul"></select>' +
          '</li>' +
        '</ul>' +
      '</div>'
    );

    var $secţiune = app.$(
      '<ul>' +
        '<li>' +
          '<select id="denumire-cîmp" class="care schimbă formularul">' +
            '<option>text opţiune</option>' +
          '</select>' +
        '</li>' +
        '<li class="existente">alte cîmpuri existente</li>' +
        '<li class="existente">alte cîmpuri existente</li>' +
        '<li class="existente">alte cîmpuri existente</li>' +
      '</ul>'
    );

    var $select = $secţiune.find(app.SubsecţiuniDinamice.selector);

    app.SubsecţiuniDinamice.inserează.call($select[0]);
    // TODO: verifică că nu se focusează la populare şi iniţializare
    equal($secţiune.find('li.existente').length, 0, 'elimină cîmpurile existente de mai jos');
    equal($secţiune.find('li.adăugate').length, 3, 'adaugă cîmpurile din şablon');

    // TODO:
    //  - verifică generaea de eveniment “change” pe alte selecturi care schimbă formularul
    //  - verifică adăugarea de cîmpuri personalizate implicite
    //  - verifică focusarea primulul cîmp din cele adăugate

    // unstub
    app.$şabloane = app.$şabloaneOriginal;
  });


  test('SubsecţiuniDinamice.parseazăIncluderile', function() {
    ok(true, 'TODO');
  });

})();
