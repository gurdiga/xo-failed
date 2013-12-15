(function() {
  'use strict';

  var app = window.frames['app'];


  module('js.js');

  test('e global', function() {
    ok('js' in app);
  });

  test('.assert', function() {
    var assert = app.js.assert, message;

    equal(assert.length, 2, 'accepta doi parametri: cerinţa şi mesajul');

    message = 'generează o eroare dacă nu se transmite şi mesajul';

    try {
      assert(true);
      ok(false, message);
    } catch(e) {
      ok(true, message);
      ok(app._.contains(e.message, 'js.assert'), 'eroarea generată conţine numele funcţiei');
    }

    message = 'descrierea cerinţei';

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


  test('.extend', function() {
    var extend = app.js.extend, message;

    message = 'fără parametri generează un AssertionError';

    try {
      extend();
      ok(false, message);
    } catch(e) {
      equal(e.name, 'AssertionError', 'eroarea e AssertionError');
      ok(true, message);
    }

    message = 'fără surce generează un AssertionError';

    try {
      extend({});
      ok(false, message);
    } catch(e) {
      equal(e.name, 'AssertionError', 'eroarea e AssertionError');
      ok(true, message);
    }

    deepEqual(
      extend({}, {a: 1}),
      {a: 1},
      'adaugă proprietăţile care nu există'
    );

    deepEqual(
      extend({a: 0}, {a: 1}),
      {a: 1},
      'înlocuieşte proprietăţile care există'
    );

    deepEqual(
      extend({a: {b: 1}}, {a: {c: 1}}),
      {a: {b: 1, c: 1}},
      'merge-uieşte proprietăţile PlainObject care există'
    );

    deepEqual(
      extend({a: {b: [0]}}, {a: {b: [1]}}),
      {a: {b: [1]}},
      'înlocuieşte proprietăţile non-PlainObject care există'
    );

    deepEqual(
      extend({a: 1}, {b: 2}, {c: 3}, {d: 4}),
      {a: 1, b: 2, c: 3, d: 4},
      'funcţionează cu mai multe surse'
    );
  });

})();
