window.init = function (context) {
  'use strict';

  context.debitori = context.procedură['debitori'];
  context.persoaneTerţe = context.procedură['persoane-terţe'];
  context.alţiDestinatari = [];

  if ('taxaB1' in context.procedură['cheltuieli'].itemi) {
    var documenteExpediate = context.procedură['cheltuieli'].itemi['taxaB1'].subformular,
        destinatari, i, j;

    context.alţiDestinatari = [];

    for (i = 0; i < documenteExpediate.length; i++) {
      context.alţiDestinatari = context.alţiDestinatari.concat(
        documenteExpediate[i]['destinatari'],
        documenteExpediate[i]['destinatari-persoane-terţe']
      );
    }
  }
  console.log(context.alţiDestinatari);
};
