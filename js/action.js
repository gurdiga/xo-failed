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
    Salvează.init();
    Cheltuieli.init();
    EticheteAccesibilePentruBife.init();
    Eliminabile.init();

    $('fieldset:first').find('input, select, textarea').first().focus();
    $('#literă').text(HashController.date() || '');

    switch (HashController.date()) {
      case 'S':
        $('#caracter').val('pecuniar');
        $('#creditor .gen-persoană').val('juridică');
        break;
      case 'P':
        $('#caracter').val('pecuniar');
        $('#creditor .gen-persoană').val('fizică');
        break;
    }
  }
};

// --------------------------------------------------

var EticheteAccesibilePentruBife = {
  init: function() {
    $(document).on('click', 'input:checkbox+label', function() {
      $(this).prev().click();
    });
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
        .on('click', '.bunuri button.adaugă', this.adaugăCîmp)
        .on('iniţializat', function() { $('#obiect').trigger('change', ['automat']) });
    },

    adaugăCîmp: function() {
      var şablon = $('.şablon .bunuri .cîmp').first();

      şablon.clone()
        .insertBefore($(this).parent())
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
        var lista = $(this),
            mesaj = 'aplicarea sechestrului pe bunurile sau pe sumele'
              + ' de bani ale debitorului, inclusiv pe cele care'
              + ' se află la alte persoane';

        if (lista.val() == mesaj) {
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
    if (!$.isEmptyObject(RateBNM)) return;

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

// --------------------------------------------------

var Salvează = {
  init: function() {
    $('#procedură button.salvează').on('click', function() {
      var date = {}, cîmpuri = [
        'label + select',
        'label + input',
        'label + textarea'
      ].join(', ');

      $('#procedură').find('fieldset').each(function() {
        var nume = $(this).find('legend label').text();

        date[nume] = [];
        // TODO
        // toate fieldset-urile trebuie să fie în div.coloană?
      });
    });
  }
};

// --------------------------------------------------

var Cheltuieli = {
  init: function() {
    this.initListaCategoriiTaxeŞiSpeze();
    this.initSubformulare();
    this.initDocumenteAdresabile();
  },

  initListaCategoriiTaxeŞiSpeze: function() {
    var listaCategorii = $('#categorii-taxe-şi-speze'),
        lista = $('#listă-taxe-şi-speze');

    listaCategorii.on('click', '.categorie ol>li', function() {
      if ($(this).is('.dezactivat')) return;

      var item = $(this).clone(),
          subformular = item.data('şablon-subformular');

      if (subformular) {
        item.append(
          $('.şablon.subformular[title="' + subformular + '"]').clone()
            .removeClass('şablon')
            .removeAttr('title')
        );
      }

      lista.append(item);
      item
        .addClass('eliminabil de tot')
        .find('textarea').focus();

      $(this).closest('.conţinut').hide();
    });

    $('#cheltuieli')
      .on('mouseenter', '#categorii-taxe-şi-speze .categorie', function() {
        $(this).find('.conţinut').afişează();

        var itemiUniciAdăugaţiDeja = lista.children('.item.unic'),
            itemi = $(this).find('.conţinut ol').children();

        if (itemiUniciAdăugaţiDeja.există()) {
          var selector = itemiUniciAdăugaţiDeja.map(function() {
            return '#' + this.id;
          }).get().join(',');

          itemi.filter(selector)
            .addClass('dezactivat')
            .attr('title', 'Adăugat deja');
        } else {
          itemi
            .removeClass('dezactivat')
            .removeAttr('title');
        }
      })
      .on('mouseleave', '#categorii-taxe-şi-speze .categorie', function() {
        $(this).find('.conţinut').ascunde();
      })
  },

  initSubformulare: function() {
    $('#cheltuieli')
      .on('click', 'button.adaugă', function() {
        var numeŞablon = $(this).closest('.item').data('şablon-subformular'),
            şablon = $('.şablon.subformular[title="' + numeŞablon + '"] .document').first();

        şablon.clone()
          .insertBefore($(this).parent())
          .find('textarea').focus();
      });
  },

  initDocumenteAdresabile: function() {
    var listaDestinatari = $('.şablon.destinatari');

    $('#cheltuieli')
      .on('click', ':checkbox.pentru.expediere', function() {
        $(this)
          .siblings('.adaugă-destinatar').toggle(!this.checked).end()
          .siblings('.destinatari-adăugaţi').toggle(!this.checked).end();
      })

      .on('click', '.destinatari-adăugaţi', function(e) {
        var listă = $(this);

        if (e.target == this) listă.toggleClass('comprimaţi')

        e.stopPropagation();
      })

      .on('mouseenter', '.adaugă-destinatar', function() {
        listaDestinatari.appendTo(this).afişează();
      })
      .on('mouseleave', '.adaugă-destinatar', function() {
        listaDestinatari.ascunde();
      })

      .on('mouseenter', '.document .destinatari .categorie', function() {
        $(this).find('.listă').afişează();

        var destinatariAdăugaţiDeja = $(this).closest('.document').find('.destinatari-adăugaţi li'),
            destinatari = $(this).find('.listă').children();

        if (destinatariAdăugaţiDeja.există()) {
          var selector = destinatariAdăugaţiDeja.map(function() {
            return ':contains("' + $(this).text() + '")';
          }).get().join(',');

          destinatari
            .removeClass('dezactivat')
            .filter(selector)
              .addClass('dezactivat')
              .attr('title', 'Adăugat deja');
        } else {
          destinatari
            .removeClass('dezactivat')
            .removeAttr('title');
        }
      })
      .on('mouseleave', '.document .destinatari .categorie', function() {
        $(this).find('.listă').ascunde();
      })

      .on('click', '.categorie .titlu .toate', function() {
        var destinatari = $(this).closest('.categorie'),
            adăugaţiDeja = $(this).closest('.document').find('.destinatari-adăugaţi li').map(function() {
              return ':contains("' + $(this).text() + '")';
            }).get().join(',');

        destinatari.find('li').not(adăugaţiDeja).trigger('click');
      })

      .on('click', '.listă li', function() {
        var destinatariAdăugaţiDeja = $(this).closest('.document').find('.destinatari-adăugaţi');

        $(this).clone()
          .addClass('eliminabil de tot')
          .appendTo(destinatariAdăugaţiDeja);

        listaDestinatari.hide();
      });
  }
};

// --------------------------------------------------

var Eliminabile = {
  buton: null,

  init: function() {
    this.buton = $('button.şablon.elimină')
      .removeClass('şablon')
      .css('display', 'inline-block')
      .hide()
      .on('click', this.elimină);

    $('#procedură')
      .on('mousemove', '.eliminabil', this.afişeazăButon)
      .on('mouseleave', '.eliminabil', this.ascundeButon);
  },

  afişeazăButon: function(e) {
    e.stopPropagation();

    if ($(this).is('cu buton')) return;

    var elementeBloc = $(this).children(':block'),
        buton = Eliminabile.buton;

    if (elementeBloc.există()) {
      buton.insertBefore(elementeBloc.first());
    } else {
      buton.appendTo(this);
    }

    buton.show();
    $(this).addClass('cu buton');
  },

  ascundeButon: function() {
    $(this).removeClass('cu buton');
    Eliminabile.buton
      .hide()
      .appendTo(document.body);
  },

  elimină: function() {
    var eliminabil = Eliminabile.buton.parent();

    Eliminabile.buton
      .hide()
      .appendTo(document.body);

    if (eliminabil.is('.eliminabil.de.tot') || eliminabil.siblings('.eliminabil').există()) {
      eliminabil
        .find('.valoare').val(0).trigger('change').end()
        .remove();
    } else {
      eliminabil
        .find('.valoare').val(0).trigger('change').end()
        .find('textarea').val('');
    }
  }
};

// --------------------------------------------------

$.expr[':'].block = function(el, i, matches, nodes) {
  return $.css(el, 'display') == 'block';
}

// --------------------------------------------------

$.fn.ascunde = function() {
  return this.clearQueue().hide();
};

// --------------------------------------------------

$.fn.afişează = function() {
  return this.delay(200).fadeIn(0);
};
