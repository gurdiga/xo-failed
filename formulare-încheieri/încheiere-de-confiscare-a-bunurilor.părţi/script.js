// <![CDATA[  prevent tidy from compaining about unescaped && which is a JS operator
(function () {
  'use strict';

  window.init = function (context) {
    var $secţiune = context.app.FormularProcedură.$obiectulUrmăririi;
    var amînări = $secţiune.find('.personalizat.amînare').map(function () {
      var amînare = {},
          $li = context.app.$(this);

      amînare[$li.find('.etichetă').val()] = $li.find('.dată.amînare').val();

      return amînare;
    }).get();

    context.amînată = amînări.length > 0;

    if (context.amînată) {
      var ultimaAmînare = amînări[amînări.length - 1];

      for (var etichetă in ultimaAmînare) {
        context.ultimaAmînare = ultimaAmînare[etichetă];
      }
    }

    context.bunuri = context.procedură['obiectul-urmăririi']['bunuri-confiscate'];
  };
})();
// ]]>
