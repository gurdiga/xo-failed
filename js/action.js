var $şabloane = $('#şabloane');

var Action = {
  init: function() {
    Utilizator.init();
    HashController.init();

    Valute.init();
    ProcedurăNonPecuniară.init();
    FormulareŞablon.init();
    CîmpuriTextarea.autodimensionează();
    ListeFoarteLate.seteazăŞoapte();
    Persoane.init();
    Cheltuieli.init();
    ButonDeEliminare.init();
    Formular.init();
    Instrumente.init();
    Calculator.init();
    Calendar.init();
    CîmpuriPersonalizate.init();

    $(window).trigger('hashchange');

    if (Utilizator.autentificat) Căutare.init();
  },

  '#index': function() {
    $('#căutare input').focus();

    ProceduriRecente.încarcă();
  }
};

// --------------------------------------------------

var ProcedurăNonPecuniară = {
  init: function() {
    this.bunuri.init();
  },

  bunuri: {
    init: function() {
      $('#obiectul-urmăririi')
        .on('click', 'button.adaugă', this.adaugăCîmp)
        .on('iniţializat', function() { $('#obiect').trigger('change') });
    },

    adaugăCîmp: function() {
      var şablon = $(this).parent().prev();

      şablon.clone()
        .hide()
        .insertBefore($(this).parent())
        .show('blind')
        .find(':input')
          .val('')
          .first().focus();
    }
  }
};

// --------------------------------------------------

var Valute = {
  init: function() {
    this.populeazăListe();
  },

  populeazăListe: function() {
    var şablon = $şabloane.find('.valute').html();

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
        .hide()
        .insertAfter(fieldset)
        .show('blind', function() {
          buton.siblings('fieldset:not(#creditor)').addClass('dispensabilă');
        })
        .find('#gen-persoană').trigger('change');
    });
  },

  initŞtergere: function() {
    $('#formular').on('click', 'button.elimină-persoană', function() {
      var button = $(this),
          aceastăPersoană = button.closest('fieldset');
          celelaltePersoane = aceastăPersoană.siblings('fieldset');

      aceastăPersoană.slideUp(function() {
        aceastăPersoană.remove()
        celelaltePersoane.toggleClass('dispensabilă', celelaltePersoane.length > 1);
      });
    });
  }
};

// --------------------------------------------------

