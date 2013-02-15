(function () {
  /*jshint maxlen:140 */
  'use strict';

  var app = window.frames['app'];


  module('Unit: /js/action.js', {
    setup: function () {
      app.$.fx.off = true;
    },
    teardown: function () {
      app.$.fx.off = false;
    }
  });


  test('Persoane', function () {
    ok('Persoane' in app, 'Persoane e publicat');
  });


  test('Persoane.adaugă() pentru creditor/persoană terţă', function () {
    var $fixture = app.$(
      '<div>' +
        '<fieldset id="ceva">' +
          '<legend><label>Ceva</label></legend>' +
          '<div class=".conţinut" style="color: blue">' +
            '<select id="gen-persoană"></select>' +
            '<input val="ceva"/>' +
            '<textarea>ceva</textarea>' +
          '</div>' +
        '</fieldset>' +
        '<button class="adaugă persoană terţă">+persoană terţă<span class="legend label">Text</span></button>' +
      '</div>'
    );

    var $butonDeAdăugare = $fixture.find('button'),
        declanşatEvenimentChange = false;

    $fixture.on('change', '#gen-persoană', function () {
      declanşatEvenimentChange = true;
    });

    app.Persoane.adaugă.call($butonDeAdăugare[0]);

    var $persoanaAdăugată = $butonDeAdăugare.prev('fieldset');

    equal($fixture.find('fieldset').length, 2, 'adăugat încă un fieldset mai sus de buton');
    ok($persoanaAdăugată.is('.persoană-terţă'), '…adăugat clasa “persoană-terţă”');
    ok(!$persoanaAdăugată.attr('id'), '…şters id-ul de pe el');
    ok(!$persoanaAdăugată.find('.conţinut').attr('style'), 'şters style de pe .conţinut');
    equal($persoanaAdăugată.find('input').val(), '', 'curăţat valoare din input');
    equal($persoanaAdăugată.find('textarea').val(), '', 'curăţat valoare din textarea');
    equal($persoanaAdăugată.find('legend label').text(), $butonDeAdăugare.find('.legend.label').text(), 'se actualizează titlul secţiunii');
    ok(declanşatEvenimentChange, 'generat eveniment artificial “change” pe select#gen-persoană');
    ok($persoanaAdăugată.is('.eliminabil.de.tot.dispensabilă'), '…adăugat clase “eliminabil de tot dispensabilă”');

    app.Persoane.adaugă.call($butonDeAdăugare[0]);

    equal($fixture.find('fieldset').length, 3, 'se adaugă încă o persoană la un alt click');
  });


  test('Persoane.adaugă() pentru debitori', function () {
    var $fixture = app.$(
      '<div>' +
        '<fieldset id="ceva">' +
          '<legend><label>Ceva</label></legend>' +
          '<div class=".conţinut" style="color: blue">' +
            '<select id="gen-persoană"></select>' +
            '<input val="ceva"/>' +
            '<textarea>ceva</textarea>' +
          '</div>' +
        '</fieldset>' +
        '<button class="adaugă persoană">+debitor</button>' +
      '</div>'
    );

    var $butonDeAdăugare = $fixture.find('button'),
        declanşatEvenimentChange = false;

    $fixture.on('change', '#gen-persoană', function () {
      declanşatEvenimentChange = true;
    });

    var titluSecţiunePersoană = $fixture.find('legend label').text();

    app.Persoane.adaugă.call($butonDeAdăugare[0]);

    var $persoanaAdăugată = $butonDeAdăugare.prev('fieldset');

    equal($fixture.find('fieldset').length, 2, 'adăugat încă un fieldset mai sus de buton');
    ok(!$persoanaAdăugată.is('.persoană-terţă'), '…NU adăugat clasa “persoană-terţă”');
    ok(!$persoanaAdăugată.attr('id'), '…şters id-ul de pe el');
    ok(!$persoanaAdăugată.find('.conţinut').attr('style'), 'şters style de pe .conţinut');
    equal($persoanaAdăugată.find('input').val(), '', 'curăţat valoare din input');
    equal($persoanaAdăugată.find('textarea').val(), '', 'curăţat valoare din textarea');
    equal($persoanaAdăugată.find('legend label').text(), titluSecţiunePersoană, 'se păstrează titlul secţiunii');
    ok(declanşatEvenimentChange, 'generat eveniment artificial “change” pe select#gen-persoană');
    ok($persoanaAdăugată.is('.eliminabil.de.tot.dispensabilă'), '…adăugat clase “eliminabil de tot dispensabilă”');

    app.Persoane.adaugă.call($butonDeAdăugare[0]);
    app.Persoane.adaugă.call($butonDeAdăugare[0]);
    app.Persoane.adaugă.call($butonDeAdăugare[0]);

    equal($fixture.find('fieldset').length, 2 + 3, 'se adaugă încă o persoană la fiecare click următor');
  });

})();
