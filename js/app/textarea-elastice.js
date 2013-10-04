/*global FormularProcedură*/
(function() {
  'use strict';

  window.TextareaElastice = {
    evenimente: 'keydown keyup input focus mouseup',

    init: function() {
      FormularProcedură.$
        .attr('spellcheck', 'false')
        .on(this.evenimente, 'textarea', this.autodimensionează);
    },

    autodimensionează: function() {
      var textarea = $(this);

      if (textarea.is(':not(:visible)')) return;

      var clone = textarea.clone()
        .css({
          'padding': 0,
          'border-width': 0,
          'visibility': 'hidden',
          'position': 'absolute',
          'height': textarea.css('min-height')
        })
        .val(textarea.val())
        .insertBefore(textarea);

      textarea.css('height', clone[0].scrollHeight);
      clone.remove();
    }
  };

})();