var HashController = {
  init: function() {
    $(window).on('hashchange', function() {
      if (Utilizator.autentificat) {
        var pagina = HashController.pagină();

        $('div.pagină, #umbră')
          .filter(':not(#index)').hide().end()
          .filter(pagina).show();

        if (Action[pagina]) Action[pagina]();
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

  pagină: function() {
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
        var select = $(this);

        select.next('.şoaptă').remove();

        $('<p>')
          .insertAfter(select)
          .text(select.find('option:selected').text())
          .addClass('şoaptă');
      })
      .find('select.foarte.lat').trigger('change').end()
      .on('change', 'select.care.schimbă.formularul', function(e) {
        $(this).closest('li')
          .nextAll().find('select.foarte.lat')
            .not(function() {return $(this).next().is('.şoaptă')})
            .trigger('change');
      });
  }
};

// --------------------------------------------------

var FormulareŞablon = {
  selector: 'select.care.schimbă.formularul',

  init: function() {
    $('#formular').on('change', FormulareŞablon.selector, function(e, automat) {
      var $select = $(this),
          selectorŞablon = '.' + $select.attr('id') + '.conţinut[title="' + $select.val() + '"]',
          şablon = FormulareŞablon.parseazăIncluderile($şabloane.find(selectorŞablon).html()),
          item = $select.closest('li');

      item
        .nextAll().remove().end()
        .after(şablon)
        .nextAll()
          .find(FormulareŞablon.selector).trigger('change', ['automat']);

      if (!$.fx.off && !automat) {
        item.next().find(':input').first().focus();
      }

      item.nextAll().effect('highlight', {}, 1200);
    });
  },

  parseazăIncluderile: function(html) {
    if (!html) return html;

    return html.replace(/<!-- include (.*?) -->/g, function(match, selector) {
      return $şabloane.find(selector).html();
    });
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
        $şabloane.find('.subformular[title="' + subformular + '"]').clone()
          .removeAttr('title')
          .appendTo(item);
      }

      var bifăAchitare = $şabloane.find('.achitare').clone(),
          random = 'achitat' + +new Date;

      bifăAchitare
        .find(':checkbox').attr('id', random).end()
        .find('label').attr('for', random);

      item
        .append(bifăAchitare)
        .addClass('eliminabil de tot')
        .hide()
        .appendTo(lista)
        .show('blind')
        .find('textarea').focus();

      lista.trigger('recalculare');

      $(this).closest('.conţinut').fadeOut();

      TotalCheltuieli.calculează();
    });

    $('#cheltuieli')
      .on('mouseenter', '#categorii-taxe-şi-speze .categorie', function() {
        $(this).find('.conţinut').afişează();

        var itemiUniciAdăugaţiDeja = lista.children('.item.unic'),
            itemi = $(this).find('.conţinut ol').children();

        itemi
          .removeClass('dezactivat')
          .removeAttr('title');

        if (itemiUniciAdăugaţiDeja.există()) {
          var selector = itemiUniciAdăugaţiDeja.map(function() {
            return '#' + this.id;
          }).get().join(',');

          itemi.filter(selector)
            .addClass('dezactivat')
            .attr('title', 'Adăugat deja');
        }
      })
      .on('mouseleave', '#categorii-taxe-şi-speze .categorie', function() {
        $(this).find('.conţinut').ascunde();
      })
  },

  initSubformulare: function() {
    $('#formular').on('click', 'button.adaugă', function() {
      var numeŞablon = $(this).closest('.item').data('şablon-subformular'),
          şablon = $şabloane.find('.subformular[title="' + numeŞablon + '"] .document').first();

      şablon.clone()
        .hide()
        .insertBefore($(this).parent())
        .show('blind')
        .find('textarea,input').first().focus();

      TotalCheltuieli.calculează();
    });
  },

  initDocumenteAdresabile: function() {
    var listaDestinatari = $şabloane.find('.destinatari');

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

        $(this).addClass('dezactivat');

        if (destinatar.is('.persoană.terţă')) {
          destinatariAdăugaţiDeja.click();
          destinatar
            .text('')
            .append($şabloane.find('.persoană.terţă').html())
            .find('input').focus();
        }

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
      var bifa = $(this),
          data = bifa.siblings('.la').find('.dată'),
          item = bifa.closest('.item');

      if (bifa.is(':checked')) {
        if ($.trim(data.val()) == '') data.val(moment().format('DD.MM.YYYY'));
      }

      item.toggleClass('achitat', bifa.is(':checked'));
    });
  }
};

// --------------------------------------------------

