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
    ok(context._DEBITOR, '…defineşte _DEBITOR în context');
  });


  test('Încheiere.utilitare._DEBITOR', function () {
    var utilitare = window.Încheiere.utilitare;

    var context = {};

    equal(utilitare._DEBITOR(context), 'DEBITOR', '_DEBITOR == "DEBITOR" dacă nu sunt debitori în context');

    context = {
      debitori: [1]
    };
    equal(utilitare._DEBITOR(context), 'DEBITOR', '_DEBITOR == "DEBITOR" dacă este un singur debitor în context');

    context = {
      debitori: [1, 2, 3]
    };
    equal(utilitare._DEBITOR(context), 'DEBITORI', '_DEBITOR == "DEBITORI" dacă sunt mai mulţi debitori în context');
  });


  test('Încheiere.utilitare._DEBITORULUI', function () {
    var utilitare = window.Încheiere.utilitare;

    var context = {};

    equal(utilitare._DEBITORULUI(context), 'DEBITORULUI', '_DEBITORULUI == "DEBITORULUI" dacă nu sunt debitori în context');

    context = {
      debitori: [1]
    };
    equal(utilitare._DEBITORULUI(context), 'DEBITORULUI', '_DEBITORULUI == "DEBITORULUI" dacă este un singur debitor în context');

    context = {
      debitori: [1, 2, 3]
    };
    equal(utilitare._DEBITORULUI(context), 'DEBITORILOR', '_DEBITORULUI == "DEBITORILOR" dacă sunt mai mulţi debitori în context');
  });

})();
