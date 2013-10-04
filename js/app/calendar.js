/*global RE_FORMATUL_DATEI FORMATUL_DATEI moment*/
(function() {
  'use strict';

  var Calendar = {
    opţiuni: {
      dateFormat: 'dd.mm.yy',
      dayNamesMin: 'Du Lu Ma Mi Jo Vi Sî Du'.split(' '),
      monthNames: 'Ianuarie Februarie Martie Aprilie Mai Iunie' +
        'Iulie August Septembrie Octombrie Noiembrie Decembrie'.split(' '),
      monthNamesShort: 'Ian Feb Mar Apr Mai Iun Iul Aug Sep Oct Noi Dec'.split(' '),
      firstDay: 1,
      showAnim: 'fadeIn',
      prevText: 'Luna precedentă',
      nextText: 'Luna viitoare',
      showOn: 'none',
      changeMonth: true,
      changeYear: true,
      yearRange: 'c-60:c+10',
      onSelect: function() { Calendar.închide(this); },
      beforeShow: function() { Calendar.veziDacăMaiECeva(this); }
    },

    init: function() {
      this.insereazăButoane();

      $(document)
        .on('click', 'input.dată+.ui-icon-calendar', this.afişează);
    },

    închide: function(el) {
      el = $(el);

      if (el.attr('data-id')) el.attr('id', el.attr('data-id'));

      el.datepicker('destroy').focus().trigger('input');

      if (el.attr('data-ceva')) el.val(el.val() + el.attr('data-ceva'));
    },

    // dacă în cîmpul pentru dată mai este ceva, de exemplu ora, memorizează
    // pentru a repopula după ce se selectează ceva din calendar
    veziDacăMaiECeva: function(input) {
      var valoarea = input.value;

      if (valoarea.length === 10) return; // este introdusă doar data

      $(input).attr('data-ceva', valoarea.substr(10));
    },

    insereazăButoane: function(container) {
      container = container || document.body;

      var buton = $('<span>')
        .addClass('ui-icon ui-icon-calendar semiascuns')
        .attr('title', 'Calendar');

      $('input.dată', container).after(buton);
    },

    afişează: function() {
      /*jshint maxcomplexity:6*/
      var cîmp = $(this).prev(),
          calendar = cîmp.datepicker('widget');

      if (calendar.is(':visible')) {
        cîmp.datepicker('destroy');
      } else {
        if (!cîmp.attr('data-datepicker')) {
          if (cîmp.attr('id')) {
            cîmp
              .attr('data-id', cîmp.attr('id'))
              .removeAttr('id');
          }

          cîmp.datepicker(Calendar.opţiuni);

          if (cîmp.is('.dată.sfîrşit.perioadă')) {
            var începutPerioadă = cîmp.siblings('.început.perioadă');

            începutPerioadă = $.trim(începutPerioadă.val());

            if (RE_FORMATUL_DATEI.test(începutPerioadă)) {
              var minDate = moment(începutPerioadă, FORMATUL_DATEI).add('days', 1).toDate();

              cîmp.datepicker('option', 'minDate', minDate);
            }
          }
        }

        cîmp.datepicker('show');
      }
    }
  };

  window.Calendar = Calendar;

})();
