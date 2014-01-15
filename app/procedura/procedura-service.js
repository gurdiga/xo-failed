/*global FormularProcedură, FORMATUL_DATEI, moment */
(function() {
  'use strict';

  function Procedura(Storage, ObiectulUrmaririi, Utilizator) {
    Procedura.date = {};

    Procedura.defaults = {
      'obiectul-urmăririi': {
        optiuni: function() {
          return ObiectulUrmaririi.optiuni;
        }
      },

      noua: function() {
        return !this['numărul'];
      },

      titlu: function() {
        var titlu = $('a[href="#/procedura/' + this.gen + '"]').text();

        if (!this.noua()) {
          titlu += Utilizator.login + this.tip + '-' + this.numărul;
        }

        return titlu;
      }
    };


    Procedura.GENURI_ACCEPTATE = ['de-ordin-general', 'in-beneficiul-satului', 'pensie-de-intretinere'];

    Procedura.initializeaza = function(gen) {
      js.assert(js.isOneOf(gen, Procedura.GENURI_ACCEPTATE),
          'Procedura.initializeaza: gen trebuie să fie unul dintre: ' + Procedura.GENURI_ACCEPTATE.join(', ') + '. ' +
          '[' + gen + ']');

      console.debug('Procedura.initializeaza(' + gen + ')');

      delete Procedura.date['creditor'];
      delete Procedura.date['debitori'];
      delete Procedura.date['document-executoriu'];
      delete Procedura.date['obiectul-urmăririi'];
      delete Procedura.date['acţiuni'];

      js.extend(Procedura.date, Procedura.defaults, {
        'gen': gen,
        'data-intentării': moment().format(FORMATUL_DATEI),
        'creditor': {
          'gen-persoană': 'juridică'
        },
        'document-executoriu': {},
        'debitori': [{
          'gen-persoană': 'fizică'
        }],
        'obiectul-urmăririi': {
          'caracter': 'pecuniar',
          'sume': []
        },
        'acţiuni': []
      });

      console.debug('initializat:', Procedura.date);

      Efecte.afiseazaLin();
    };


    Procedura.deschide = function(numarul, callback) {
      js.assert(js.isNumber(numarul) && numarul > 0,
          'Procedura.deschide: numărul trebuie să fie număr pozitiv [' + numarul + ']');
      js.assert(js.isFunction(callback), 'Procedura.deschide: callback trebuie să fie funcţie [' + numarul + ']');

      Storage.get('proceduri/' + numarul + '/date.json', function(dateIncarcate) {
        console.debug('Încărcat procedura', numarul, dateIncarcate);

        js.extend(Procedura.date, dateIncarcate, {'numărul': numarul});
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

  Procedura.$inject = ['Storage', 'ObiectulUrmaririi', 'Utilizator'];

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
