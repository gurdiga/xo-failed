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
    ok(context.text, 'publică funcţia text în context');
  });


  test('Încheiere.utilitare.text', function () {
    var utilitare = window.Încheiere.utilitare;

    equal(utilitare.text('PRIMA sau A DOUA', [1]), 'PRIMA', 'întoarce prima opţiune dacă e un singur item');
    equal(utilitare.text('PRIMA sau A DOUA', [1, 2]), 'A DOUA', 'întoarce a doua opţiune dacă e sunt mai mulţi itemi');
  });


  test('Încheiere.utilitare.selecteazăAtenţionare', function () {
    var utilitare = window.Încheiere.utilitare,
        span = document.createElement('span');

    ok($.isFunction(utilitare.selecteazăAtenţionare), 'este definită');

    span.innerText = 'text to select';
    document.body.appendChild(span);
    utilitare.selecteazăAtenţionare.call(span);

    equal(document.getSelection().getRangeAt(0).toString(), span.innerText, 'selectează elementul');
    document.body.removeChild(span);
  });

})();
