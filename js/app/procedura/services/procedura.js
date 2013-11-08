/*global FormularProcedură*/
(function() {
  'use strict';

  function ServiceProcedura(Utilizator, Persistence) {
    var date = {};

    return {
      date: date,

      deschide: function(numărul, callback) {
        Persistence.get('/date/' + Utilizator.login + '/proceduri/' + numărul + '/date.json', function(dateÎncărcate) {
          $.extend(date, dateÎncărcate, {numărul: numărul});
          window.console.log(date);
          callback();
        });

        Efecte.afişeazăLin();
      },


      închide: function() {
        location.hash = '';
        Efecte.ascundeLin();
      }
    };
  }

  ServiceProcedura.$inject = ['Utilizator', 'Persistence'];

  window.App.service('ServiceProcedura', ServiceProcedura);


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

    afişeazăLin: function(callback) {
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
