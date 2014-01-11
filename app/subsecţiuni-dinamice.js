/*global FormularProcedură*/
(function() {
  'use strict';

  var SubsecţiuniDinamice = {
    selector: 'select.care.schimbă.formularul',

    init: function() {
      FormularProcedură.$.on('change', this.selector, this.inserează);
    },

    inserează: function() {
      var $select = $(this),
          selectorŞablon = '.' + $select.attr('id') + '.conţinut[title="' + $select.val() + '"]',
          şablon = SubsecţiuniDinamice.parseazăIncluderile(window.$şabloane.find(selectorŞablon).html()),
          $item = $select.closest('li'),
          $subformular;

      $item.nextAll().remove();
      $item.after(şablon).hide().slideDown();

      $subformular = $item.nextAll();
      $subformular.find(SubsecţiuniDinamice.selector).trigger('change');

      if (FormularProcedură.seIniţializează) return;

      $subformular
        .find(':input:not(' + SubsecţiuniDinamice.selector + ')').first().focus().end().end()
        .find('.adaugă-cîmp-personalizat.implicit').click();

      $select.trigger('inserat-subsecţiune');
    },

    parseazăIncluderile: function(html) {
      if (!html) return html;

      return html.replace(/<!-- include (.*?) -->/g, function(match, selector) {
        return window.$şabloane.find(selector).html();
      });
    }
  };

  window.SubsecţiuniDinamice = SubsecţiuniDinamice;

})();
