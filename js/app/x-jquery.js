/*global $, RateBNM */
(function() {
  'use strict';

  // --------------------------------------------------

  $.extend($.expr[':'], {

    'focused': function(element) {
      return element === element.ownerDocument.activeElement;
    }

  });

  // --------------------------------------------------

  $.extend($.fn, {

    'există': function() {
      return this.length > 0;
    },


    'ascunde': function() {
      return this.stop(true, true).fadeOut(function() {
        $(this).trigger('ascundere');
      });
    },


    'afişează': function() {
      return this.delay(200).fadeIn(function() {
        $(this).trigger('afişare');
      });
    },


    'val1': function(value) {
      if (typeof value !== 'undefined') {
        if (this.is(':checkbox')) {
          return this.prop('checked', value === true);
        } else {
          return this.val(value);
        }
      }

      return this.is(':checkbox') ? this.is(':checked') : this.val();
    },


    'suma': function() {
      var suma = 0;

      this.filter('input').each(function() {
        /*jshint maxcomplexity:5*/
        var cîmp = $(this),
            existăValoare = $.trim(cîmp.val()) !== '';


        if ($.isNumeric(cîmp.val()) && cîmp.val() >= 0) {
          if (cîmp.is('.invalid')) cîmp.removeClass('invalid');

          if (cîmp.next().is('.valuta') && cîmp.next('.valuta').val() !== 'MDL') {
            var valuta = cîmp.next('.valuta').val(),
                rataBNM = RateBNM[valuta];

            suma += this.value * rataBNM.value / rataBNM.nominal;
          } else {
            suma += parseFloat(this.value);
          }
        } else {
          if (existăValoare) cîmp.addClass('invalid');
        }
      });

      return parseFloat(suma.toFixed(2));
    }

  });

  // --------------------------------------------------

  $.extend($, {

    'reEscape': function(re) {
      return re.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
    },


    'put': function(url, data) {
      return $.ajax({
        type: 'PUT',
        url: url,
        data: data
      });
    }

  });

})();
