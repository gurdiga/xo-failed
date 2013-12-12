(function() {
  'use strict';

  var app = window.frames['app'];


  module('js.js');

  test('e global', function() {
    ok('js' in app);
  });

  test('.assert', function() {
    var assert = app.js.assert;

    equal(assert.length, 2, 'accepta doi parametri: cerinţa şi mesajul');

    var message = 'descrierea cerinţei';

    try {
      app.js.assert(false, message);
      ok(false, 'genereaza eroare dacă cerinţa nu este îndeplinită');
    } catch(e) {
      ok(true, 'genereaza eroare dacă cerinţa nu este îndeplinită');
      equal(e.message, message, 'mesajul erorii corespunde cu mesajul cerinţei');
    }

    app.js.assert(true, message);
    ok(true, 'nu genereaza eroare dacă cerinţa este îndeplinită');
  });


  test('.isNumber', function() {
    var isNumber = app.js.isNumber;

    ok(isNumber(1), 'număr întreg pozitiv');
    ok(isNumber('1'), 'număr întreg pozitiv ca string');
    ok(isNumber('+1'), 'număr întreg explicit pozitiv ca string');

    ok(isNumber(-1), 'număr întreg negativ');
    ok(isNumber('-1'), 'număr întreg negativ ca string');

    ok(isNumber(3.14), 'număr fracţionar pozitiv');
    ok(isNumber('3.14'), 'număr fracţionar pozitiv ca string');

    ok(isNumber(-3.14), 'număr fracţionar negativ');
    ok(isNumber('-3.14'), 'număr fracţionar negativ ca string');

    ok(isNumber('0x20'), 'hex');
    ok(isNumber('314e-2'), 'notaţia cu exponent');

    ok(!isNumber('1,2'), 'fracţie cu virgulă');
    ok(!isNumber('-'), 'minus');
    ok(!isNumber('+'), 'plus');
    ok(!isNumber('aa'), 'aa');
  });

})();
