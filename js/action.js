var Action = {
  init: function() {
    ExtendButtons.init();

    $('input.label[data-options]').initOptionsUI();
    $('fieldset')
      .autoSizeInputs()
      .autoSizeTextareas()
      .filter('.typed')
        .initTypedFieldsets();

    DebitorFieldset.init();
    HashController.init();
  }
};

// --------------------------------------------------

var DebitorFieldset = {
  init: function() {
    this.initAdd();
    this.initDelete();
  },

  initAdd: function() {
    $('#adaugă-debitor').on('click', function() {
      var fieldset = $(this).prev();

      fieldset.clone()
        .find('li:has(.label)').remove().end()
        .find('input,textarea').val('').end()
        .insertAfter(fieldset);

      $(this).parent().find('fieldset').addClass('dispensabil');
    });
  },

  initDelete: function() {
    $('div#procedură-nouă').on('click', 'button.şterge-debitor', function() {
      var button = $(this),
          acestDebitor = button.closest('fieldset');
          ceilalţiDebitori = acestDebitor.siblings('fieldset');

      acestDebitor.remove();
      ceilalţiDebitori.toggleClass('dispensabil', ceilalţiDebitori.length > 1);
    });
  }
};

// --------------------------------------------------

var HashController = {
  init: function() {
    $(window).on('hashchange', function() {
      var hash = location.hash;

      if (hash == '' || hash == '#') hash = '#index';

      $('.pages:not(' + hash + ')').hide();
      $('.pages' + hash).show();
    }).trigger('hashchange');

    $('.action').on('click', function() {
      location.hash = this.id;
    });
  }
};

// --------------------------------------------------

$.autoResize = {
  options: {
    extraSpace: 20
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
  }).end();
};

// --------------------------------------------------

$.autoSizeInputs = {
  defaults: {
    padding: 5,
    minWidth: '50px',
    selector: 'input:text.autosize'
  },

  events: 'keydown keyup update paste change'
};

$.fn.autoSizeInputs = function(options) {
  options = $.extend($.autoSizeInputs.defaults, options);

  return this.on($.autoSizeInputs.events, options.selector, function() {
    var input = $(this),
        temp = $('#autosize-temp');

    if (temp.length == 0) {
      temp = $('<span id="autosize-temp"/>')
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

$.autoSizeTextareas = {
  defaults: {
    minHeight: 60, //px
    selector: 'textarea.autosize'
  },

  events: 'keydown keyup update paste change'
};

$.fn.autoSizeTextareas = function(options) {
  options = $.extend($.autoSizeTextareas.defaults, options);

  return this.on($.autoSizeTextareas.events, options.selector, function() {
    var textarea = $(this);

    if (textarea.is(':not(:visible)')) return;

    var clone = textarea.css('overflow', 'hidden').clone()
      .css({
        visibility: 'hidden',
        position: 'absolute',
        height: options.minHeight
      })
      .val(textarea.val())
      .insertBefore(textarea);

    var paddingTop = parseInt(clone.css('padding-top')),
        paddingBottom = parseInt(clone.css('padding-bottom')),
        contentHeight = clone[0].scrollHeight,
        newHeight = contentHeight - paddingTop - paddingBottom;

    clone.remove();
    textarea.height(Math.max(newHeight, options.minHeight));
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
        template = $('.template.' + fieldset.data('template') + '.' + select.val());

    fieldset.find('>.content').html(template.html());
  })
  .find('legend select').click().end()
  .end();
};

// --------------------------------------------------

var ExtendButtons = {
  init: function() {
    $('div#procedură-nouă').on('click', 'fieldset select.extend', ExtendButtons.on.select);

    ExtendButtons.add();
  },

  add: function() {
    var button = $('select.extend.template');

    $('.extensible.template').append(
      button.clone().removeClass('template')
    );
  },

  on: {
    select: function() {
      if ($(this).val() == '') return;

      var newField = $('.field.template.' + this.value).clone(),
          fieldList = $(this).closest('fieldset').find('ul');

      newField
        .removeClass('field template')
        .appendTo(fieldList)
        .find('.label').focus();

      var label = newField.find('input.label'),
          input = label.next();

      $(this).val('');
    },
  }
};

// --------------------------------------------------

var EditableLabels = {
  init: function() {
    $('div#procedură-nouă').on('keypress', 'input.label', this.keypress)
  },

  keypress: function(e) {
    var label = $(this);

    if (e.which == 13) label.next().focus();
  }
};
