// <![CDATA[  prevent tidy from compaining about unescaped && which is a JS operator
(function () {
  /*jshint maxlen:253*/
  'use strict';

  window.init = function (context) {
    var variaţii = {
      'aplicarea sechestrului pe bunurile sau pe sumele de bani ale debitorului, inclusiv pe cele care se află la alte persoane': 'aplicarea sechestrului',
      'interzicerea debitorului de a săvîrşi anumite acţiuni': 'interzicerea debitorului de a săvîrşi anumite acţiuni',
      'interzicerea altor persoane de a săvîrşi anumite acţiuni în privinţa obiectului în litigiu, inclusiv transmiterea de bunuri către debitor sau îndeplinirea unor alte obligaţii faţă de el': 'interzicerea altor persoane de a săvîrşi anumite acţiuni'
    };

    context.variaţie = variaţii[context.app.FormularProcedură.$obiectulUrmăririi.find('#măsura-de-asigurare').val()];

    if (context.variaţie === 'aplicarea sechestrului') {
      context.valoareaAcţiunii = context.procedură['obiectul-urmăririi']['valoarea-acţiunii'];
      context.cuSpecificare = !context.valoareaAcţiunii;
      context.fărăSpecificare = !context.cuSpecificare;

      if (context.cuSpecificare) {
        context.bunuriSechestrate = context.procedură['obiectul-urmăririi']['bunuri-sechestrate'];
        context.sumeSechestrate = context.procedură['obiectul-urmăririi']['sume-sechestrate'];
      }
    } else {
      context.acţiuni = context.procedură['obiectul-urmăririi']['acţiuni'];

      if (context.variaţie === 'interzicerea altor persoane de a săvîrşi anumite acţiuni') {
        context.bunuriÎnLitigiu = context.procedură['obiectul-urmăririi']['bunuri-în-litigiu'];
      }
    }
  };

})();
