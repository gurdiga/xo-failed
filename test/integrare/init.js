(function() {
  'use strict';

  var random = (new Date()).getTime();

  module('Integrare', {
    setup: function() {
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
          'instanţa-de-judecată': app.Profil.date['instanţă-teritorială'],
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
      this.app.PAUZA_DE_OBSERVABILITATE = 500;

      this.$dataIntentării = app.FormularProcedură.$.find('#data-intentării');
      this.$creditor = app.FormularProcedură.$.find('#creditor');
      this.$debitor = app.FormularProcedură.$.find('.debitor');
      this.$de = app.FormularProcedură.$.find('#document-executoriu');
      this.$obiectulUrmăririi = app.FormularProcedură.$obiectulUrmăririi;
    }
  });
})();
