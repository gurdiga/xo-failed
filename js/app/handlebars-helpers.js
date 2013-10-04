/*global top:false jQuery:false Handlebars:false Fragment:false */
(function($) {
  'use strict';

  var HandlebarsHelpers = {
    'include': function(numeFragmentParţial, opţiuni) {
      var date = opţiuni.hash,
          contextCurent = this;

      date = $.extend(date, contextCurent);

      if ('fn' in opţiuni) date['yield'] = opţiuni.fn(date);

      return new Handlebars.SafeString(
        (new Fragment(numeFragmentParţial)).compilează(date)
      );
    }
  };

  $.each(HandlebarsHelpers, function(nume, cod) {
    Handlebars.registerHelper(nume, cod);
  });

  if ('QUnit' in top) {
    window.HandlebarsHelpers = HandlebarsHelpers;
  }

})(jQuery);
