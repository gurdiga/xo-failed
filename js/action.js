var Action = {
  init: function() {
    HashController.init();

    ProcedurăNonPecuniară.init();
    FormulareŞablon.init();
    Schimbări.urmăreşte();
    CîmpuriTextarea.autodimensionează();
    ListeFoarteLate.seteazăŞoapte();
    AdăugarePersoane.init();
    Cheltuieli.init();
    EticheteAccesibilePentruBife.init();
    Eliminabile.init();
    Salvează.init();
  },

  '#index': function() {
    $('#index input').focus();
  },

  '#procedură': function() {
    $('[schimbat]').removeAttr('schimbat');
  }
};

// --------------------------------------------------

var EticheteAccesibilePentruBife = {
  init: function() {
    $('#procedură').on('click', 'input:checkbox+label', function() {
      $(this).prev('input:checkbox').trigger('click', 'programat');
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
        .on('click', 'button.adaugă', this.adaugăCîmp)
        .on('iniţializat', function() { $('#obiect').trigger('change', ['automat']) });
    },

    adaugăCîmp: function() {
      var şablon = $(this).parent().prev();

      şablon.clone()
        .insertBefore($(this).parent())
        .find('textarea,input')
          .val('')
          .first().focus();
    }
  },

  'măsura-de-asigurare': {
    init: function() {
      $('#date-generale').on('change', '#măsura-de-asigurare', function() {
        var lista = $(this);

        if (lista.val() == 'sechestru') {
          lista.parent()
            .after($('.şablon[title="' + lista.val() + '"]').html())
            .next().find('.sumă').focus();
        } else {
          lista.parent().next('.subformular').remove();
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
  },

  populeazăListe: function() {
    var şablon = $('.valuta.şablon').html();

    $('ul .valuta').html(şablon);
  },

  încarcăRateBNM: function() {
    return $.getJSON('/rate-bnm/current.json', function(data) {
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
    $('#procedură').on('click', 'button.adaugă.persoană', function() {
      var buton = $(this),
          fieldset = buton.prev();

      fieldset.clone()
        .removeAttr('id')
        .find('input, textarea').val('').end()
        .find('legend label').text(function(i, text) {
          if (buton.find('.legend.label').există()) {
            $(this).closest('fieldset').addClass('persoană-terţă');

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

      Business.init();

      document.title = $('div.pagină' + id + ' h1').contents(':not(button)').text();
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

      var clone = textarea.clone()
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
          .text(lista.find('option:selected').text())
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
    var procedură = {};

    // -----
    function colectează(secţiune) {
      var $secţiune = $(secţiune),
          colecţie = {};

      $secţiune.find('label+:input, .label+:input').each(function() {
        var $input = $(this),
            $label = $input.prev();

        if ($label.is('.label')) {
          if (!$label.val() && !$input.val()) return;
          if (!colecţie.subformular) colecţie.subformular = {};

          colecţie.subformular[$label.val()] = $input.val();
        } else {
          colecţie[$input.attr('id')] = $input.is(':checkbox') ? $input.is(':checked') : $input.val();
        }
      });

      procedură[secţiune] = colecţie;
    }


    // -----
    function colecteazăCheltuieli() {
      var $secţiune = $('#cheltuieli');

      function valoare(selector) {
        var $input = $secţiune.find(selector);

        return $input.is(':checkbox') ? $input.is(':checked') : $input.val();
      }

      procedură.cheltuieli = {
        'onorariu': valoare('#onorariu'),
        'părţile-au-ajuns-la-conciliere': valoare('#părţile-au-ajuns-la-conciliere'),
        'total-taxe-şi-speze': valoare('#total-taxe-şi-speze'),
      };

      var itemi = {};

      $secţiune.find('#listă-taxe-şi-speze>.item').each(function() {
        var $item = $(this), item;

        item = {
          achitat: $item.find('#achitat').is(':checked')
        };

        var $subformular = $item.find('.subformular:not(.achitare)');

        if ($subformular.există()) {
          var titluri = $subformular.find('li:first label').map(function() {
            return $(this).text();
          });

          if (titluri.length > 0) { // subformular cu itemi eliminabili
            item.subformular = $subformular.find('.eliminabil').map(function() {
              var $item = $(this),
                  item = {},
                  cîmpuriCuValori = 0;

              $item.find(':input').each(function(i) {
                item[titluri[i]] = $(this).val();
              });
              // TODO: de colectat destinatarii

              cîmpuriCuValori = $.map(item, function(v, k) {return !!v})
                .filter(function(areValoare) {return areValoare})
                .length;

              if (cîmpuriCuValori > 0) return item;
            }).filter(function() {return !!this}).get();
          } else { // subformular nestructurat
            item.subformular = {};

            $subformular.find(':input').each(function() {
              var $input = $(this);

              item.subformular[this.id] = $input.is(':checkbox') ? $input.is(':checked') : $input.val();
            });
          }
        }

        itemi[$item.attr('id')] = item;
      });

      procedură.cheltuieli.itemi = itemi;
      // TODO: de verificat spezele
    }


    $('#procedură button.salvează').on('click', function() {
      colectează('#documentul-executoriu');
      colectează('#date-generale');
      colecteazăCheltuieli();

      //colectează('#creditor');
      //colectează('.personă-terţă'); // TODO
      //colectează('.debitor'); // TODO

      console.log(procedură);
    });
  }
};

// --------------------------------------------------

var Cheltuieli = {
  init: function() {
    this.initListaCategorii();
    this.initSubformulare();
    this.initDocumenteAdresabile();
  },

  initListaCategorii: function() {
    var listaCategorii = $('#categorii-taxe-şi-speze'),
        lista = $('#listă-taxe-şi-speze');

    listaCategorii.on('click', '.categorie .item', function() {
      if ($(this).is('.dezactivat')) return;

      var item = $(this).clone(),
          subformular = item.data('şablon-subformular'),
          bifăAchitare = $('.şablon.achitare').clone().removeClass('şablon');

      if (subformular) {
        item.append(
          $('.şablon.subformular[title="' + subformular + '"]').clone()
            .removeClass('şablon')
            .removeAttr('title')
        );
      }

      lista.append(item);
      item
        .append(bifăAchitare)
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
      .on('click', '.achitare input:checkbox', function(e, programat) {
        var azi = (new Date).format('dd/mm/yyyy'),
            bifat = programat ? !this.checked : this.checked;

        $(this)
          .siblings('.la').find('.data').text(bifat ? azi : '')
          .closest('.item').toggleClass('achitat', bifat);
      });
  },

  initSubformulare: function() {
    $('#procedură')
      .on('click', 'button.adaugă', function() {
        var numeŞablon = $(this).closest('.item').data('şablon-subformular'),
            şablon = $('.şablon.subformular[title="' + numeŞablon + '"] .document').first();

        şablon.clone()
          .insertBefore($(this).parent())
          .find('textarea,input').first().focus();
      });
  },

  initDocumenteAdresabile: function() {
    var listaDestinatari = $('.şablon.destinatari');

    $('#cheltuieli')
      .on('click', '.destinatari-adăugaţi', function(e) {
        if (e.target == this) {
          $(this)
            .toggleClass('comprimaţi')
            .toggleClass('cu umbră');
        }
      })
      .on('eliminare', '.destinatari-adăugaţi>li', function(e) {
        var destinatar = $(this);

        if (!destinatar.siblings().există()) destinatar.parent().click();
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

        listaDestinatari.hide();
      })

      .on('click', '.listă li', function() {
        var destinatariAdăugaţiDeja = $(this).closest('.document').find('.destinatari-adăugaţi'),
            destinatar = $(this).clone();

        destinatar
          .addClass('eliminabil de tot')
          .appendTo(destinatariAdăugaţiDeja);

        if (destinatar.is('.persoană.terţă')) {
          destinatariAdăugaţiDeja.click();
          destinatar
            .text('')
            .append($('.şablon.persoană.terţă').html())
            .find('input').focus();
        }

        listaDestinatari.hide();
      })

      .on('keypress', '.persoană.terţă input', function(e) {
        var destinatariAdăugaţiDeja = $(this).closest('ul.destinatari-adăugaţi');

        if (e.keyCode == 13) destinatariAdăugaţiDeja.click();
      })

      .on('eliminare', '.destinatari-adăugaţi .eliminabil', function() {
        var eliminabil = $(this);

        if (!eliminabil.siblings().există()) {
          eliminabil.parent().addClass('comprimaţi');
        }
      });
  }
};

// --------------------------------------------------

var Eliminabile = {
  buton: null,

  init: function() {
    this.buton = $('.şablon.elimină')
      .removeClass('şablon')
      .hide()
      .on('click', this.elimină);

    $('#procedură')
      .on('mousemove', '.eliminabil', this.afişeazăButon)
      .on('mouseleave', '.eliminabil', this.ascundeButon);
  },

  afişeazăButon: function(e) {
    e.stopPropagation();

    var eliminabil = $(this),
        buton = Eliminabile.buton;

    if (eliminabil.is('.spre-eliminare')) return;

    if (eliminabil.children().există()) {
      buton.insertBefore(eliminabil.children().first())
    } else {
      eliminabil.prepend(buton);
    }

    buton.show();

    $('.spre-eliminare').removeClass('spre-eliminare');
    eliminabil.addClass('spre-eliminare');
  },

  ascundeButon: function() {
    Eliminabile.buton
      .hide()
      .parent().removeClass('spre-eliminare').end()
      .appendTo(document.body);
  },

  elimină: function() {
    var eliminabil = Eliminabile.buton.parent();

    Eliminabile.ascundeButon();

    if (eliminabil.is('.eliminabil.de.tot') || eliminabil.siblings('.eliminabil').există()) {
      eliminabil
        .find('.valoare, .sumă').val(0).trigger('change').end()
        .trigger('eliminare')
        .remove();
    } else {
      eliminabil
        .find('.eliminabil.de.tot').remove().end()
        .find('.valoare, .sumă').val(0).trigger('change').end()
        .find('textarea').val('').trigger('change').end()
        .trigger('eliminare');
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
