/*global FormularProcedură*/
(function() {
  'use strict';
  /*jshint maxparams:4*/

  // Too many parameters per function (4). -- is this a sign that this thing is doing too much?
  function Procedura(Utilizator, Persistence, ActiuniProcedurale, ObiectulUrmaririi) {
    var date = {
      'login': Utilizator.login,
      'actiuni': ActiuniProcedurale,
      'optiuni-obiectul-urmaririi': ObiectulUrmaririi.optiuni
    };

    return {
      date: date,

      deschide: function(numarul, callback) {
        Persistence.get('/date/' + Utilizator.login + '/proceduri/' + numarul + '/date.json', function(dateIncarcate) {
          $.extend(date, dateIncarcate, {'numărul': numarul});
          window.console.log(date);
          callback();
        });

        Efecte.afiseazaLin();
      },


      inchide: function() {
        location.hash = '';
        Efecte.ascundeLin();
      }
    };
  }

  Procedura.$inject = ['Utilizator', 'Persistence', 'ActiuniProcedurale', 'ObiectulUrmaririi'];

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
