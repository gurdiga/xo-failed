window.init = function (context) {
  /*jshint maxcomplexity:9 maxdepth:5*/
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
    var taxaB1 = context.app.Cheltuieli.item(context.procedură.cheltuieli.itemi, 'taxaB1');

    if (taxaB1) {
      var documenteExpediate = taxaB1.subformular,
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

  if (pentru['organele-de-poliţie']) {
    var organeleDePoliţie = context.app.Destinatari.$.find('.organele-de-poliţie').map(function() {
      return this.innerHTML;
    }).get();

    context.alţiDestinatari = context.alţiDestinatari.concat(organeleDePoliţie);
  }
};
