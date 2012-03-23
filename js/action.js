var Action = {
  init: function() {
    HashController.init();
  },

  '#index': function() {
    $('#index input').focus();
  },

  '#procedură': function() {
    $('[schimbat]').removeAttr('schimbat');

    ProcedurăNonPecuniară.init();
    FormulareŞablon.init();
    Schimbări.urmăreşte();
    CîmpuriTextarea.autodimensionează();
    ListeFoarteLate.seteazăŞoapte();
    AdăugarePersoane.init();
    Valute.init();

    $('#literă').text(HashController.date() || '');

    $('fieldset:first').find('input, select, textarea').first().focus();
  }
};

// --------------------------------------------------

var ProcedurăNonPecuniară = {
  init: function() {
    this.bunuri.init();
    this['măsura-de-asigurare'].init();

    $('#date-generale').on('change', '#obiect', this.inseareazăSauEliminăSubformular);
  },

  bunuri: {
    init: function() {
      $('#date-generale')
        .on('click', '#bunuri button.adaugă', this.adaugăCîmp)
        .on('click', '#bunuri button.elimină', this.eliminăCîmp)
        .on('iniţializat', function() { $('#obiect').trigger('change', ['automat']) });
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
    }
  },

  'măsura-de-asigurare': {
    init: function() {
      $('#date-generale').on('change', '#măsura-de-asigurare', function() {
        var lista = $(this);

        if (lista.val() == 'aplicarea sechestrului pe bunurile sau pe sumele de bani ale debitorului, inclusiv pe cele care se află la alte persoane') {
          lista.parent()
            .after($('.şablon[title="' + lista.val() + '"]').html())
            .next().find('.sumă').focus();
        } else {
          lista.parent().next('#valoarea-acţiunii').remove();
        }
      });
    }
  },

  inseareazăSauEliminăSubformular: function() {
    var obiect = $(this),
        şablon = $('.şablon[title="' + obiect.val() + '"]');

    obiect.parent()
      .siblings('.subformular').remove().end()
      .after(şablon.html())
      .parent()
        .find('input,textarea').first().focus();
  }
};

// --------------------------------------------------

var RateBNM = {};

var Valute = {
  init: function() {
    this.populeazăListe();
    this.încarcăRateBNM();
  },

  populeazăListe: function() {
    var şablon = $('.valuta.şablon').html();

    $('ul .valuta').html(şablon);
  },

  încarcăRateBNM: function() {
    $.getJSON('/rate-bnm/current.json', function(data) {
      RateBNM = data;
    });
  }
};

// --------------------------------------------------

var AdăugarePersoane = {
  init: function() {
    this.initAdăugare();
    this.initŞtergere();
  },

  initAdăugare: function() {
    $('#procedură').on('click', 'button.adaugă-persoană', function() {
      var buton = $(this),
          fieldset = buton.prev();

      fieldset.clone()
        .removeAttr('id')
        .find('input, textarea').val('').end()
        .find('legend label').text(function(i, text) {
          if (buton.find('.legend.label').există()) {
            return buton.find('.legend.label').text();
          } else {
            return text;
          }
        }).end()
        .insertAfter(fieldset);

      buton.siblings('fieldset').addClass('dispensabilă');
    });
  },

  initŞtergere: function() {
    $('#procedură').on('click', 'button.elimină-persoană', function() {
      var button = $(this),
          aceastăPersoană = button.closest('fieldset');
          celelaltePersoane = aceastăPersoană.siblings('fieldset');

      aceastăPersoană.remove();
      celelaltePersoane.toggleClass('dispensabilă', celelaltePersoane.length > 1);
    });
  }
};

// --------------------------------------------------

var HashController = {
  init: function() {
    $(window).on('hashchange', function() {
      var id = HashController.id();

      $('div.pagină:not(' + id + ')').hide();
      $('div.pagină' + id).show();

      if (Action[id]) Action[id]();

      document.title = $('div.pagină' + id + ' h1').text();
    }).trigger('hashchange');
  },

  hash: function() {
    var hash = location.hash;

    if (hash == '' || hash == '#') hash = '#index';

    return hash;
  },

  id: function() {
    return this.hash().split('?')[0];
  },

  date: function() {
    return this.hash().split('?')[1];
  }
};

// --------------------------------------------------

var CîmpuriTextarea = {
  selector: 'textarea',
  evenimente: 'keydown keyup update paste change focus mouseup',

  autodimensionează: function() {
    $('#procedură').on(this.evenimente, this.selector, function() {
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
  }
};

// --------------------------------------------------

var ListeFoarteLate = {
  seteazăŞoapte: function() {
    $('#procedură')
      .on('change', 'select.foarte.lat', function() {
        var lista = $(this);

        lista.next('.şoaptă').remove();

        $('<p>')
          .insertAfter(lista)
          .text(lista.val())
          .addClass('şoaptă');
      })
      .find('select.foarte.lat').trigger('change', ['automat']).end()
      .on('change', 'select.care.schimbă.formularul', function(e, tip) {
        $(this).closest('fieldset')
          .find('select.foarte.lat')
            .not(function() {return $(this).next().is('.şoaptă')})
            .trigger('change', ['automat']);
      });
  }
};

// --------------------------------------------------

$.fn.există = function() {
  return this.length > 0;
}

// --------------------------------------------------

var Schimbări = {
  selector: [
    'fieldset li input',
    'fieldset li textarea',
    'fieldset li select'
  ].join(', '),

  evenimente: 'keydown keyup update paste change',

  urmăreşte: function() {
    $('#procedură').on(Schimbări.evenimente, Schimbări.selector, function (e, tip) {
      if (tip == 'automat') return;

      $(this).attr('schimbat', '');
    });
  }
};

// --------------------------------------------------

var FormulareŞablon = {
  selector: 'fieldset[data-şablon]',

  init: function() {
    var selectorLista = FormulareŞablon.selector + ' legend select';

    $('#procedură').on('change', selectorLista, function() {
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
    .find(FormulareŞablon.selector)
      .trigger('iniţializat')
      .find('legend select').trigger('change', ['automat']).end()
    .end();
  }
};
