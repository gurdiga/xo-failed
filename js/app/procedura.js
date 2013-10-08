(function() {
  'use strict';

  var Procedura = {
    date: {
      'data-intentării': '12'
    },

    deschide: function(număr) {
      Procedura.incarca(număr);
      Efecte.afişeazăLin();
    },

    închide: function() {
      Efecte.ascundeLin();
    },

    incarca: function(număr) {
      $.get('/date/007/proceduri/' + număr + '/date.json', function(data) {
        $.extend(Procedura.date, data);
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


  window.App.Procedura = Procedura;

})();
