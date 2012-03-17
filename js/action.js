var Action = {
  init: function() {
    ProcedurăNonPecuniară.init();

    $('fieldset')
      .autoSizeTextareas()
      .initTypedFieldsets()
      .adaugăŞoapteLaListeleFoarteLate()
      .urmăreşteSchimbările();

    DebitorFieldset.init();
    Valute.init();
    HashController.init();
  }
};

// --------------------------------------------------

var ProcedurăNonPecuniară = {
  init: function() {
    this.bunuri.init();

    $('#date-generale').on('change', '#obiect', this.inseareazăSauEliminăSubformular);
  },

  bunuri: {
    init: function() {
      $('#date-generale')
        .on('click', '#bunuri button.adaugă', this.adaugăCîmp)
        .on('click', '#bunuri button.elimină', this.eliminăCîmp)
        .on('iniţializat', function() { $('#obiect').trigger('change') });
    },

    adaugăCîmp: function() {
      var şablon = $('.şablon #bunuri .cîmp').first();

      şablon.clone()
        .insertAfter($('#bunuri .cîmp:last'))
        .find('textarea').focus();
    },

    eliminăCîmp: function() {
      $(this).closest('.cîmp')
        .find('.valoare').val(0).trigger('change').end()
        .remove();
    },
  },

  inseareazăSauEliminăSubformular: function() {
    var obiect = $(this),
        şablon = $('.şablon[title="' + obiect.val() + '"]');

    obiect.parent()
      .siblings('.subformular').remove().end()
      .after(şablon.html())
      .parent()
        .find('input,textarea').first().focus().end().end()
        .find('.subformular select.foarte.lat').trigger('iniţializează').end();
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
    $('div#procedură-nouă').on('click', 'button.elimină-debitor', function() {
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

  events: 'keydown keyup update paste change focus mouseup'
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

$.fn.adaugăŞoapteLaListeleFoarteLate = function() {
  return this
    .on('change', 'select.foarte.lat', function() {
      var lista = $(this),
          şoapta = lista.next('.şoaptă');

      şoapta.text(lista.val());
    })
    .on('iniţializează', 'select.foarte.lat', function() {
      var lista = $(this);

      $('<p>')
        .addClass('şoaptă')
        .css('margin-left', lista.prev('label').outerWidth(true))
        .insertAfter(lista);

      lista.trigger('change');
    })
    .find('select.foarte.lat').trigger('iniţializează').end();
};

// --------------------------------------------------

$.fn.există = function() {
  return this.length > 0;
}

// --------------------------------------------------

$.fn.urmăreşteSchimbările = function() {
  function mark() {
    $(this).attr('schimbat', '');
  }

  return this.on('keydown keyup update paste change', 'li input, li textarea, li select', mark);
}

// --------------------------------------------------

$.fn.initTypedFieldsets = function() {
  var selector = 'legend select';

  return this.filter('[data-şablon]')
    .on('change', selector, function() {
      var select = $(this),
          fieldset = select.closest('fieldset'),
          şablon = $('.şablon.' + fieldset.data('şablon') + '.' + select.val());

      if (fieldset.find('[schimbat]').există()) {
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
    })
    .find(selector).trigger('change').end()
    .trigger('iniţializat')
    .end();
};
