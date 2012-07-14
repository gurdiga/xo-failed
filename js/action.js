window.$şabloane = $('#şabloane');
window.skipEventOnce = {};

var Action = {
  init: function() {
    Utilizator.init();
    HashController.init();

    Valute.populeazăListe();
    ProcedurăNonPecuniară.init();
    FormulareŞablon.init();
    CîmpuriTextarea.autodimensionează();
    ListeFoarteLate.seteazăŞoapte();
    Persoane.init();
    Destinatari.init();
    Cheltuieli.init();
    ButonDeEliminare.init();
    Formular.init();
    Instrumente.init();
    Calculator.init();
    Calendar.init();
    CîmpuriPersonalizate.init();
    ProceduriRecente.init();

    $(window).trigger('hashchange');

    if (Utilizator.autentificat) {
      Căutare.init();
    }
  },

  '#index': function() {
    $('#căutare input').focus();
  },

  '#formular': function() {
    var genProcedură = HashController.date().substr(0, 1);

    if (genProcedură == 'P') FormularPensie.init();
  }
};

// --------------------------------------------------

var ProcedurăNonPecuniară = {
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
};

// --------------------------------------------------

var Valute = {
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
    Formular.$.on('click', 'button.adaugă.persoană', function() {
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
    Formular.$.on('click', 'button.elimină-persoană', function() {
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
    $(window)
      .on('hashchange', function(e) {
        if (window.skipEventOnce.hashchange) {
          e.stopImmediatePropagation();
          delete window.skipEventOnce.hashchange;
        }
      })
      .on('hashchange', function() {
        $(document.body).toggleClass('autentificat', Utilizator.autentificat);

        var pagina = HashController.pagină();

        if (Action[pagina]) Action[pagina]();
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
  evenimente: 'keydown keyup input focus mouseup',

  autodimensionează: function() {
    Formular.$
      .attr('spellcheck', 'false')
      .on(this.evenimente, 'textarea', function() {
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
    Formular.$
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
    Formular.$.on('change', FormulareŞablon.selector, function(e, automat) {
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

      item.nextAll().effect('highlight', {}, 1200, function() {
        $(this).clearQueue();
      });
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
  $: $('#cheltuieli'),
  adăugate: $('#cheltuieli .adăugate'),

  init: function() {
    this.categorii.init();
    this.subformulare.init();
    this.destinatariDocumenteAdresabile.init();
    this.achitare.init();
  },

  categorii: {
    $: $('#categorii-taxe-şi-speze'),

    init: function() {
      this.$
        .on('mouseenter', '.categorie', this.afişează)
        .on('mouseleave', '.categorie', this.ascunde)
        .on('click', '.categorie .item', this.adaugăItem);
    },

    afişează: function() {
      $(this).find('.conţinut').afişează();

      var itemiUniciAdăugaţiDeja = Cheltuieli.adăugate.children('.item.unic'),
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
    },

    ascunde: function() {
      $(this).find('.conţinut').ascunde();
    },

    adaugăItem: function() {
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
        .appendTo(Cheltuieli.adăugate)
        .show('blind')
        .find('textarea').focus();

      Cheltuieli.adăugate.trigger('recalculare');

      $(this).closest('.conţinut').fadeOut();

      TotalCheltuieli.calculează();
    }
  },

  subformulare: {
    init: function() {
      Cheltuieli.adăugate.on('click', 'button.adaugă', this.adaugă);
    },

    adaugă: function() {
      var numeŞablon = $(this).closest('.item').data('şablon-subformular'),
          şablon = $şabloane.find('.subformular[title="' + numeŞablon + '"] .document').first();

      şablon.clone()
        .hide()
        .insertBefore($(this).parent())
        .show('blind')
        .find('textarea,input').first().focus();

      TotalCheltuieli.calculează();
    }
  },

  destinatariDocumenteAdresabile: {
    init: function() {
      Cheltuieli.adăugate
        .on('click', '.destinatari-adăugaţi', this.ascundeSauAfişează)
        .on('eliminare', '.destinatari-adăugaţi .eliminabil', this.ascundeListaDacăNuMaiSunt)
        .on('eliminare', '.destinatari-adăugaţi .eliminabil', TotalCheltuieli.calculează)
        .on('keydown', '.destinatari-adăugaţi .persoană.terţă input', this.ascundeLaEnterSauEsc);
    },

    ascundeLaEnterSauEsc: function(e) {
      if (e.keyCode == 13 || e.keyCode == 27) {
        e.preventDefault();
        e.stopPropagation();
        Destinatari.adăugaţiDeja.click();
      }
    },

    ascundeSauAfişează: function(e) {
      if (e.target == this) {
        $(this)
          .toggleClass('comprimaţi')
          .toggleClass('cu umbră');
      }
    },

    ascundeListaDacăNuMaiSunt: function(e) {
      var destinatar = $(this);

      if (!destinatar.siblings().există()) destinatar.parent().click();
    }
  },

  achitare: {
    init: function() {
      Cheltuieli.adăugate.on('click', '.subformular.achitare :checkbox', this.setează);
    },

    setează: function() {
      var bifa = $(this),
          data = bifa.siblings('.la').find('.dată'),
          item = bifa.closest('.item');

      if (bifa.is(':checked') && $.trim(data.val()) == '') {
        data.val(moment().format('DD.MM.YYYY'));
      }

      item.toggleClass('achitat', bifa.is(':checked'));
    }
  }
};

// --------------------------------------------------

var Destinatari = {
  $: $('#destinatari'),
  persoanăTerţă: $şabloane.find('.persoană.terţă').html(),
  adăugaţiDeja: $(),

  init: function() {
    this.categorii.init();
    this.buton.init();
  },

  buton: {
    init: function() {
      Cheltuieli.adăugate
        .on('mouseenter', '.adaugă-destinatar', this.categorii.afişează)
        .on('mouseleave', '.adaugă-destinatar', this.categorii.ascunde)
    },

    categorii: {
      afişează: function() {
        Destinatari.adăugaţiDeja = $(this).prev('.destinatari-adăugaţi');
        Destinatari.$.appendTo(this).afişează();
      },

      ascunde: function() {
        Destinatari.$
          .ascunde()
          .find('.listă').hide();
      }
    }
  },

  categorii: {
    init: function() {
      Destinatari.$
        .on('mouseenter', '.categorie', this.afişează)
        .on('mouseleave', '.categorie', this.ascunde)
        .on('click', '.categorie .titlu .toate', this.adaugă)
        .on('click', '.listă li', Destinatari.adaugă);
    },

    afişează: function() {
      var destinatari = $(this).find('.listă').children();

      if (Destinatari.adăugaţiDeja.children().există()) {
        var selector = Destinatari.adăugaţiDeja.children().map(function() {
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

      $(this).find('.listă').afişează();
    },

    ascunde: function() {
      $(this).find('.listă').ascunde();
    },

    adaugă: function() {
      var destinatari = $(this).closest('.categorie'),
          adăugaţiDeja = Destinatari.adăugaţiDeja.children().map(function() {
            return ':contains("' + $(this).text() + '")';
          }).get().join(',');

      destinatari.find('li').not(adăugaţiDeja).trigger('click');
    }
  },

  adaugă: function() {
    var destinatar = $(this).clone();

    destinatar
      .addClass('eliminabil de tot')
      .appendTo(Destinatari.adăugaţiDeja);

    $(this).addClass('dezactivat');

    if (destinatar.is('.persoană.terţă')) {
      Destinatari.adăugaţiDeja.click();
      destinatar
        .text('')
        .append(Destinatari.persoanăTerţă)
        .find('input').focus();
    }

    TotalCheltuieli.calculează();
  }
};

// --------------------------------------------------

var ButonDeEliminare = {
  $: $şabloane.find('.elimină'),

  init: function() {
    this.$
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
  $: $('#formular'),

  titlu: $('#formular h1'),

  init: function() {
    Formular.$
      .on('click', 'button.închide', Formular.închide)
      .on('click', 'button.salvează', Formular.trimite)
      .on('keydown', function(e) {if (e.keyCode == 27) Formular.închide()})
      .on('închidere', Formular.resetează);

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

    Formular.$
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

          date.subformular[$label.val()] = parseFloat($input.val());
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
          valuta: parseFloat(cîmp.next('.valuta').val())
        };
      });

      return sume;
    }

    // ------------------------------------------
    function colecteazăCheltuieli() {
      var $secţiune = Cheltuieli.$,
          itemi = {};

      Cheltuieli.adăugate.find('>.item').each(function() {
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

    if (procedură.număr) post();
    else $.get('/date/' + Utilizator.login + '/proceduri/', function(răspuns) {
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


    // -----
    function post() {
      var număr = HashController.date();

      $.post('/date/' + Utilizator.login + '/proceduri/' + număr, JSON.stringify(procedură), function() {
        if (Formular.seCreazăProcedurăNouă()) {
          window.skipEventOnce.hashchange = true;
          location.hash = 'formular?' + procedură.număr;

          Formular.seteazăTitlu();
        }

        $('html,body').animate({scrollTop: 0}, 500);

        Formular.titlu
          .attr('tabindex', 1)
          .focus()
          .removeAttr('tabindex');

        $('.instrumente .salvează+.mesaj')
          .fadeIn()
          .delay(1000)
          .fadeOut();

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

    TotalCheltuieli.calculează();

    Formular.titlu
      .attr('tabindex', 1)
      .focus()
      .removeAttr('tabindex');

    $('html,body').animate({scrollTop: 0}, 0);

    $.fx.off = false;

    // ------------------------------------------
    function populeazăSecţiune(selector, secţiune) {
      var $secţiune = $(selector), id;

      for (id in secţiune) {
        $secţiune.find('#' + id)
          .val1(secţiune[id])
          .trigger('change');
      }

      var item, prima = true;

      if (secţiune.subformular) {
        var adaugă = $secţiune.find('.adaugă');

        for (item in secţiune.subformular) {
          if (!prima) adaugă.click();

          $secţiune.find('.item').last()
            .find('.label').val(item).end()
            .find('input').val(secţiune.subformular[item]);
          prima = false;
        }
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
          $secţiune.find('li:has(button.adaugă-cîmp-personalizat)')
            .before($şabloane.find('.cîmp-personalizat').html());

          $cîmp = $secţiune.find('.etichetă+.sumă').last();
          $cîmp.prev().val(cîmp);
        }

        $cîmp.val(sume[cîmp].suma);
        $cîmp.next('.valuta').val(sume[cîmp].valuta);
      }
    }

    // ------------------------------------------
    function populeazăCheltuieli() {
      var $secţiune = Cheltuieli.$,
          $lista = $('#categorii-taxe-şi-speze');

      $.each(['onorariu', 'părţile-au-ajuns-la-conciliere'], function(i, cîmp) {
        $secţiune.find('#' + cîmp).val1(procedură.cheltuieli[cîmp]);
      });

      for (var id in procedură.cheltuieli.itemi) {
        $lista.find('#' + id).click();

        var item = procedură.cheltuieli.itemi[id],
            $item = Cheltuieli.adăugate.find('#' + id),
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
              $cîmp.val(this.document);

              if (this.destinatari) {
                $.each(this.destinatari, function() {
                  Destinatari.$.find('li:not(.categorie):contains("' + this + '")')
                    .clone()
                    .addClass('eliminabil de tot')
                    .appendTo($itemSubformular.find('.destinatari-adăugaţi'));
                });
              }

              if (this['destinatari-persoane-terţe']) {
                $.each(this['destinatari-persoane-terţe'], function() {
                  Destinatari.$.find('li.persoană.terţă')
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
    Formular.$
      .find('#document-executoriu')
        .find(':input').val('').end()
        .find('select').val(function() {return $(this).find('option:first').val()}).end()
      .end()
      .find('#cheltuieli')
        .find('.adăugate').empty().end()
        .find(':input:not([type="hidden"])').val('').end()
        .find('#părţile-au-ajuns-la-conciliere').attr('checked', false).end()
      .end()
      .find('#creditor').find(':input').val('').end().end()
      .find('.persoană-terţă').remove().end()
      .find('.debitor')
        .find('input,textarea').val('').end()
        .not(':first').remove().end()
        .first().removeClass('dispensabilă').end()
      .end()

      .find('#categorii-taxe-şi-speze')
        .find('.dezactivat').removeClass('dezactivat').end()
      .end();
  },

  închide: function() {
    Formular.$
      .fadeOut('fast', function() {location.hash = ''})
      .trigger('închidere');
  },

  deschide: function() {
    Formular.$
      .trigger('înainte-de-deschidere')
      .hide().fadeIn('fast');

    $.fx.off = true;

    if (Formular.seDeschideProcedurăSalvată() && !Formular.deschis) {
      Formular.încarcă();
    }

    Formular.seteazăTitlu();
    TotalCheltuieli.init();
    Defaults.init();

    $('html,body').animate({scrollTop: 0}, 0);

    Formular.titlu
      .attr('tabindex', 1)
      .focus()
      .removeAttr('tabindex');

    $.fx.off = false;
  }
}

// --------------------------------------------------

var ProceduriRecente = {
  încărcat: false,

  $: $('#proceduri-recente').find('table'),

  init: function() {
    ProceduriRecente.$.on('click', 'tr', function() {
      var număr = $(this).find('.număr').text().replace(Utilizator.login, '');

      location.hash = 'formular?' + număr;
    });
  },

  încarcă: function() {
    if (ProceduriRecente.încărcat) return;

    $.get('/date/' + Utilizator.login + '/proceduri/recente/', function(lista) {
      var proceduri = $(lista).find('a:not(:contains("../"))').map(function() {
        return {
          timp: moment($.trim(this.nextSibling.data).split(/\s{2,}/)[0], 'D-MMM-YYYY H:m').toDate(),
          număr: Utilizator.login + this.firstChild.data
        }
      }).get().sort(function(a, b) {
        return (b.timp - a.timp) || (a.număr > b.număr ? -1 : +1)
      });

      if (proceduri.length > 0) {
        var lista = {}

        $.each(proceduri, function() {
          lista[this.număr] = Căutare.index[this.număr][this.număr];
        });

        ProceduriRecente.$
          .html(ListăDeProceduri.formatează(lista))
          .on('mouseenter', 'tr', function() {this.className = 'selectat'})
          .on('mouseleave', 'tr', function() {this.removeAttribute('class')});

        ProceduriRecente.încărcat = true;
      }
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
  $: $('#căutare'),

  init: function() {
    Căutare.$.find('input')
      .on('input', Căutare.găseşte)
      .bind('keydown', 'down', Căutare.rezultate.selectează)
      .bind('keydown', 'up', Căutare.rezultate.selectează)
      .bind('keydown', 'return', Căutare.rezultate.deschide)
      .bind('keyup', 'esc', function() {$(this).val('').trigger('input')});

    Căutare.rezultate.$
      .on('mouseenter', 'tr', function() {this.className = 'selectat'})
      .on('mouseleave', 'tr', function() {this.removeAttribute('class')})
      .on('click', 'tr', Căutare.rezultate.deschide);

    Căutare.încarcăIndex();
  },

  rezultate: {
    $: $('#rezultate'),

    afişează: function(proceduri, text) {
      Căutare.rezultate.$.html(ListăDeProceduri.formatează(proceduri, text));
    },

    selectează: function(e) {
      e.preventDefault();

      var lista = Căutare.rezultate.$;

      if (!lista.find('tr').există()) return;

      var direcţia = e.data,
          spre = {up: 'prev', down: 'next'},
          deLa = {up: 'tr:last', down: 'tr:first'};

      var $item = lista.find('tr.selectat'),
          $spre = $item.există() ? $item[spre[direcţia]]() : lista.find(deLa[direcţia]);

      $item.removeClass('selectat');
      $spre.addClass('selectat');
    },

    deschide: function(e) {
      e.preventDefault();

      var item = Căutare.rezultate.$.find('tr.selectat'),
          număr = item.find('.număr').text().replace(Utilizator.login, '');

      if (!item.există()) return;

      location.hash = 'formular?' + număr;
    }
  },

  găseşte: function(e) {
    if (Căutare.timer) return;

    var text = $.reEscape($.trim(this.value));

    if (!text.length) {
      Căutare.anulează();
      return;
    }

    Căutare.timer = setTimeout(function() {
      var re = {
        laÎnceputDeRînd: new RegExp('^' + text, 'gi'),
        laÎnceputDeCuvînt: new RegExp('\\b' + text, 'gi'),
        oriunde: new RegExp(text, 'gi')
      };

      var rezultate = {
        laÎnceputDeRînd: [],
        laÎnceputDeCuvînt: [],
        oriunde: [],
        unificate: function() {
          var unice = {},
              toate = this.laÎnceputDeRînd
                .concat(this.laÎnceputDeCuvînt)
                .concat(this.oriunde);

          $.each(toate, function(_, i) {
            $.each(Căutare.index[i], function(număr, item) {
              if (!unice[număr]) unice[număr] = Căutare.index[i][număr];
            });
          });

          return unice;
        }
      };

      for (var item in Căutare.index) {
        if (re.laÎnceputDeRînd.test(item)) rezultate.laÎnceputDeRînd.push(item);
        else if (re.laÎnceputDeCuvînt.test(item)) rezultate.laÎnceputDeCuvînt.push(item);
        else if (re.oriunde.test(item)) rezultate.oriunde.push(item);
      }

      Căutare.anulează();
      Căutare.rezultate.afişează(rezultate.unificate(), text);
    }, 10);
  },

  anulează: function() {
    clearTimeout(Căutare.timer);
    delete Căutare.timer;

    Căutare.rezultate.$.html('');
  },

  încarcăIndex: function() {
    setTimeout(function() {
      $.getJSON('/date/' + Utilizator.login + '/proceduri/index', function(data) {
        Căutare.index = data;
        ProceduriRecente.încarcă();
      });
    }, 500);
  }
};

// --------------------------------------------------

var ListăDeProceduri = {
  formatează: function(proceduri, text) {
    var rezultate = '';

    for (var număr in proceduri) {
      var procedură = evidenţiază(proceduri[număr]),
          creditor = persoană(procedură['creditor']),
          persoaneTerţe = $.map(procedură['persoane-terţe'], function(p) {return persoană(p)}).join(''),
          debitori = $.map(procedură['debitori'], function(p) {return persoană(p)}).join('');

      rezultate +=
        '<tr>' +
          '<td>' +
            '<div class="număr">' + evidenţiază(număr) + '</div>' +
            '<span class="data-hotărîrii">' + procedură['data-hotărîrii'] + '</span>' +
          '</td>' +
          '<td><dl class="persoane">' + creditor + persoaneTerţe + '</dl></td>' +
          '<td class="vs">vs.</td>' +
          '<td><dl class="persoane">' + debitori + '</dl></td>' +
        '</tr>';
    }

    return rezultate;


    function evidenţiază(content) {
      if ($.isPlainObject(content)) {
        var itemi = {};

        for (var item in content) {
          if (item == 'data-hotărîrii') {
            itemi[item] = content[item];
          } else {
            itemi[item] = evidenţiază(content[item]);
          }
        }

        return itemi;
      } else if ($.isArray(content)) {
        return $.map(content, function(item) {return evidenţiază(item)});
      } else {
        var reFragment = new RegExp('(' + text + ')', 'gi');

        return content.replace(reFragment, '<b>$1</b>');
      }
    }

    function persoană(p) {
      return '' +
        '<dt>' + (p.denumire || p.nume || '') + '</dt>' +
        '<dd>' + (p.idno || p.idnp || '') + '</dd>';
    }
  }
};

// --------------------------------------------------

var Calculator = {
  $: $('#calculator'),

  init: function() {
    DobîndaDeÎntîrziere.init();

    Calculator.$
      .on('click', 'button.închide', Calculator.închide)
      .on('click', 'button.adaugă', Calculator.adaugăSumă)
      .on('keyup update paste click change', ':input:not(#dobînda)', DobîndaDeÎntîrziere.calculează)
      .find(':input').bind('keydown', 'esc', Calculator.închide);

    $('#bara-de-sus .calculator').on('click', function() {
      if (Calculator.$.is(':visible')) Calculator.închide();
      else Calculator.deschide();
    });
  },

  deschide: function() {
    Calculator.$
      .stop(true, true)
      .fadeToggle('fast', 'easeInCirc')
      .find('input').first().focus();

    Calculator.resetează();
  },

  resetează: function() {
    Calculator.$
      .find('input:text').val('').end()
      .find('#art619-1').removeAttr('checked').end()
      .find('#art619-2').attr('checked', 'checked').end()
      .find('#sume .item:not(.prima)').remove();
  },

  închide: function() {
    Calculator.$
      .stop(true, true)
      .hide();
  },

  adaugăSumă: function() {
    var buton = $(this),
        item = buton.parent().prev('li');

    item.clone()
      .removeClass('prima')
      .find('.sumă').val('').end()
      .hide()
      .insertAfter(item)
      .show('blind');
  }
};

// --------------------------------------------------

var Instrumente = {
  $: null,

  init: function() {
    Instrumente.$ = $('.instrumente');
    Instrumente.initOpţiuniPentruButoane();
    Instrumente.$.on('click', '>button', function() {
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
    Formular.$
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

var FormularPensie = {
  buton: $şabloane.find('.sume-pensie#butonul'),

  încasări: $('#obiectul-urmăririi .conţinut').sortable({
    items: '.încasare',
    handle: '.titlu',
    cancel: '#butonul',
    placeholder: 'ui-state-highlight',
    tolerance: 'pointer',
    forcePlaceholderSize: true,
    forceHelperSize: true,
    axis: 'y',
    start: function(event, ui) {
      $(this).find('.eliminabil')
        .removeClass('eliminabil')
        .addClass('x-eliminabil');
    },
    stop: function(event, ui) {
      $(this).find('.x-eliminabil')
        .removeClass('x-eliminabil')
        .addClass('eliminabil');
    }
  }),

  init: function() {
    FormularPensie.setează();
    FormularPensie.buton
      .on('mouseenter', '#adaugă', this.opţiuni.afişează)
      .on('mouseleave', '#adaugă', this.opţiuni.ascunde)
      .on('click', '#adaugă li', this.adaugăÎncasare);
  },

  opţiuni: {
    afişează: function() {
      $(this).find('ul').afişează();
    },

    ascunde: function() {
      $(this).find('ul').ascunde();
    }
  },

  adaugăÎncasare: function() {
    $şabloane.find('.sume-pensie#' + $(this).text() + '>.încasare').clone()
      .removeAttr('id')
      .insertBefore(FormularPensie.buton)
      .effect('highlight', {}, 1200);

    FormularPensie.încasări.sortable('refresh');;
  },

  setează: function() {
    Formular.$
      .one('înainte-de-deschidere', this.inserează)
      .one('închidere', this.elimină);
  },

  inserează: function() {
    var secţiune = $(this).find('#obiectul-urmăririi');

    secţiune
      .data('formular-iniţial', secţiune.html())
      .find('.conţinut').html(FormularPensie.buton);
  },

  elimină: function() {
    var secţiune = $(this).find('#obiectul-urmăririi');

    secţiune.html(secţiune.data('formular-iniţial'));
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
