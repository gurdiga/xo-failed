/*global FormularProcedură, FORMATUL_DATEI, moment */
(function() {
  'use strict';

  function Procedura(Storage, ObiectulUrmaririi) {
    Procedura.date = {
      'optiuni-obiectul-urmaririi': ObiectulUrmaririi.optiuni // TODO: de transformat în funcţie ca să nu se colecteze?
    };


    Procedura.GENURI_ACCEPTATE = ['de-ordin-general', 'in-beneficiul-satului', 'pensie-de-intretinere'];

    Procedura.initializeaza = function(gen) {
      js.assert(js.isOneOf(gen, Procedura.GENURI_ACCEPTATE),
          'Procedura.initializeaza: gen trebuie să fie unul dintre: ' + Procedura.GENURI_ACCEPTATE.join(', ') + '. ' +
          '[' + gen + ']');

      js.extend(Procedura.date, {
        'data-intentării': moment().format(FORMATUL_DATEI),
        'creditor': {
          'gen-persoană': 'juridică'
        },
        'debitori': [{
          'gen-persoană': 'fizică'
        }]
      });

      //
      // TODO
      //

      Efecte.afiseazaLin();

      return [gen];
    };


    Procedura.deschide = function(numarul, callback) {
      js.assert(js.isNumber(numarul), 'Procedura.deschide: numărul trebuie să fie număr [' + numarul + ']');
      js.assert(js.isFunction(callback), 'Procedura.deschide: callback trebuie să fie funcţie [' + numarul + ']');

      Storage.get('proceduri/' + numarul + '/date.json', function(dateIncarcate) {
        js.debug('Încărcat procedura', Procedura.date);

        $.extend(Procedura.date, dateIncarcate, {'numărul': numarul});
        callback();
      });

      Efecte.afiseazaLin();
    };


    Procedura.inchide = function () {
      location.hash = '';
      Efecte.ascundeLin();
    };

    return Procedura;
  }

  Procedura.$inject = ['Storage', 'ObiectulUrmaririi'];

  window.App.service('Procedura', Procedura);
  window.App.module.S.Procedura = Procedura;


  var Efecte = {
    milisecunde: function() {
      if (FormularProcedură.$.is('[duration-milliseconds]')) {
        return parseFloat(FormularProcedură.$.attr('duration-milliseconds'));
      } else {
        var transitionProperty = FormularProcedură.$.css('transition'),
            transitionDuration = transitionProperty.match(/((\d+)|(\.\d+)|(\d+\.\d+))s/)[1],
            transitionMilliseconds = transitionDuration * 1000;

        FormularProcedură.$.attr('duration-milliseconds', transitionMilliseconds);

        return transitionMilliseconds;
      }
    },

    // --------------------------------------------------

    afiseazaLin: function(callback) {
      FormularProcedură.$
        .css('top', $(window).height())
        .show()
        .addClass('înainte-de-afişare');

      setTimeout(function() {
        FormularProcedură.$.addClass('afişat');

        setTimeout(function() {
          FormularProcedură.$
            .removeAttr('style')
            .removeClass('înainte-de-afişare');

          if (callback) callback();
        }, Efecte.milisecunde());
      }, 0);
    },

    // --------------------------------------------------

    ascundeLin: function() {
      FormularProcedură.$
        .addClass('înainte-de-afişare')
        .css('top', $(window).height())
        .removeClass('afişat');

      setTimeout(function() {
        FormularProcedură.$.hide();
      }, Efecte.milisecunde());
    }
  };

})();
