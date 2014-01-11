/*global FormularProcedură*/
(function() {
  'use strict';

  var SelecturiFoarteLate = {
    init: function() {
      FormularProcedură.$
        .on('change', 'select.foarte.lat', this.afişeazăŞoaptă)
        .find('select.foarte.lat').trigger('change').end()
        .on('change', 'select.care.schimbă.formularul', this.afişeazăŞoaptePentruSelecturileUrmătoare);
    },

    afişeazăŞoaptă: function() {
      var $select = $(this);

      $select.next('.şoaptă').remove();

      if ($select.find('option:selected').is('.scurtă')) return;

      $('<p>')
        .insertAfter($select)
        .hide()
        .slideDown()
        .text($select.find('option:selected').text())
        .addClass('şoaptă');
    },

    afişeazăŞoaptePentruSelecturileUrmătoare: function() {
      $(this).closest('li')
        .nextAll().find('select.foarte.lat').trigger('change');
    }
  };

  window.SelecturiFoarteLate = SelecturiFoarteLate;

})();
