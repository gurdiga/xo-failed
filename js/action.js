var Action = {
  init: function() {
    Utilizator.init();
    HashController.init();

    Valute.init();
    Schimbări.urmăreşte();
    ProcedurăNonPecuniară.init();
    FormulareŞablon.init();
    CîmpuriTextarea.autodimensionează();
    ListeFoarteLate.seteazăŞoapte();
    Persoane.init();
    Cheltuieli.init();
    Eliminabile.init();
    DateProcedură.init();
    Formular.init();
    ProceduriRecente.init();

    $(window).trigger('hashchange');
  },

  '#index': function() {
    $('#căutare input').focus();

    ProceduriRecente.încarcă();
  },

  '#formular': function() {
    $('#gen').text($('#crează-procedură').find('a[href="' + location.hash + '"]').text());
    $('#formular>.conţinut').hide().fadeIn();

    Formular.resetează();
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
        .find(':input')
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
        .find(':input').first().focus();
  }
};

// --------------------------------------------------

var Valute = {
  init: function() {
    this.populeazăListe();
  },

  populeazăListe: function() {
    var şablon = $('.valuta.şablon').html();

    $('ul .valuta').html(şablon);
  }
};

// --------------------------------------------------

var Persoane = {
  init: function() {
    this.initAdăugare();
    this.initŞtergere();
  },

  initAdăugare: function() {
    $('#formular').on('click', 'button.adaugă.persoană', function() {
      var buton = $(this),
          fieldset = buton.prev();

      fieldset.clone()
        .removeAttr('id') // #creditor
        .find('input,textarea').val('').end()
        .find('legend label').text(function(i, text) {
          if (buton.find('.legend.label').există()) {
            $(this).closest('fieldset').addClass('persoană-terţă');

            return buton.find('.legend.label').text();
          } else {
            return text;
          }
        }).end()
        .find('[schimbat]').removeAttr('schimbat').end()
        .insertAfter(fieldset)
        .find('#gen-persoană').trigger('change');

      buton.siblings('fieldset').addClass('dispensabilă');
    });
  },

  initŞtergere: function() {
    $('#formular').on('click', 'button.elimină-persoană', function() {
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
      if (Utilizator.autentificat) {
        var id = HashController.id();

        $('div.pagină:not(' + id + ',#index)').hide();
        $('div.pagină' + id).show();

        $('#index .umbră')[id == '#formular' ? 'show' : 'hide']();

        if (Action[id]) Action[id]();

        Business.init();

        document.title = $('div.pagină' + id + ' h1').contents(':not(button)').text();
      } else {
        $('div.pagină').hide()
          .filter('#login').show();
      }
    });
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
    return this.hash().split('?')[1] || '';
  }
};

// --------------------------------------------------

