(function () {
  'use strict';

  module('Unit: /js/încheiere.js');


  test('Încheiere.utilitare', function () {
    var utilitare = window.Încheiere.utilitare;

    ok(utilitare, 'acem Încheiere.utilitare');

    ok($.isFunction(utilitare.init), 'avem metoda de iniţializare: init');
    equal(utilitare.init.length, 1, '…care acceptă un parametru (context)');
  });


  test('Încheiere.utilitare.init', function () {
    var utilitare = window.Încheiere.utilitare;

    var context = {};

    utilitare.init(context);
    ok(context.DEBITOR, '…defineşte DEBITOR în context');
  });


  test('Încheiere.utilitare.DEBITOR', function () {
    var utilitare = window.Încheiere.utilitare;

    var context = {};

    equal(utilitare.DEBITOR(context), 'DEBITOR', 'DEBITOR == "DEBITOR" dacă nu sunt debitori în context');

    context = {
      debitori: [1]
    };
    equal(utilitare.DEBITOR(context), 'DEBITOR', 'DEBITOR == "DEBITOR" dacă este un singur debitor în context');

    context = {
      debitori: [1, 2, 3]
    };
    equal(utilitare.DEBITOR(context), 'DEBITORI', 'DEBITOR == "DEBITORI" dacă sunt mai mulţi debitori în context');
  });

})();
