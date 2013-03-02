// <![CDATA[  prevent tidy from compaining about unescaped && which is a JS operator
(function () {
  'use strict';

  window.init = function (context) {
    context.valoareaAcţiunii = context.procedură['obiectul-urmăririi']['valoarea-acţiunii'];
    context.cuSpecificare = !context.valoareaAcţiunii;
    context.fărăSpecificare = !context.cuSpecificare;

    if (context.cuSpecificare) {
      context.bunuriSechestrate = context.procedură['obiectul-urmăririi']['bunuri-sechestrate'];
      context.sumeSechestrate = context.procedură['obiectul-urmăririi']['sume-sechestrate'];
    }
  };

})();
