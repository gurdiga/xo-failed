var Action = {
  init: function() {
    $('fieldset')
      .autoSizeTextareas()
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

      $('div.pagină:not(' + hash + ')').hide();
      $('div.pagină' + hash).show();
      $('textarea').trigger('change');
    }).trigger('hashchange');

    $('.deschide.pagină').on('click', function() {
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
        conţinutHeight = clone[0].scrollHeight,
        newHeight = conţinutHeight + paddingTop + paddingBottom;

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

    fieldset.find('>.conţinut').html(template.html());
  })
  .find('legend select').click().end()
  .end();
};
