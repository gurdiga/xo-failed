var Action = {
  init: function() {
    $('input.label[data-options]').initOptionsUI();
    $('fieldset.typed').initTypedFieldsets();
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
        var input = $(this);

        input.autocomplete('option', 'source', input.options())

        if (input.hasClass('autosize')) input.autoSize();
      },

      select: function() {
        $.initOptionsUI.on.focus.call(this);
      },

      close: function() {
        $(this).trigger('change');
      }
    }
  },

  autocomplete: {
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
        delay: $.initOptionsUI.autocomplete.delay,
        minLength: $.initOptionsUI.autocomplete.minLength,
        create: $.initOptionsUI.on.autocomplete.create,
        select: $.initOptionsUI.on.autocomplete.select,
        close: $.initOptionsUI.on.autocomplete.close
      })
      .attr('spellcheck', 'false')

    input
      .val(input.options(0))
      .trigger('change');

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

// --------------------------------------------------

$.fn.autoSize = function(options) {
  var defaults = {
    padding: 0
  };

  options = $.extend(defaults, options);

  return this.filter('input:text').on('keyup keydown blur update change', function() {
    var input = $(this),
        temp = $('#autoSize-temp');

    if (temp.length == 0) {
      temp = $('<span id="autoSize-temp"/>')
        .css({
          'padding-left': options.padding,
          'position': 'absolute',
          'visibility': 'hidden'
        })
        .appendTo('body');
    }

    temp
      .text(input.val())
      .setCssFrom(input, [
        'font-size',
        'font-weight',
        'font-family',
        'letter-spacing'
      ]);

    input.width(temp.outerWidth());
  });
};

// --------------------------------------------------

$.fn.setCssFrom = function(sourceElement, properties) {
  return this.each(function() {
    var element = $(this),
        property;

    for (var i = 0; i < properties.length; i++) {
      property = properties[i];
      element.css(property, sourceElement.css(property));
    }
  });
};

// --------------------------------------------------

$.fn.initTypedFieldsets = function() {
  return this.filter('fieldset.typed').on('click', 'legend select', function() {
    var select = $(this),
        fieldset = select.closest('fieldset'),
        template = $('.' + fieldset.data('template') + '.template[title="' + select.val() + '"]');

    fieldset.find('>.content').html(template.html());
  }).find('legend select').click().end;
};