var CîmpuriTextarea = {
  selector: 'textarea',
  evenimente: 'keydown keyup update paste change focus mouseup',

  autodimensionează: function() {
    $('#formular').on(this.evenimente, this.selector, function() {
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
    $('#formular')
      .on('change', 'select.foarte.lat', function() {
        var lista = $(this);

        lista.next('.şoaptă').remove();

        $('<p>')
          .insertAfter(lista)
          .text(lista.find('option:selected').text())
          .addClass('şoaptă');
      })
      .find('select.foarte.lat').trigger('change', ['automat']).end()
      .on('change', 'select.care.schimbă.formularul', function(e) {
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
    $('#formular').on(Schimbări.evenimente, Schimbări.selector, function (e, automat) {
      if (automat) return;

      $(this).attr('schimbat', '');
    });

  }
};

// --------------------------------------------------

var FormulareŞablon = {
  selector: 'fieldset[data-şablon]',

  init: function() {
    var selectorLista = FormulareŞablon.selector + '>.conţinut:nth-child(2) select.care.schimbă.formularul';

    $('#formular').on('change', selectorLista, function() {
      var select = $(this),
          fieldset = select.closest('fieldset'),
          şablon = $('.şablon.' + fieldset.data('şablon') + '.' + select.val());

      if (fieldset.find('[schimbat]').not(this).există()) {
        var titlu = fieldset.find('legend label').text();

        if (titlu.indexOf(':') > -1) {
          titlu = titlu.split(':')[0];
        }

        var atenţionare =
          'Această schimbare presupune pierderea datelor din secţiunea [' + titlu + '].\n\n' +
          'Sunteţi sigur?';

        if (!confirm(atenţionare)) {
          select.val(select.data('initial-value'));
          return false;
        }
      };

      fieldset.find('>.conţinut:last-child').html(şablon.html());
    })
    .find(FormulareŞablon.selector)
      .trigger('iniţializat')
      .find('>.conţinut:nth-child(2) select.care.schimbă.formularul').trigger('change').end()
    .end();
  }
};

// --------------------------------------------------

var DateProcedură = {
  init: function() {
    $('#formular button.salvează').on('click', this.trimite);

    $(window).on('hashchange', function() {
      if (HashController.id() == '#formular' && /^[SP]?\d+$/.test(HashController.date())) {
        Formular.resetează();
        DateProcedură.încarcă();
      }
    });
  },

  colectează: function() {
    var procedură = {
      'număr': $('#număr').text(),
      'document-executoriu': colectează('#document-executoriu'),
      'date-generale': colecteazăDateGenerale(),
      'cheltuieli': colecteazăCheltuieli(),
      'creditor': colectează('#creditor'),
      'persoane-terţe': colecteazăPersoaneTerţe(),
      'debitori': colecteazăDebitori()
    };

    return procedură;


    // ------------------------------------------
    function colectează(secţiune) {
      var $secţiune = $(secţiune),
          date = {},
          cîmpuri = [
            'label+:input:not(.calculat):not(button):last-child',
            '.label+:input:not(.calculat):not(button)'
          ].join(',');

      console.log(cîmpuri);
      $secţiune.find(cîmpuri).each(function() {
        var $input = $(this),
            $label = $input.prev();

        console.log($input, $label);
        if ($label.is('.label')) {
          if (!$label.val() && !$input.val()) return;
          if (!date.subformular) date.subformular = {};

          date.subformular[$label.val()] = $input.val();
        } else {
          date[$input.attr('id')] = $input.val1();
        }
      });

      return date;
    }

    // ------------------------------------------
    function colecteazăDateGenerale() {
      return $.extend(colectează('#date-generale'), {
        'sume': colecteazăSumeÎnValută(['suma-de-bază', 'taxă-de-stat', 'penalitate'])
      });
    }

    // ------------------------------------------
    function colecteazăSumeÎnValută(cîmpuri) {
      var sume = {};

      $.each(cîmpuri, function() {
        var $cîmp = $('#' + this);

        sume[this] = {
          suma: $cîmp.val(),
          valuta: $cîmp.next('.valuta').val()
        };
      });

      return sume;
    }

    // ------------------------------------------
    function colecteazăCheltuieli() {
      var $secţiune = $('#cheltuieli'),
          itemi = {};

      $secţiune.find('#listă-taxe-şi-speze>.item').each(function() {
        var $item = $(this),
            item = {};

        item.achitat = $item.find('.achitare :checkbox').is(':checked');

        if (item.achitat) {
          item['data-achitării'] = $item.find('.achitare .data').text();
        }

        var $subformular = $item.find('.subformular:not(.achitare)');

        if ($subformular.există()) {
          var titluri = $subformular.find('li:first label').map(function() {
            return $(this).text();
          });

          if (titluri.length > 0) { // subformular cu itemi eliminabili
            item.subformular = $subformular.find('>.eliminabil').map(function() {
              var $item = $(this),
                  item = {},
                  cîmpuriCuValori = 0;

              if ($item.find('.destinatari-adăugaţi').există()) { // documente adresate
                item = {
                  'document': $.trim($item.find('.denumire').val()),
                  'destinatari': $item.find('.destinatari-adăugaţi li:not(:has(input))').map(function() {
                    return $.trim($(this).text());
                  }).get(),
                  'destinatari-persoane-terţe': $item.find('.destinatari-adăugaţi li:has(input)').map(function() {
                    return $.trim($(this).find('input').val());
                  }).get()
                }
              } else { // listă itemi
                $item.find(':input').each(function(i) {
                  item[titluri[i]] = $(this).val();
                });
              }

              cîmpuriCuValori = $.map(item, function(v, k) {return !!v})
                .filter(function(areValoare) {return areValoare})
                .length;

              if (cîmpuriCuValori > 0) return item;
            }).filter(function() {return !!this}).get();
          } else { // subformular nestructurat
            item.subformular = {};

            $subformular.find(':input').each(function() {
              var $input = $(this);

              item.subformular[this.id] = $input.val1();
            });
          }
        }

        itemi[$item.attr('id')] = item;
      });

      return {
        'onorariu': $secţiune.find('#onorariu').val1(),
        'părţile-au-ajuns-la-conciliere': $secţiune.find('#părţile-au-ajuns-la-conciliere').val1(),
        'itemi': itemi
      };
    }

    // ------------------------------------------
    function colecteazăPersoaneTerţe() {
      return $('.persoană-terţă').map(function() {
        return colectează(this);
      }).get();
    }

    // ------------------------------------------
    function colecteazăDebitori() {
      return $('.debitor').map(function() {
        return colectează(this);
      }).get();
    }
  },

  trimite: function() {
    var procedură = DateProcedură.colectează();

    procedură.tip = HashController.date().match(/^[SP]?/)[0];

    if (!procedură.număr) {
      $.get('/date/' + Utilizator.login + '/proceduri/' + procedură.tip + '/', function(răspuns) {
        var ultimulNumăr = $(răspuns).find('a').map(function() {
          var number = this.firstChild.data;

          return isNaN(number) ? 0 : parseInt(number);
        }).get().sort(function(a, b) {return a - b}).pop();

        procedură.număr = ultimulNumăr + 1;
        post();
      });
    } else {
      post();
    }

    // -----
    function post() {
      $.post('/bin/salvează.php', procedură, Formular.închide);
    }
  },

  încarcă: function() {
    var date = HashController.date().match(/^([SP]?)(\d+)$/),
        gen = date[1],
        număr = date[2];

    $.ajax({
      url: '/date/' + Utilizator.login + '/proceduri/' + gen + '/' + număr,
      success: DateProcedură.populeazăFormularul,
      dataType: 'json',
      cache: false
    });

    if (!$('#proceduri-recente').find('a[href="' + location.hash + '"]').există()) {
      ProceduriRecente.notează(gen + '/' + număr);
    }
  },

  populeazăFormularul: function(procedură) {
    populează('#document-executoriu', procedură['document-executoriu']);
    populeazăDateleGenerale();
    populeazăCheltuieli();
    populează('#creditor', procedură['creditor']);
    populeazăPersoaneleTerţe();
    populeazăDebitori();

    $("#formular").focus().animate({ scrollTop: 0 }, 0);


    // ------------------------------------------
    function populează(selector, secţiune) {
      var $secţiune = $(selector), id;

      for (id in secţiune) {
        $secţiune.find('#' + id)
          .val1(secţiune[id])
          .trigger('change', ['automat'])
          .removeAttr('schimbat');
      }
    }

    // ------------------------------------------
    function populeazăDateleGenerale() {
      populează('#date-generale', procedură['date-generale']);

      var $secţiune = $('#date-generale'),
          sume = procedură['date-generale'].sume,
          cîmp, $cîmp;

      for (cîmp in sume) {
        $cîmp = $secţiune.find('#' + cîmp);
        $cîmp.val(sume[cîmp].suma);
        $cîmp.next('.valuta').val(sume[cîmp].valuta);
      }

      var subformular = procedură['date-generale'].subformular,
          $subformular = $('#date-generale').find('.subformular'),
          $adaugă = $subformular.find('button.adaugă'),
          descriere,
          prima = true;

      for (descriere in subformular) {
        if (prima) {
          prima = false;
        } else {
          $adaugă.click();
        }

        $subformular.find('.item:last')
          .find('.descriere').val(descriere).end()
          .find('.sumă').val(subformular[descriere]).end()
      }
    }

    // ------------------------------------------
    function populeazăCheltuieli() {
      var $secţiune = $('#cheltuieli'),
          $adăugate = $('#listă-taxe-şi-speze'),
          $lista = $('#categorii-taxe-şi-speze');

      $.each(['onorariu', 'părţile-au-ajuns-la-conciliere'], function(i, cîmp) {
        $secţiune.find('#' + cîmp).val1(procedură.cheltuieli[cîmp]);
      });

      for (var id in procedură.cheltuieli.itemi) {
        $lista.find('#' + id).click();

        var item = procedură.cheltuieli.itemi[id],
            $item = $adăugate.find('#' + id),
            $subformular = $item.find('.subformular'),
            $adaugă = $subformular.find('button.adaugă'),
            titluri = {};

        $subformular.find('li:first label').each(function(i) {
          titluri[$(this).text()] = i;
        });

        if (item.achitat == 'true') {
          $item.find('.subformular.achitare :checkbox').attr('checked', true).trigger('change');
          $item.find('.subformular.achitare .la .data').text(item['data-achitării']);
          $item.addClass('achitat');
        }

        if (item.subformular) {
          var prima = true, $cîmp;

          $.each(item.subformular, function(nume, valoare) {
            if (prima) {
              prima = false;
            } else {
              $adaugă.click();
            }

            $itemSubformular = $subformular.find('li.eliminabil:last');
            $cîmp = $itemSubformular.find(':input');

            if (this.document) {
              var $destinatari = $('.şablon.destinatari');

              $cîmp.val(this.document);

              if (this.destinatari) {
                $.each(this.destinatari, function() {
                  $destinatari.find('li:not(.categorie):contains("' + this + '")')
                    .clone()
                    .addClass('eliminabil de tot')
                    .appendTo($itemSubformular.find('.destinatari-adăugaţi'));
                });
              }

              if (this['destinatari-persoane-terţe']) {
                $.each(this['destinatari-persoane-terţe'], function() {
                  $destinatari.find('li.persoană.terţă')
                    .clone()
                    .addClass('eliminabil de tot')
                    .text('')
                    .append($('.şablon.persoană.terţă').html())
                    .find('input').val(this).end()
                    .appendTo($itemSubformular.find('.destinatari-adăugaţi'));
                });
              }
            } else {
              if (this instanceof String) {
                $subformular.find('#' + nume).val1(valoare);
              } else {
                $.each(this, function(nume, valoare) {
                  $($cîmp.get(titluri[nume])).val(valoare);
                });
              }
            }
          });
        }
      }
    }

    // ------------------------------------------
    function populeazăPersoaneleTerţe() {
      var $adaugă = $('#creditor+button.adaugă');

      if (procedură['persoane-terţe']) {
        $.each(procedură['persoane-terţe'], function() {
          $adaugă.click();

          $secţiune = $('.persoană-terţă:last');
          populează($secţiune, this);
        });
      }
    }

    // ------------------------------------------
    function populeazăDebitori() {
      var $secţiune,
          prima = true,
          $adaugă = $('.debitor+button.adaugă');

      $.each(procedură['debitori'], function() {
        if (prima) {
          prima = false;
        } else {
          $adaugă.click();
        }

        $secţiune = $('.debitor:last');
        populează($secţiune, this);
      });
    }

  }
};

// --------------------------------------------------

var Cheltuieli = {
  init: function() {
    this.initListaCategorii();
    this.initSubformulare();
    this.initDocumenteAdresabile();
    this.initBifeAchitat();
  },

  initListaCategorii: function() {
    var listaCategorii = $('#categorii-taxe-şi-speze'),
        lista = $('#listă-taxe-şi-speze');

    listaCategorii.on('click', '.categorie .item', function() {
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

      var bifăAchitare = $('.şablon.achitare').clone(),
          random = 'achitat' + +new Date;

      bifăAchitare
        .removeClass('şablon')
        .find(':checkbox').attr('id', random).end()
        .find('label').attr('for', random);

      lista.append(item).trigger('recalculare');
      item
        .append(bifăAchitare)
        .addClass('eliminabil de tot')
        .find('textarea').focus();

      $(this).closest('.conţinut').hide();

      TotalCheltuieli.calculează();
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
    $('#formular').on('click', 'button.adaugă', function() {
      var numeŞablon = $(this).closest('.item').data('şablon-subformular'),
          şablon = $('.şablon.subformular[title="' + numeŞablon + '"] .document').first();

      şablon.clone()
        .insertBefore($(this).parent())
        .find('textarea,input').first().focus();

      TotalCheltuieli.calculează();
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
        TotalCheltuieli.calculează();
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

        TotalCheltuieli.calculează();
      });
  },

  initBifeAchitat: function() {
    $('#listă-taxe-şi-speze').on('click', '.subformular.achitare :checkbox', function() {
      var azi = (new Date).format('dd/mm/yyyy');

      $(this)
        .siblings('.la').find('.data').text(this.checked ? azi : '')
        .closest('.item').toggleClass('achitat', this.checked);
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

    $('#formular')
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

    TotalCheltuieli.calculează();
  }
};

// --------------------------------------------------

var Utilizator = {
  login: '',
  autentificat: false,

  init: function() {
    this.login = $.cookie('login');
    this.autentificat = !!$.trim(this.login);
  }
};

// --------------------------------------------------

var Formular = {
  init: function() {
    $('#formular button.închide').on('click', Formular.închide);
    $('#crează-procedură a').on('click', Formular.deschide);
    $('#crează-procedură li:not(:last)').on({
      mouseenter: function() {
        $(this).clearQueue().delay(200).animate({
          'margin-top': '-1.5em',
          'margin-left': '-2em'
        });
      },
      mouseleave: function() {
        $(this).clearQueue().animate({
          'margin-top': 0,
          'margin-left': 0
        });
      }
    });

    $('#formular>.conţinut').draggable({
      handle: 'h1',
      revert: true,
      cancel: ':input,option,label',
      revertDuration: 1,
      distance: 30,
      stop: Formular.închide
    });
  },

  resetează: function() {
    $('#formular')
      .find('[schimbat]').removeAttr('schimbat').end()
      .find('#document-executoriu')
        .find(':input').val('').end()
        .find('select').val(function() {return $(this).find('option:first').val()}).end()
      .end()
      .find('#cheltuieli')
        .find('#listă-taxe-şi-speze').empty().end()
        .find(':input:not([type="hidden"])').val('').end()
        .find('#părţile-au-ajuns-la-conciliere').attr('checked', false).end()
      .end()
      .find('#creditor').find(':input').val('').end().end()
      .find('.persoană-terţă').remove().end()
      .find('.debitor')
        .find('input,textarea').val('').end()
        .not(':first').remove().end()
        .first().removeClass('dispensabilă').end()
      .end();

    $('#categorii-taxe-şi-speze').find('.dezactivat').removeClass('dezactivat');
  },

  închide: function() {
    var $formular = $('#formular');

    //if ($formular.find('[schimbat]').există()) return;

    $('#index .umbră').fadeOut();

    $formular.hide('slide', {
      direction: 'right',
    }, 'slow', function() {
      location.hash = '';
    });

    $(document).off('keydown', Formular.esc);
  },

  deschide: function() {
    $(this).parent().effect('transfer', {
      to: '#formular',
      className: 'animaţie'
    }, function() {
      location.href = $(this).find('a').attr('href');
    });

    $(document).on('keydown', Formular.esc);

    return false;
  },

  esc: function(e) {
    if (e.which == 27) Formular.închide();
  }
}

// --------------------------------------------------

var ProceduriRecente = {
  init: function() {
    $('#proceduri-recente').on('click', 'a', Formular.deschide);
  },

  încarcă: function() {
    $.get('/date/' + Utilizator.login + '/proceduri/recente/', function(lista) {
      var $proceduriRecente = $('#proceduri-recente').empty();

      var proceduri = $(lista).find('a:not(:contains("../"))').map(function() {
        return {
          timp: parse($.trim(this.nextSibling.data).split(/\s{2,}/)[0], this.innerText),
          număr: this.innerText,
          $li: $('<li>').append(
            $(this)
              .attr('href', function(i, href) {return '#formular?' + href.replace('-', '')})
              .text(function(i, text) {return Utilizator.login + text})
          )
        };
      }).get().sort(function(a, b) { return (b.timp - a.timp) || (a.număr > b.număr ? -1 : +1)});

      $.each(proceduri, function() {
        this.$li.appendTo($proceduriRecente);
      });
    });

    // -----------------

    function parse(timestamp, number) {
      var parts = timestamp.match(/(\d{2})-(\w{3})-(\d{4}) (\d{2}):(\d{2})/),
          monthNames = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),
          date = new Date();

      date.setFullYear(parts[3]);
      date.setMonth(monthNames.indexOf(parts[2]));
      date.setDate(parts[1]);
      date.setHours(parts[4]);
      date.setMinutes(parts[5]);

      return date.getTime();
    }
  },

  notează: function(procedură) {
    $.post('/bin/notează-ca-recentă.php', {procedură: procedură});
  }
}

// --------------------------------------------------

$.fn.ascunde = function() {
  return this.clearQueue().hide();
};

// --------------------------------------------------

$.fn.afişează = function() {
  return this.delay(200).fadeIn(0);
};

// --------------------------------------------------

$.fn.val1 = function(value) {
  if (typeof value != 'undefined') {
    if (this.is(':checkbox')) {
      return this.attr('checked', value == 'true' || value === true);
    } else {
      return this.val(value);
    }
  }

  return this.is(':checkbox') ? this.is(':checked') : this.val();
};
