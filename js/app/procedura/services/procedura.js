/*global FormularProcedură*/ // TODO: get rid if this?
(function() {
  'use strict';

  function Procedura(Storage, ObiectulUrmaririi) {
    var date = {
      'optiuni-obiectul-urmaririi': ObiectulUrmaririi.optiuni
    };


    function deschide(numarul, callback) {
      Storage.get('proceduri/' + numarul + '/date.json', function(dateIncarcate) {
        $.extend(date, dateIncarcate, {'numărul': numarul});
        window.console.log(date);
        callback();
      });

      Efecte.afiseazaLin();
    }


    function inchide() {
      location.hash = '';
      Efecte.ascundeLin();
    }


    return {
      date: date,
      deschide: deschide,
      inchide: inchide
    };
  }

  Procedura.$inject = ['Storage', 'ObiectulUrmaririi'];

  window.App.service('Procedura', Procedura);


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
