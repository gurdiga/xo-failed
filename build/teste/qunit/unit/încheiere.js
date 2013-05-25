(function() {
  'use strict';

  module('Unit: /js/încheiere.js');


  test('Încheiere.utilitare', function() {
    var utilitare = window.Încheiere.utilitare;

    ok(utilitare, 'acem Încheiere.utilitare');

    ok($.isFunction(utilitare.init), 'avem metoda de iniţializare: init');
    equal(utilitare.init.length, 1, '…care acceptă un parametru (context)');
  });


  test('Încheiere.utilitare.init', function() {
    var utilitare = window.Încheiere.utilitare;

    var context = {};

    utilitare.init(context);
    ok(context.text, 'publică funcţia text în context');
    ok(context.normalizeazăSpaţii, 'publică funcţia normalizeazăSpaţii în context');
  });


  test('Încheiere.utilitare.text', function() {
    var utilitare = window.Încheiere.utilitare;

    equal(utilitare.text('PRIMA sau A DOUA', [1]), 'PRIMA', 'întoarce prima opţiune dacă e un singur item');
    equal(utilitare.text('PRIMA sau A DOUA', [1, 2]), 'A DOUA', 'întoarce a doua opţiune dacă e sunt mai mulţi itemi');
  });


  test('Încheiere.utilitare.selecteazăAtenţionare', function() {
    var utilitare = window.Încheiere.utilitare,
        span = document.createElement('span');

    ok($.isFunction(utilitare.selecteazăAtenţionare), 'este definită');

    span.innerText = 'text to select';
    span.className = 'atenţionare';
    document.body.appendChild(span);
    utilitare.selecteazăAtenţionare.call(span);

    equal(document.getSelection().getRangeAt(0).toString(), span.innerText, 'selectează elementul');
    ok(!span.className, 'elimină clasa “atenţionare”');
    document.body.removeChild(span);
  });


  test('Încheiere.utilitare.normalizeazăSpaţii', function() {
    /*jshint quotmark:false */
    var utilitare = window.Încheiere.utilitare,
        text = "   Un text luat cu $.fn.text()\n    \t  care trebuie normalizat.\n    ",
        rezultat = 'Un text luat cu $.fn.text() care trebuie normalizat.';

    equal(utilitare.normalizeazăSpaţii(text), rezultat, 'eliminat whitespace care nu e necesar');
  });

})();
