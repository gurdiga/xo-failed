(function () {
  'use strict';

  var random = (new Date()).getTime();

  module('Integrare', {
    setup: function () {
      var app = window.frames['app'];
      var dateProcedură = {
        'data-intentării': app.moment().format(app.FORMATUL_DATEI),
        'creditor': {
          'denumire': 'CREDITOR SRL',
          'idno': random,
          'sediu': 'Moldova ON-LINE\nbd. Internetului 33\net. 55, of. 1'
        },
        'debitori': [{
          'nume': 'Debitor CUTĂRESCU',
          'idnp': random,
          'data-naşterii': '10.10.1970'
        }],
        'document-executoriu': {
          'instanţa-de-judecată': app.Profil.date['instanţa-teritorială'],
          'numărul-de': '1234B/53',
          'data-hotărîrii': '06.06.2006',
          'dispozitivul': 'Cras a pharetra enim. In non lectus nulla,' +
            ' ut vehicula enim. Phasellus fermentum orci quis urna luctus tempus.' +
            ' Nullam tempor nulla id lectus volutpat sit amet ultricies nisi ultricies.',
          'data-rămînerii-definitive': '06.07.2006'
        },
        'obiectul-urmăririi': {
          'sume': {
            'Suma de bază': 1000,
            'Datorie adăugătoare': 600
          }
        },
        'cheltuieli': {
          'onorariu': 500 // implicit
        }
      };

      this.app = app;
      this.dateProcedură = dateProcedură;

      this.$dataIntentării = app.Procedura.$.find('#data-intentării'),
      this.$creditor = app.Procedura.$.find('#creditor'),
      this.$debitor = app.Procedura.$.find('.debitor'),
      this.$de = app.Procedura.$.find('#document-executoriu'),
      this.$obiectulUrmăririi = app.Procedura.$obiectulUrmăririi;
    }
  });
})();
