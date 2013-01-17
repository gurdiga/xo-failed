// <![CDATA[  prevent tidy from compaining about unescaped && which is a JS operator
(function () {
  'use strict';

  window.init = function (context) {
    var amînări = context.procedură['obiectul-urmăririi']['amînări'];

    context.amînată = amînări.length > 0;

    if (context.amînată) {
      var ultimaAmînare = amînări[amînări.length - 1];

      for (var etichetă in ultimaAmînare) {
        context.ultimaAmînare = ultimaAmînare[etichetă];
      }
    }
  };
})();
// ]]>
