var Action = {
  init: function() {
    $('input.label[data-options]').initOptionsUI();
    $('input.autosize').autoSize().trigger('change');

    $('.template.extensible').makeExtensible();
    $('fieldset.typed').initTypedFieldsets();
    $('fieldset').initEditableLabels();

    $('.panel').initPanelsUI();

    $('textarea').autoResize({
      extraSpace: 20
    });

    $('button#new-file').on('click', function() {
      $('#new-file-panel').show();
    });

    $('[data-for]').on('click', function() {
      $('#' + $(this).data('for')).focus();
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

        input
          .autocomplete('option', 'source', input.options())
          .autocomplete('widget').find('li a')
            .setCssFrom(this, $.initOptionsUI.inheritedCss);
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
  },

  inheritedCss: [
    'color',
    'font-family',
    'font-size',
    'font-weight',
    'letter-spacing',
    'word-spacing',
    'line-height'
  ]
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
  sourceElement = $(sourceElement);

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

// --------------------------------------------------

$.makeExtensible = {
  fieldTemplates: 'select.extend.template',

  on: {
    button: {
      click: function() {
        var newField = $('.field.template[title="' + this.value + '"]').clone(),
            fieldList = $(this).closest('fieldset').find('ul');

        newField
          .removeClass('field template')
          .removeAttr('title')
          .appendTo(fieldList)
          .find('.label').focus();

        var label = newField.find('input.label'),
            input = newField.find('input:not(.label)'),
            id = $.makeExtensible.createId(label, fieldList.closest('fieldset'));

        label.attr('data-for', id);
        input.attr('id', id);
      }
    },

    'input.label': {
      change: function() {
        var label = $(this),
            input = label.next('input'),
            fieldset = label.closest('fieldset'),
            newId = $.makeExtensible.createId(label, fieldset);

        label.attr('data-for', newId);
        input.attr('id', newId);
      }
    }
  },

  createId: function(label, fieldset) {
    var id = label.val()
        .replace(/[^a-zăîşţâа-я0-9]/gi, '-')
        .replace(/-+/g, '-')
        .toLowerCase();

    var alreadyExisting = fieldset.find('[id^=' + id + ']').not(label).length;

    if (alreadyExisting > 0) {
      id += '-' + alreadyExisting;
    }

    return id;
  }
};

$.fn.makeExtensible = function() {
  $('fieldset').on('click', 'select.extend', $.makeExtensible.on.button.click);
  $('fieldset').on('change', 'input.label', $.makeExtensible.on['input.label'].change);

  return this.append(
    $($.makeExtensible.fieldTemplates).clone()
      .removeAttr('id')
      .removeClass('template')
      .addClass('extend')
  );
};

// --------------------------------------------------

$.initEditableLabels = {
  'input.label': {
    on: {
      keypress: function(e) {
        var label = $(this);

        if (e.which == 13) $('#' + label.data('for')).focus();
      }
    }
  }
};

$.fn.initEditableLabels = function() {
  return this.filter('fieldset')
    .on('keypress', 'input.label', $.initEditableLabels['input.label'].on.keypress);
};