var ButonDeEliminare = {
  $: null,

  init: function() {
    this.$ = $şabloane.find('.elimină')
      .hide()
      .on('click', this.acţionează);

    $('#formular, #calculator')
      .on('mousemove', '.eliminabil', this.afişează)
      .on('mouseleave', '.eliminabil', this.ascunde);
  },

  afişează: function(e) {
    e.stopPropagation();

    var eliminabil = $(this),
        buton = ButonDeEliminare.$;

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

  ascunde: function() {
    ButonDeEliminare.$
      .parent().removeClass('spre-eliminare').end()
      .appendTo(document.body);
  },

  acţionează: function() {
    var eliminabil = ButonDeEliminare.$.parent();

    ButonDeEliminare.ascunde();

    if (eliminabil.is('.eliminabil.de.tot') || eliminabil.siblings('.eliminabil').există()) {
      eliminabil
        .find('.valoare, .sumă').val(0).trigger('change').end()
        .trigger('eliminare')
        .slideUp(function() {
          eliminabil.remove();
          TotalCheltuieli.calculează();
        });
    } else {
      eliminabil
        .find('.eliminabil.de.tot').slideUp(function() {
          eliminabil
            .find('.valoare, .sumă').val(0).trigger('change').end()
            .find('textarea').val('').trigger('change').end()
            .trigger('eliminare');

          $(this).remove();
          TotalCheltuieli.calculează();
        });
    }
  }
};

// --------------------------------------------------

var Utilizator = {
  login: '',
  autentificat: false,

  init: function() {
    Utilizator.login = $.cookie('login');
    Utilizator.autentificat = !!$.trim(Utilizator.login);

    $('body').toggleClass('autentificat', Utilizator.autentificat);
  }
};

// --------------------------------------------------

var Formular = {
  init: function() {
    $('#formular')
      .find('button.închide').on('click', Formular.închide).end()
      .find('button.salvează').on('click', Formular.trimite);

    $(window).on('hashchange', function() {
      if (!/^#formular/.test(location.hash)) return;

      Formular.deschide();
    });
  },

  seCreazăProcedurăNouă: function() {
    return HashController.pagină() == '#formular' && /^[SP]?$/.test(HashController.date());
  },

  seDeschideProcedurăSalvată: function() {
    return HashController.pagină() == '#formular' && /^[SP]?-\d+$/.test(HashController.date());
  },

  seteazăTitlu: function() {
    var literă = HashController.date().match(/^[SP]?/)[0],
        href = '#formular' + (literă ? '?' + literă : ''),
        descriereProcedură = $('#crează-procedură').find('a[href="' + href + '"]').text(),
        număr = Formular.seCreazăProcedurăNouă() ? '' : Utilizator.login + HashController.date();

    $('#formular')
      .find('#descriere').text(descriereProcedură).end()
      .find('#număr').text(număr).end();
  },

  colectează: function() {
    var procedură = {
      'număr': ($('#număr').text().match(/[SP]?-\d+/) || [null])[0],
      'document-executoriu': colectează('#document-executoriu'),
      'obiectul-urmăririi': colecteazăObiectulUrmăririi(),
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
            'label+:input.dată',
            'label+:input.foarte.lat',
            '.label+:input:not(.calculat):not(button)'
          ].join(',');

      $secţiune.find(cîmpuri).each(function() {
        var $input = $(this),
            $label = $input.prev();

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
    function colecteazăObiectulUrmăririi() {
      return $.extend(colectează('#obiectul-urmăririi'), {
        'sume': colecteazăSumeÎnValută()
      });
    }

    // ------------------------------------------
    function colecteazăSumeÎnValută(cîmpuri) {
      var sume = {};

      $('#obiectul-urmăririi').find('.sumă+.valuta').each(function() {
        var cîmp = $(this).prev(),
            etichetă = cîmp.prev(),
            denumire = etichetă[etichetă.is('label') ? 'text' : 'val']();

        sume[denumire] = {
          suma: cîmp.val(),
          valuta: cîmp.next('.valuta').val()
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

        item['achitat'] = $item.find('.achitare :checkbox').is(':checked');
        item['data-achitării'] = $item.find('.achitare .dată').val();

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
    var procedură = Formular.colectează();

    procedură.tip = HashController.date().match(/^[SP]?/)[0];

    if (!procedură.număr) {
      $.get('/date/' + Utilizator.login + '/proceduri/', function(răspuns) {
        var ultimulNumăr = $(răspuns).find('a').map(function() {
          var reNumăr = /^([SP]?)-(\d+)$/;

          if (reNumăr.test(this.firstChild.data)) {
            return parseInt(this.firstChild.data.match(reNumăr)[2]);
          } else {
            return 0;
          }
        }).get().sort(function(a, b) {return a - b}).pop();

        var literă = HashController.date();

        procedură.număr = literă + '-' + (ultimulNumăr + 1);
        post();
      });
    } else {
      post();
    }

    // -----
    function post() {
      var număr = HashController.date();

      $.post('/date/' + Utilizator.login + '/proceduri/' + număr, JSON.stringify(procedură), function() {
        Formular.închide();
        Căutare.încarcăIndex();
        ProceduriRecente.încărcat = false;
      });
    }
  },

  încarcă: function() {
    var număr = HashController.date();

    $.getJSON('/date/' + Utilizator.login + '/proceduri/' + număr)
      .success(Formular.populează)
      .error(Formular.închide);

    if (!$('#proceduri-recente').find('ul a[href="' + location.hash + '"]:first').există()) {
      ProceduriRecente.notează(număr);
    }
  },

  populează: function(procedură) {
    $.fx.off = true;

    populeazăSecţiune('#document-executoriu', procedură['document-executoriu']);
    populeazăObiectulUrmăririi();
    populeazăCheltuieli();
    populeazăSecţiune('#creditor', procedură['creditor']);
    populeazăPersoaneleTerţe();
    populeazăDebitori();

    $('#formular')
      .animate({scrollTop: 0}, 0)
      .on('keydown', Formular.esc)
      .attr('tabindex', 1)
      .focus()
      .removeAttr('tabindex');

    $.fx.off = false;

    // ------------------------------------------
    function populeazăSecţiune(selector, secţiune) {
      var $secţiune = $(selector), id;

      for (id in secţiune) {
        $secţiune.find('#' + id)
          .val1(secţiune[id])
          .trigger('change');
      }
    }

    // ------------------------------------------
    function populeazăObiectulUrmăririi() {
      populeazăSecţiune('#obiectul-urmăririi', procedură['obiectul-urmăririi']);

      var $secţiune = $('#obiectul-urmăririi'),
          sume = procedură['obiectul-urmăririi'].sume,
          cîmp, $cîmp;

      for (cîmp in sume) {
        $cîmp = $secţiune.find('label:contains(' + cîmp + ')+.sumă');

        if (!$cîmp.există()) {
          $secţiune.find('li:has(button.adaugă-cîmp-personalizat)').before($şabloane.find('.cîmp-personalizat').html());
          $cîmp = $secţiune.find('.etichetă+.sumă').last();
          $cîmp.prev().val(cîmp);
        }

        $cîmp.val(sume[cîmp].suma);
        $cîmp.next('.valuta').val(sume[cîmp].valuta);
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

        if (item.achitat == true) {
          $item.find('.subformular.achitare :checkbox').attr('checked', true).trigger('change');
          $item.addClass('achitat');
        }

        $item.find('.subformular.achitare .la .dată').val(item['data-achitării']);

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
              var $destinatari = $şabloane.find('.destinatari');

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
                    .append($şabloane.find('.persoană.terţă').html())
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
          populeazăSecţiune($secţiune, this);
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
        populeazăSecţiune($secţiune, this);
      });
    }
  },

  resetează: function() {
    $('#formular')
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
    $('#formular, #umbră').fadeOut('fast', function() {location.hash = ''});

    Formular.resetează();
  },

  deschide: function() {
    $('#formular')
      .animate({scrollTop: 0}, 0)
      .on('keydown', Formular.esc)
      .attr('tabindex', 1)
      .focus()
      .removeAttr('tabindex');

    $('#formular, #umbră').hide().fadeIn('fast');

    $.fx.off = true;

    if (Formular.seDeschideProcedurăSalvată()) {
      Formular.încarcă();
    }

    Formular.seteazăTitlu();
    Business.init();

    $.fx.off = false;
  },

  esc: function(e) {
    if (e.keyCode == 27) Formular.închide();
  }
}

// --------------------------------------------------

var ProceduriRecente = {
  încărcat: false,

  încarcă: function() {
    if (ProceduriRecente.încărcat) return;

    $.get('/date/' + Utilizator.login + '/proceduri/recente/', function(lista) {
      var $proceduriRecente = $('#proceduri-recente').find('ul').empty();

      var proceduri = $(lista).find('a:not(:contains("../"))').map(function() {
        return {
          timp: moment($.trim(this.nextSibling.data).split(/\s{2,}/)[0], 'D-MMM-YYYY H:m').toDate(),
          număr: this.innerText,
          $li: $('<li>').append(
            $(this)
              .attr('href', function(i, href) {return '#formular?' + href})
              .text(function(i, text) {return Utilizator.login + text})
          )
        };
      }).get().sort(function(a, b) {
        return (b.timp - a.timp) || (a.număr > b.număr ? -1 : +1)
      });

      $.fn.append.apply($proceduriRecente, $.map(proceduri, function(p) {return p.$li}));
      ProceduriRecente.încărcat = true;
    });
  },

  notează: function(număr) {
    $.post('/bin/notează-ca-recentă.php', {procedură: număr});
    ProceduriRecente.încărcat = false;
  }
}

// --------------------------------------------------

var Căutare = {
  timer: 0,
  $el: null,

  init: function() {
    Căutare.$el = $('#căutare')
      .on('keyup update paste', 'input', Căutare.găseşte)
      .on('keydown', 'input', Căutare.selecteazăItem)
      .on('keydown', 'input', Căutare.anuleazăCăutarea);

    Căutare.hoverItemRezultate();
    Căutare.încarcăIndex();
  },

  hoverItemRezultate: function() {
    $('#rezultate')
      .on('mouseenter', 'tr', function() {this.className = 'selectat'})
      .on('mouseleave', 'tr', function() {this.removeAttribute('class')})
      .on('click', 'tr', Căutare.deschideProceduraSlectată);
  },

  anuleazăCăutarea: function(e) {
    if (e.keyCode == 27) this.value = '';
  },

  deschideProceduraSlectată: function(e) {
    e.preventDefault();

    var $item = $('#rezultate').find('tr.selectat');

    if (!$item.există()) return;

    var număr = $item.find('.număr').text().replace(Utilizator.login, '');

    if (număr) location.hash = 'formular?' + număr;
  },

  selecteazăItem: function(e) {
    var tasta = e.keyCode,
        SUS = 38,
        JOS = 40,
        ENTER = 13;

    if ($.inArray(tasta, [SUS, JOS, ENTER]) == -1) return;

    e.preventDefault();

    var $lista = $('#rezultate');

    if (!$lista.find('tr').există()) return;

    var spre = {
      38: 'prev', // SUS
      40: 'next' // JOS
    }, deLa = {
      38: 'tr:last', // SUS
      40: 'tr:first' // JOS
    };

    if (tasta == SUS || tasta == JOS) {
      var $item = $lista.find('tr.selectat'),
          $spre = $item.există() ? $item[spre[tasta]]() : $lista.find(deLa[tasta]);

      $item.removeClass('selectat');
      $spre.addClass('selectat');
    } else if (tasta == ENTER) {
      Căutare.deschideProceduraSlectată(e);
    }
  },

  găseşte: function(e) {
    var tasta = e.keyCode,
        SUS = 38,
        JOS = 40,
        ENTER = 13;

    if ($.inArray(tasta, [SUS, JOS, ENTER]) != -1) return;
    if (Căutare.timer) return;

    var text = $.trim($(this).val());

    Căutare.timer = setTimeout(function() {
      if (!text.length) {
        Căutare.curăţă();
        return;
      }

      text = $.reEscape(text);

      var item, poziţie,
          reLaÎnceputDeRînd = new RegExp('^' + text, 'gi'),
          reLaÎnceputDeCuvînt = new RegExp('\\b' + text, 'gi'),
          reUndeva = new RegExp(text, 'gi'),
          găsiriLaÎnceputDeRînd = [],
          găsiriLaÎnceputDeCuvînt = [],
          găsiriUndeva = [];

      for (item in Căutare.index) {
        if (reLaÎnceputDeRînd.test(item)) găsiriLaÎnceputDeRînd.push(item);
        else if (reLaÎnceputDeCuvînt.test(item)) găsiriLaÎnceputDeCuvînt.push(item);
        else if (reUndeva.test(item)) găsiriUndeva.push(item);
      }

      Căutare.curăţă();
      Căutare.afişeazăRezultatele(
        găsiriLaÎnceputDeRînd
          .concat(găsiriLaÎnceputDeCuvînt)
          .concat(găsiriUndeva),
        text
      );
    }, 10);
  },

  curăţă: function() {
    clearTimeout(Căutare.timer);
    Căutare.timer = 0;

    Căutare.$el.find('#rezultate').html('');
  },

  afişeazăRezultatele: function(itemi, fragment) {
    var proceduri, număr, procedură,
        rezultate = '',
        creditor = '',
        persoaneTerţe = '',
        debitori = '';

    for (var i = 0; i < itemi.length; i++) {
      proceduri = Căutare.index[itemi[i]];

      for (număr in proceduri) {
        procedură = evidenţiază(proceduri[număr], fragment);
        creditor = persoană(procedură['creditor']);
        persoaneTerţe = $.map(procedură['persoane-terţe'], function(p) {return persoană(p)}).join('');
        debitori = $.map(procedură['debitori'], function(p) {return persoană(p)}).join('');

        rezultate +=
          '<tr>' +
            '<td>' +
              '<span class="număr">' + evidenţiază(număr, fragment) + '</span>' +
              '<span class="data-hotărîrii">' + procedură['data-hotărîrii'] + '</span>' +
            '</td>' +
            '<td><dl class="persoane">' + creditor + persoaneTerţe + '</dl></td>' +
            '<td class="vs">vs.</td>' +
            '<td><dl class="persoane">' + debitori + '</dl></td>' +
          '</tr>';
      }
    }

    Căutare.$el.find('table#rezultate').html(rezultate);


    // ------------------------------------------

    function evidenţiază(text, fragment) {
      if (!text) return '';

      if ($.isPlainObject(text)) {
        var itemi = {};

        for (var item in text)
          itemi[item] = evidenţiază(text[item], fragment);

        return itemi;
      } else if ($.isArray(text)) {
        return $.map(text, function(item) {return evidenţiază(item, fragment)});
      } else {
        var reFragment = new RegExp('(' + fragment + ')', 'gi'),
            fragmentFormatat = '<b>$1</b>';

        return text.replace(reFragment, fragmentFormatat);
      }
    }


    // ------------------------------------------

    function persoană(persoană) {
      return '' +
        '<dt>' + (persoană['denumire'] || persoană['nume'] || '') + '</dt>' +
        '<dd>' + (persoană['idno'] || persoană['idnp'] || '') + '</dd>';
    }
  },

  încarcăIndex: function() {
    setTimeout(function() {
      $.getJSON('/date/' + Utilizator.login + '/proceduri/index', function(data) {
        Căutare.index = data;
      });
    }, 500);
  }
};

// --------------------------------------------------

var Calculator = {
  $: null,

  init: function() {
    DobîndaDeÎntîrziere.init();

    Calculator.$ = $('#calculator');

    Calculator.$
      .on('keydown', function(e) {
        if (e.keyCode == 27) Calculator.închide();
      })
      .on('click', 'button.închide', Calculator.închide)
      .on('click', 'button.adaugă', function() {
        var buton = $(this),
            item = buton.parent().prev('li');

        item.clone()
          .removeClass('prima')
          .find('.sumă').val('').end()
          .hide()
          .insertAfter(item)
          .show('blind');
      })
      .on('keyup update paste click change', ':input:not(#dobînda)', DobîndaDeÎntîrziere.calculează);

    $('#bara-de-sus .calculator').on('click', function() {
      if (Calculator.$.is(':visible')) Calculator.închide();
      else Calculator.deschide();
    });
  },

  deschide: function() {
    Calculator.$
      .stop(true, true)
      .fadeToggle('fast', 'easeInCirc')
      .find('input').first().focus().end()

    Calculator.resetează();
  },

  resetează: function() {
    Calculator.$
      .find('input:text').val('').end()
      .find('#art619-1').removeAttr('checked').end()
      .find('#art619-2').attr('checked', 'checked').end()
      .find('#sume .item:not(.prima)').remove().end();
  },

  închide: function() {
    Calculator.$
      .stop(true, true)
      .hide();
  }
};

// --------------------------------------------------

var Instrumente = {
  $: null,

  init: function() {
    Instrumente.$ = $('.instrumente');
    Instrumente.initOpţiuniPentruButoane();
    Instrumente.$.on('click', 'button', function() {
      if (Instrumente[this.className]) Instrumente[this.className].apply(this, arguments);
    });
  },

  initOpţiuniPentruButoane: function() {
    Instrumente.$.find('button+.opţiuni')
      .each(function() {
        var opţiuni = $(this),
            buton = opţiuni.prev('button');

        buton
          .on('mouseenter', function() {
            opţiuni.afişează();
          })
          .on('mouseleave', function() {
            opţiuni.stop(true, true);

            setTimeout(function() {
              if (!opţiuni.data('atins')) opţiuni.ascunde();
            }, 500);
          })
      })
      .on('mouseenter', function() {
        $(this).data('atins', true);
      })
      .on('mouseleave', function() {
        $(this)
          .ascunde()
          .removeData('atins');
      })
      .on('click', 'li', function() {
        var opţiune = $(this),
            listaDeOpţiuni = opţiune.parent(),
            buton = listaDeOpţiuni.prev('button'),
            numeAcţiune = buton.attr('class') + '-' + opţiune.attr('class');

        listaDeOpţiuni.ascunde();
        Instrumente[numeAcţiune]();
      });
  },

  'profil': function() {
  },

  'calculator': function() {
  }
};

// --------------------------------------------------

var Calendar = {
  opţiuni: {
    dateFormat: 'dd.mm.yy',
    dayNamesMin: 'Du Lu Ma Mi Jo Vi Sî Du'.split(' '),
    monthNames: 'Ianuarie Februarie Martie Aprilie Mai Iunie Iulie August Septembrie Octombrie Noiembrie Decembrie'.split(' '),
    firstDay: 1,
    showAnim: 'fadeIn',
    prevText: 'Luna precedentă',
    nextText: 'Luna viitoare',
    showOn: 'none',
    onSelect: function() {Calendar.închide(this)}
  },

  închide: function(el) {
    el = $(el);

    if (el.data('id')) el.attr('id', el.data('id'));

    el.datepicker('destroy');
  },

  init: function() {
    $('.dată').after(
      $('<span>')
        .addClass('ui-icon ui-icon-calendar semiascuns')
        .attr('title', 'Calendar')
    );

    $(document)
      .on('click', '.dată+.ui-icon-calendar', function() {
        var cîmp = $(this).prev(),
            calendar = cîmp.datepicker('widget');

        if (calendar.is(':visible')) {
          cîmp.datepicker('destroy');
        } else {
          if (!cîmp.data('datepicker')) {
            if (cîmp.attr('id')) {
              cîmp
                .data('id', cîmp.attr('id'))
                .removeAttr('id');
            }

            cîmp.datepicker(Calendar.opţiuni);
          }

          cîmp.datepicker('show');
        }
      })
      .on('keydown', '.dată', function(e) {
        if (e.keyCode == 40) $(this).next('.ui-icon-calendar').click();
        if (e.keyCode == 27) Calendar.închide();
      });
  }
};

// --------------------------------------------------

var CîmpuriPersonalizate = {
  init: function() {
    $('#formular')
      .on('click', 'button.adaugă-cîmp-personalizat', this.adaugă)
      .on('blur', 'input.etichetă', function(e) {
          $(this).next().focus();
      })
      .on('keydown', 'input.etichetă', function(e) {
        if (e.keyCode == 13 || e.keyCode == 27) {
          $(this).next().focus();
          e.stopPropagation();
        }
      });
  },

  adaugă: function() {
    var buton = $(this),
        li = buton.closest('li'),
        şablon = $şabloane.find('.' + buton.data('şablon')).html();

    li
      .before(şablon)
      .prev()
        .find('.etichetă').focus().select().end()
        .effect('highlight', {}, 1200);
  }
};

// --------------------------------------------------

$.fn.există = function() {
  return this.length > 0;
}

// --------------------------------------------------

$.fn.ascunde = function() {
  return this.stop(true, true).fadeOut();
};

// --------------------------------------------------

$.fn.afişează = function() {
  return this.delay(200).fadeIn();
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

// --------------------------------------------------

$.reEscape = function(re) {
  return re.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
