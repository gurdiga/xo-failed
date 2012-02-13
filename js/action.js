var Action = {
  init: function() {
    $('input.label[data-options]').initOptionsUI();
    $('fieldset').initFieldsetsUI();
    $('.panel').initPanelsUI();

    $('button#new-file').button({
      icons: {
        primary: 'ui-icon-circle-plus'
      }
    }).click(function() {
      $('#new-file-panel').show();
    });
  }
};

// --------------------------------------------------

$.fn.options = function(index) {
  var options = this.filter('[data-options]').data('options').split('|');

  return index === undefined ? options : options[index];
};

// --------------------------------------------------

$.initOptionsUI = {
  on: {
    keypress: function() {
      return false;
    },

    click: function() {
      var input = $(this);

      if (input.autocomplete('widget').is(':not(:visible)')) {
        $(this).autocomplete('search', '');
      } else {
        $(this).autocomplete('close');
      }
    },

    focus: function() {
      var associatedFieldId = $(this).data('for');

      if (associatedFieldId) {
        $('#' + associatedFieldId).focus();
      } else {
        $(this).blur();
      }
    },

    autocomplete: {
      create: function() {
        $(this).autocomplete('option', 'source', $(this).options());
      },

      select: function() {
        $.initOptionsUI.on.focus.call(this);
      }
    }
  },

  autocomplete: {
    autoFocus: true,
    delay: 0,
    minLength: 0
  }
};

// --------------------------------------------------

$.fn.initOptionsUI = function() {
  return this.filter('input[data-options]').each(function() {
    var input = $(this);

    input
      .addClass('with options')
      .autocomplete({
        autoFocus: $.initOptionsUI.autocomplete.autoFocus,
        delay: $.initOptionsUI.autocomplete.delay,
        minLength: $.initOptionsUI.autocomplete.minLength,
        create: $.initOptionsUI.on.autocomplete.create,
        select: $.initOptionsUI.on.autocomplete.select
      })
      .attr('spellcheck', 'false')
      .val(function() {
        return $(this).options(0);
      });

    $.each($.initOptionsUI.on, function(event, handler) {
      if ($.isFunction(handler)) {
        input.on(event, handler);
      } else {
        $.each(handler, function(event, handler) {
          input.on(event, handler);
        });
      }
    });
  });
};

// --------------------------------------------------

$.initFieldsetsUI = {
  on: {
    legend: {
      click: function() {
        $(this).closest('fieldset').toggleClass('collapsed');
      }
    }
  }
};

$.fn.initFieldsetsUI = function() {
  return this.filter('fieldset')
    .on('click', 'legend', $.initFieldsetsUI.on.legend.click);
};

// --------------------------------------------------

$.initPanelsUI = {
  closeButtonSelector: '.close-panel',
  on: {
    closeButton: {
      click: function() {
        $(this).closest('.panel').hide();
      }
    }
  }
};

$.fn.initPanelsUI = function() {
  return this.on('click', $.initPanelsUI.closeButtonSelector, $.initPanelsUI.on.closeButton.click);
};
// http://stackoverflow.com/questions/931207/is-there-a-jquery-autogrow-plugin-for-text-fields
