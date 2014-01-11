/*global Fragment, Handlebars, AcţiuneProcedurală */
(function() {
  'use strict';

  var FRAGMENT_PROPUNERE = new Fragment('opţiuni-acţiune-procedurală');

  var AcţiuniProcedurale = {
    $: $('#acţiuni-procedurale .itemi'),
    $opţiuni: $('#acţiuni-procedurale .opţiuni'),

    opţiuni: {
      '': ['intentare', 'intentare-cu-asigurare'],
      'intentare': ['continuare', 'încetare'],
      'intentare-cu-asigurare': ['continuare', 'încetare'],
      'continuare': [],
      'încetare': []
    },

    // --------------------
    init: function() {
      this.înregistreazăFragmenteParţiale();
      this.efecte.init();

      this.$opţiuni.on('click', '.propunere', this.adaugă);
      this.$.parent().on('eliminat-item', this.elimină);

      this.propuneAcţiunileUrmătoare();
    },

    // --------------------
    înregistreazăFragmenteParţiale: function() {
      $('script[type="text/x-fragment"]').each(function() {
        Handlebars.registerPartial(this.id, this.innerText);
      });
    },

    // --------------------
    efecte: {
      init: function() {
        AcţiuniProcedurale.$
          .on('înainte-de.adăugare-acţiune', this.ascunde)
          .on('după.adăugare-acţiune', this.afişează);
      },

      // --------------------
      ascunde: function(e, $element) {
        $element.hide();
      },

      // --------------------
      afişează: function(e, $element) {
        $element.slideDown();
      }
    },

    // --------------------
    propuneAcţiunileUrmătoare: function() {
      var identificatori = AcţiuniProcedurale.opţiuni[AcţiuniProcedurale.ceaMaiRecentă()];

      var opţiuni = identificatori.map(function(identificatorAcţiune) {
        var acţiune = new AcţiuneProcedurală(identificatorAcţiune);

        return acţiune.propunere();
      });

      AcţiuniProcedurale.$opţiuni
        .html(
          FRAGMENT_PROPUNERE.compilează({ opţiuni: opţiuni })
        )
        .hide()
        .slideDown();
    },

    // --------------------
    eliminăOpţiuni: function() {
      AcţiuniProcedurale.$opţiuni.find('.propunere').remove();
    },

    // --------------------
    ceaMaiRecentă: function() {
      return this.$.find('[acţiune]:last').attr('acţiune') || '';
    },

    // --------------------
    adaugă: function() {
      var identificator = $(this).attr('identificator'),
          acţiune = new AcţiuneProcedurală(identificator);

      acţiune.adaugăLa(AcţiuniProcedurale.$);
      AcţiuniProcedurale.ajusteazăEliminabilitate();
      AcţiuniProcedurale.actualizeazăOpţiunile();
    },

    // --------------------
    elimină: function() {
      AcţiuniProcedurale.ajusteazăEliminabilitate();
      AcţiuniProcedurale.propuneAcţiunileUrmătoare();
    },

    // --------------------
    ajusteazăEliminabilitate: function() {
      var itemi = AcţiuniProcedurale.$.find('[acţiune]');

      itemi.not(':last').removeClass('eliminabil de tot');
      itemi.last().addClass('eliminabil de tot');
    },

    // --------------------
    actualizeazăOpţiunile: function() {
      this.eliminăOpţiunileCurente();
      this.propuneAcţiunileUrmătoare();
    },

    // --------------------
    eliminăOpţiunileCurente: function() {
      this.$opţiuni.find('.propunere').remove();
    }

  };

  window.AcţiuniProcedurale = AcţiuniProcedurale;

})();
