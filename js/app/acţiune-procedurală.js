/*global moment FORMATUL_DATEI Fragment Calendar*/
(function() {
  'use strict';

  var PREFIX_FRAGMENTE = 'acţiune-procedurală-';

  var AcţiuneProcedurală = function(identificator, date) {
    date = date || {};

    var dataCurentă = moment(Date.now()).format(FORMATUL_DATEI);

    date['data'] = date['data'] || dataCurentă;

    var fragment = new Fragment(PREFIX_FRAGMENTE + identificator),
        html = fragment.compilează(date);

    // --------------------
    this.propunere = function() {
      var descriere = $(html).find('.descriere').text();

      return {
        descriere: descriere,
        identificator: identificator
      };
    };

    // --------------------
    this.adaugăLa = function($container) {
      var $html = $(html);

      Calendar.insereazăButoane($html);
      $container
        .trigger('înainte-de.adăugare-acţiune', [$html])
        .append($html)
        .trigger('după.adăugare-acţiune', [$html]);
    };

    // --------------------
    this.areStructuraCorespunzătoare = function() {
      /*jshint maxcomplexity:5*/
      var $html = $(html),
          lipsuri = [];

      if (!$html.is('[acţiune="' + identificator + '"]')) lipsuri.push('nu are atributul “acţiune”');

      var componente = {
        '[secţiune="dată"]': 'secţiunea cu dată',
        '[secţiune="conţinut"]': 'secţiunea cu conţinut',
        '.descriere': 'descrierea',
        '.document.ico': 'butonaşele pentru încheiere'
        // TODO: de determinat ce componente trebuie să existe pentru fiecare acţiune
        // şi de verificat prezenţa lor:
      }, selector, descriere;

      for (selector in componente) {
        descriere = componente[selector];

        if (!$html.find(selector).există()) lipsuri.push('lipseşte ' + descriere);
      }

      return lipsuri.length > 0 ? lipsuri : true;
    };
  };

  // --------------------
  AcţiuneProcedurală.există = function(identificator) {
    return Fragment.există(PREFIX_FRAGMENTE + identificator);
  };

  window.AcţiuneProcedurală = AcţiuneProcedurală;

})();
