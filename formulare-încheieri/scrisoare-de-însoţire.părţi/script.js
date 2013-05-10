window.init = function (context) {
  /*jshint maxcomplexity:7*/
  'use strict';

  var destinatari = context.buton.attr('destinatari').split(' '),
      pentru = {};

  for (var k = 0; k < destinatari.length; k++) {
    pentru[destinatari[k]] = true;
  }

  context.pentru = pentru;

  context.debitori = pentru['debitori'] ? context.procedură['debitori'] : [];
  context.persoaneTerţe = pentru['persoane-terţe'] ? context.procedură['persoane-terţe'] : [];
  context.alţiDestinatari = [];

  if (pentru['alţi-destinatari']) {
    if ('taxaB1' in context.procedură['cheltuieli'].itemi) {
      var documenteExpediate = context.procedură['cheltuieli'].itemi['taxaB1'].subformular,
          colecţie, i, j;

      for (i = 0; i < documenteExpediate.length; i++) {
        colecţie = documenteExpediate[i]['destinatari'];

        for (j = 0; j < colecţie.length; j++) {
          if (colecţie[j] === 'Creditorul') continue;
          if (colecţie[j] === 'Debitorul') continue;

          context.alţiDestinatari.push(colecţie[j].replace(/ (\S+),/, '<br/>$1,'));
        }

        context.alţiDestinatari = context.alţiDestinatari.concat(
          documenteExpediate[i]['destinatari-persoane-terţe']
        );
      }
    }
  }
};
