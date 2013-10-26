/*global FormularProcedură*/
(function() {
  'use strict';

  var Procedura = {
    procedura: {},

    totalSume: function(sume) {
      return _.reduce(sume, function(total, item) {
        var suma = parseFloat(item.suma);

        if (_.isNaN(suma)) suma = 0;

        return total + suma;
      }, 0);
    },

    deschide: function(număr) {
      Procedura.incarca(număr);
      Efecte.afişeazăLin();
    },

    închide: function() {
      Efecte.ascundeLin();
    },

    incarca: function(numărul) {
      $.get('/date/007/proceduri/' + numărul + '/date.json', function(date) {
        $.extend(Procedura.procedura, date, {numărul: numărul});
        window.console.log(Procedura.procedura);
        Procedura.sync();
      });
    }
  };


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


    afişeazăLin: function(callback) {
      FormularProcedură.$
        .css('top', $(window).height())
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


    ascundeLin: function() {
      FormularProcedură.$
        .addClass('înainte-de-afişare')
        .css('top', $(window).height())
        .removeClass('afişat');
    }
  };


  window.App.Controllers.Procedura = Procedura;

})();
