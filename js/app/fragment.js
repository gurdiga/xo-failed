/*global Handlebars*/
(function() {
  'use strict';

  var Fragment = function(identificator) {
    if (!identificator) throw new Error('Fragment: constructorul necesită un identificator');

    var $script = găseşte$Fragment(identificator);

    if (!$script.există()) throw new Error('Fragment: nu există framgment cu ID-ul ' + identificator);

    // --------------------
    this.html = $script.html();

    // --------------------
    this.compilează = function(date) {
      $.extend(date, $(this.html, {}).data());

      return Handlebars.compile(this.html)(date);
    };
  };

  // --------------------
  Fragment.există = function(identificator) {
    return găseşte$Fragment(identificator).există();
  };

  // --------------------
  function găseşte$Fragment(identificator) {
    return $('script[type^="text/x-fragment"]#' + identificator);
  }


  window.Fragment = Fragment;

})();
