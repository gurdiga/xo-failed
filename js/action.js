var Action = {
  init: function() {
    $('fieldset')
      .autoSizeTextareas()
      .initTypedFieldsets()
      .watchChanges();

    DebitorFieldset.init();
    ProcedurăNonPecuniară.init();
    Valute.init();
    HashController.init();

    if ($.browser.msie) {
      // TODO: fix select width
    }
  }
};

// --------------------------------------------------

var ProcedurăNonPecuniară = {
  init: function() {
    this.bunuri.init();
  },

  bunuri: {
    obiecteAferente: {
      'efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri mobile': '',
      'efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri imobile': '',
    },

    init: function() {
      $('#date-generale')
        .on('change', '#obiect', this.ascundeSauAratăFormular)
        .on('change', '#obiect', this.seteazăŞoaptă)
        .on('click', '#bunuri button.adaugă', this.adaugăCîmp)
        .on('click', '#bunuri button.şterge', this.ştergeCîmp);
    },

    adaugăCîmp: function() {
      $('.şablon.bunuri ol li:first').clone()
        .insertBefore($(this).parent())
        .find('textarea').focus();
    },

    ştergeCîmp: function() {
      $(this).parent().remove();
    },

    seteazăŞoaptă: function() {
      var select = $(this);

      select.attr('title', select.val());
    },

    ascundeSauAratăFormular: function() {
      var obiect = $(this).val();

      if (obiect in ProcedurăNonPecuniară.bunuri.obiecteAferente) {
        ProcedurăNonPecuniară.bunuri.aratăFormular();
      } else {
        ProcedurăNonPecuniară.bunuri.ascundeFormular();
      }
    },

    aratăFormular: function() {
      $('#obiect').parent().after($('.bunuri.şablon').html());
    },

    ascundeFormular: function() {
      $('#obiect').parent().next('#bunuri').remove();
    }
  }
};

// --------------------------------------------------

var Valute = {
  init: function() {
    var şablon = $('.valuta.şablon').html();

    $('ul .valuta').html(şablon);
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
      document.title = $('div.pagină' + hash + ' h1').text();
    }).trigger('hashchange');

    $('.deschide.pagină').on('click', function() {
      location.hash = this.id;
    });
  }
};

// --------------------------------------------------

$.autoSizeTextareas = {
  defaults: {
    selector: 'textarea'
  },

  events: 'keydown keyup update paste change focus'
};

$.fn.autoSizeTextareas = function(options) {
  options = $.extend($.autoSizeTextareas.defaults, options);

  return this.on($.autoSizeTextareas.events, options.selector, function() {
    var textarea = $(this);

    if (textarea.is(':not(:visible)')) return;

    var clone = textarea.css('overflow', 'hidden').clone()
      .css({
        'padding': 0,
        'border-width': 0,
        'visibility': 'hidden',
        'position': 'absolute',
        'height': textarea.css('min-height')
      })
      .val(textarea.val())
      .insertBefore(textarea);

    textarea.css('height', clone[0].scrollHeight);
    clone.remove();
  });
};

// --------------------------------------------------

$.fn.exist = function() {
  return this.length > 0;
}

// --------------------------------------------------

$.fn.watchChanges = function() {
  function mark() {
    $(this).attr('changed', '');
  }

  return this.on('keydown keyup update paste change', 'li input, li textarea, li select', mark);
}

// --------------------------------------------------

$.fn.initTypedFieldsets = function() {
  var select = 'legend select';

  return this.filter('[data-şablon]')
    .on({
      'change': function() {
        var select = $(this),
            fieldset = select.closest('fieldset'),
            şablon = $('.şablon.' + fieldset.data('şablon') + '.' + select.val());

        if (fieldset.find('[changed]').exist()) {
          var titlu = fieldset.find('legend label').text();

          if (titlu.indexOf(':') > -1) titlu = titlu.split(':')[0];

          var atenţionare =
            'Această schimbare presupune pierderea datelor din secţiunea [' + titlu + '].\n\n' +
            'Sunteţi sigur?';

          if (!confirm(atenţionare)) {
            select.val(select.data('initial-value'));
            return false;
          }
        };

        fieldset.find('>.conţinut').html(şablon.html());
      }
    }, select)
    .find(select).trigger('change').end()
    .end();
};
