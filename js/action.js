// valoarea unităţii convenţionale
var UC = 20;
var RE_FORMATUL_DATEI = /(\d{2})\.(\d{2})\.(\d{4})/,
    FORMATUL_DATEI = 'DD.MM.YYYY';

window.$şabloane = $('#şabloane');
window.skipEventOnce = {};

var Action = {
  init: function() {
    Utilizator.init();
    HashController.init();

    Valute.populeazăListe();
    FormulareŞablon.init();
    CîmpuriTextarea.autodimensionează();
    ListeFoarteLate.seteazăŞoapte();
    Persoane.init();
    Cheltuieli.init();
    ButonDeEliminare.init();
    Întîrzieri.init();
    Formular.init();
    Instrumente.init();
    CalculatorDobîndaÎntîrziere.init();
    Calendar.init();
    CîmpuriPersonalizate.init();
    ProceduriRecente.init();
    Sume.init();
    FormularPensie.init();
    Rapoarte.init();

    $(window).trigger('hashchange');

    if (Utilizator.autentificat) {
      Căutare.init();
    }
  },

  '#index': function() {
    $('#căutare input').focus();
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
    Formular.$
      .on('click', 'button.adaugă.persoană', this.adaugă)
      .on('click', 'button.elimină-persoană', this.elimină);
  },

  adaugă: function() {
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
  },

  elimină: function() {
    var button = $(this),
        aceastăPersoană = button.closest('fieldset');
        celelaltePersoane = aceastăPersoană.siblings('fieldset');

    aceastăPersoană.slideUp(function() {
      aceastăPersoană.remove()
      celelaltePersoane.toggleClass('dispensabilă', celelaltePersoane.length > 1);
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
    Formular.$.on('change', FormulareŞablon.selector, this.inserează);
  },

  inserează: function(e, automat) {
    var $select = $(this),
        selectorŞablon = '.' + $select.attr('id') + '.conţinut[title="' + $select.val() + '"]',
        şablon = FormulareŞablon.parseazăIncluderile($şabloane.find(selectorŞablon).html()),
        item = $select.closest('li'),
        $subformular;

    item.nextAll().remove();
    item.after(şablon);

    $subformular = item.nextAll();
    $subformular.find(FormulareŞablon.selector).trigger('change', ['automat']);

    if (!Formular.sePopulează && !Formular.seIniţializează) {
      $subformular
        .find(':input:not(' + FormulareŞablon.selector + ')').first().focus().end().end()
        .find('.adaugă-cîmp-personalizat.implicit').click();
    }

    $subformular.effect('highlight', {}, 1200, function() {$(this).clearQueue()});
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

    Destinatari.init();
    Onorariu.init();
    TotalCheltuieli.init();
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
        .show('blind');

      if (!Formular.sePopulează) item.find('textarea').focus();

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
          şablon = $şabloane.find('.subformular[title="' + numeŞablon + '"] .document').first(),
          $subformular = şablon.clone();

      $subformular
        .hide()
        .insertBefore($(this).parent())
        .show('blind');

      if (!Formular.sePopulează) $subformular.find('textarea,input').first().focus();

      TotalCheltuieli.calculează();
    }
  },

  destinatariDocumenteAdresabile: {
    init: function() {
      Cheltuieli.adăugate
        .on('click', '.destinatari-adăugaţi', this.ascundeSauAfişează)
        .on('eliminare', '.destinatari-adăugaţi .eliminabil', this.ascundeListaDacăNuMaiSunt)
        .on('eliminare', '.destinatari-adăugaţi .eliminabil', TotalCheltuieli.calculează)
        .on('keydown', '.destinatari-adăugaţi .persoană.terţă input', this.ascunînceputPerioadăEnterSauEsc);
    },

    ascunînceputPerioadăEnterSauEsc: function(e) {
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
        data.val(moment().format(FORMATUL_DATEI));
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
        .append(Destinatari.persoanăTerţă);

      if (!Formular.sePopulează && !Formular.seIniţializează) destinatar.find('input').focus();
    }

    TotalCheltuieli.calculează();
  }
};

// --------------------------------------------------

var ButonDeEliminare = {
  $: $şabloane.find('.elimină'),
  itemPrecedent: $(),

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

    buton.hide().fadeIn();

    ButonDeEliminare.itemPrecedent.removeClass('spre-eliminare');
    ButonDeEliminare.itemPrecedent = eliminabil.addClass('spre-eliminare');
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

    $('#autentificare').toggle(!Utilizator.autentificat);
    $('body').toggleClass('autentificat', Utilizator.autentificat);

    $(document).ajaxError(function(e, response) {
      if (response.status == 401) { // 401 Authorization Required
        $.cookie('login', null);
        location.href = $('#autentificare a').attr('href');
      }
    });
  }
};

// --------------------------------------------------

var Formular = {
  $: $('#formular'),

  $titlu: $('#formular h1'),
  $obiectulUrmăririi: $('#formular #obiectul-urmăririi'),

  init: function() {
    Formular.$
      .on('click', 'button.închide', Formular.închide)
      .on('click', 'button.salvează', Formular.trimite)
      .on('keydown', function(e) {if (e.keyCode == 27) Formular.închide()})
      .on('închidere', Formular.resetează)
      .on('populat iniţializat', Formular.calculează)
      .on('populat iniţializat', Formular.eliminăAmendaDupăCaz)
      .on('salvat', Formular.actualizeazăDataUltimeiModificări);

    $(window).on('hashchange', function() {
      if (/^#formular/.test(location.hash)) Formular.deschide();
      else Formular.închide();
    });
  },

  eliminăAmendaDupăCaz: function() {
    if (Formular.deOrdingGeneral()) {
      Formular.$obiectulUrmăririi.find('li:has(#amendă)').remove();
    }
  },

  actualizeazăDataUltimeiModificări: function(e, procedură) {
    Formular.$.find('#data-ultimei-modificări span').text(procedură.dataUltimeiModificări);
  },

  calculează: function() {
    Formular.deschis = true;

    $.fx.off = true;

    TotalCheltuieli.calculează();
    Onorariu.calculează();
    Formular.seteazăTitlu();

    $.fx.off = false;

    Formular.focusează();
  },

  focusează: function() {
    $('html,body').animate({scrollTop: 0}, 500, function() {
      Formular.$titlu
        .attr('tabindex', 1)
        .focus()
        .removeAttr('tabindex');
    });
  },

  deOrdingGeneral: function() {
    return /^(\d+)?$/.test(HashController.date());
  },

  pensieDeÎntreţinere: function() {
    return HashController.date().substr(0, 1) == 'P';
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
            'label+input.dată:not(.perioadă)',
            '.dată.perioadă',
            'label+input.sumă',
            'label+input.cotă',
            'label+select.foarte.lat',
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
      var $secţiune = Formular.$obiectulUrmăririi,
          obiectulUrmăririi = colectează($secţiune);

      if (Formular.pensieDeÎntreţinere()) {
        obiectulUrmăririi = {'încasări': colecteazăÎncasări($secţiune)};
      }

      if (obiectulUrmăririi.caracter == 'pecuniar') {
        obiectulUrmăririi['sume'] = colecteazăSumeÎnValută($secţiune);
        obiectulUrmăririi['întîrzieri'] = colecteazăÎntîrzieri($secţiune);
      }

      return obiectulUrmăririi;
    }

    // ------------------------------------------
    function colecteazăÎntîrzieri($secţiune) {
      return $secţiune.find('.întîrziere').map(function() {
        var $întîrziere = $(this);

        return {
          începutPerioadă: $întîrziere.find('.început.perioadă').val(),
          sfîrşitPerioadă: $întîrziere.find('.sfîrşit.perioadă').val(),
          rata: $întîrziere.find(':radio:checked').val(),
          suma: $întîrziere.find('.sumă.întîrziată').val(),
          dobînda: $întîrziere.find('.sumă.dobîndă').val()
        };
      }).get();
    }

    // ------------------------------------------
    function colecteazăÎncasări($secţiune) {
      return $secţiune.find('.fieldset.încasare').map(function() {
        return colectează(this);
      }).get();
    }

    // ------------------------------------------
    function colecteazăSumeÎnValută($secţiune) {
      var sume = {};

      $secţiune.find('.sumă+.valuta').each(function() {
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
      procedură.dataUltimeiModificări = moment().format('DD.MM.YYYY HH:mm');

      $.post('/date/' + Utilizator.login + '/proceduri/' + procedură.număr, JSON.stringify(procedură), function() {
        if (Formular.seCreazăProcedurăNouă()) {
          window.skipEventOnce.hashchange = true;
          location.hash = 'formular?' + procedură.număr;

          Formular.seteazăTitlu();
        }

        Formular.$.trigger('salvat', [procedură]);
        Formular.focusează();
        Formular.$.find('.instrumente .salvează+.mesaj')
          .fadeIn()
          .delay(1000)
          .fadeOut();

        Căutare.încarcăIndexFărăCache();
        ProceduriRecente.încărcat = false;
      });
    }
  },

  încarcă: function() {
    var număr = HashController.date();

    $.getJSON('/date/' + Utilizator.login + '/proceduri/' + număr)
      .success(function(procedură) {
        ProceduriRecente.notează(număr);
        Formular.populează(procedură);
      })
      .error(Formular.închide);

  },

  populează: function(procedură) {
    $.fx.off = true;
    Formular.sePopulează = true;

    Formular.$.find('#data-ultimei-modificări span').text(procedură.dataUltimeiModificări);

    populeazăSecţiune('#document-executoriu', procedură['document-executoriu']);
    populeazăObiectulUrmăririi();
    populeazăCheltuieli();
    populeazăSecţiune('#creditor', procedură['creditor']);
    populeazăPersoaneleTerţe();
    populeazăDebitori();

    $.fx.off = false;
    Formular.sePopulează = false;
    Formular.$.trigger('populat');

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
    function populeazăPensieÎntreţinere($secţiune, încasări) {
      if (!încasări) return;


      var $încasare, i, prima = true,
          buton = $secţiune.find('.adaugă.încasare');

      for (i = 0; i < încasări.length; i++) {
        if (!prima) buton.click();

        $încasare = $secţiune.find('.fieldset.încasare:last');
        populeazăSecţiune($încasare, încasări[i]);

        prima = false;
      }
    }

    // ------------------------------------------
    function populeazăObiectulUrmăririi() {
      var $secţiune = Formular.$obiectulUrmăririi,
          secţiune = procedură['obiectul-urmăririi'];

      populeazăSecţiune($secţiune, secţiune);

      if (Formular.pensieDeÎntreţinere()) {
        populeazăPensieÎntreţinere($secţiune, secţiune['încasări']);
      }

      if (secţiune['caracter'] == 'pecuniar') {
        populeazăSume($secţiune, secţiune['sume']);
        populeazăÎntîrzieri($secţiune, secţiune['întîrzieri']);
      }
    }

    // ------------------------------------------
    function populeazăÎntîrzieri($secţiune, întîrzieri) {
      if (!întîrzieri) return;

      var întîrziere, $întîrziere,
          buton = $secţiune.find('#adaugă-întîrziere');

      for (var i = 0; i < întîrzieri.length; i++) {
        întîrziere = întîrzieri[i];

        buton.click();
        $întîrziere = $secţiune.find('.întîrziere:last');
        $întîrziere.find('.început.perioadă').val(întîrziere['începutPerioadă']);
        $întîrziere.find('.sfîrşit.perioadă').val(întîrziere['sfîrşitPerioadă']);
        $întîrziere.find(':radio[value="' + întîrziere['rata'] + '"]').attr('checked', true);
        $întîrziere.find('.sumă.întîrziată').val(întîrziere['suma']);
        $întîrziere.find('.sumă.dobîndă').val(întîrziere['dobînda']);
      }
    }

    // ------------------------------------------
    function populeazăSume($secţiune, sume) {
      var cîmp, $cîmp;

      for (cîmp in sume) {
        $cîmp = $secţiune.find('label:contains(' + cîmp + ')+.sumă');

        if (!$cîmp.există()) {
          $secţiune.find('li:has(button.adaugă-cîmp-personalizat)')
            .before($şabloane.find('.cîmp-personalizat').html());

          $cîmp = $secţiune.find('.etichetă+.sumă').last();
          $cîmp.prev().val(cîmp).trigger('focus');
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
      .stop(true, true)
      .find('.instrumente').fadeOut().end()
      .animate({'top': $(window).height()}, function() {
        $(this).hide();
        location.hash = '';
      })
      .trigger('închidere');
  },

  deschide: function() {
    $.fx.off = true;
    Formular.$.trigger('înainte-de-deschidere');
    $.fx.off = false;

    Formular.$
      .stop(true, true)
      .find('.instrumente').fadeIn().end()
      .css('top', $(window).height())
      .show()
      .animate({'top': '75px'});

    if (Formular.seDeschideProcedurăSalvată()) {
      Formular.încarcă();
    } else {
      Formular.iniţializează();
      Formular.$.trigger('iniţializat');
    }
  },

  iniţializează: function() {
    $.fx.off = true;
    Formular.seIniţializează = true;

    Formular.$.find('#data-ultimei-modificări span').text('încă nu e salvată');
    Formular.$.find('#creditor #gen-persoană, .debitor #gen-persoană').trigger('change');

    Formular.$obiectulUrmăririi.on('change', '#obiect', function() {
      var obiect = $(this).val(),
          genCreditor = $('#creditor #gen-persoană'),
          genDebitor = $('.debitor #gen-persoană');

      switch(obiect) {
        case 'restabilirea la locul de muncă':
          genCreditor.val('fizică');
          genDebitor.val('juridică');
          break;

        case 'stabilirea domiciliului copilului':
          genCreditor.val('fizică');
          genDebitor.val('fizică');
          break;
      }

      genCreditor.trigger('change', ['automat']);
      genDebitor.trigger('change', ['automat']);
    });

    if (Formular.seCreazăProcedurăNouă()) {
      $('#taxaA1').click();

      var caracterProcedură = $('#caracter'),
          genCreditor = $('#creditor #gen-persoană');

      switch (HashController.date()) {
        case 'S':
          caracterProcedură.val('pecuniar');
          genCreditor.val('juridică');
          break;

        case 'P':
          genCreditor.val('fizică');
          break;

        default:
          caracterProcedură.val('pecuniar');
          genCreditor.val('juridică');
          break;
      }

      caracterProcedură.trigger('change');
      genCreditor.trigger('change');
    }

    TotalCheltuieli.calculează();

    $.fx.off = false;
    Formular.seIniţializează = false;
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

  url: function() {
    return '/date/' + Utilizator.login + '/proceduri/recente';
  },

  încarcă: function() {
    if (ProceduriRecente.încărcat || !Căutare.index) return;

    $.getJSON(ProceduriRecente.url(), ProceduriRecente.afişează);
  },

  afişează: function(proceduri) {
    if (proceduri.length == 0 || !Căutare.index) return;

    var lista = {};

    $.each(proceduri, function() {
      var număr = Utilizator.login + this.toString();

      lista[număr] = Căutare.index[număr][număr];
    });

    ProceduriRecente.$
      .html(ListăDeProceduri.formatează(lista))
      .on('mouseenter', 'tr', function() {this.className = 'selectat'})
      .on('mouseleave', 'tr', function() {this.removeAttribute('class')});

    ProceduriRecente.încărcat = true;
  },

  notează: function(număr) {
    $.post(ProceduriRecente.url(), număr, ProceduriRecente.afişează);
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


    Căutare.adresăIndex = '/date/' + Utilizator.login + '/proceduri/index';
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
          începutPerioadă = {up: 'tr:last', down: 'tr:first'};

      var $item = lista.find('tr.selectat'),
          $spre = $item.există() ? $item[spre[direcţia]]() : lista.find(începutPerioadă[direcţia]);

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

  încarcăIndexFărăCache: function() {
    $.post(Căutare.adresăIndex, Căutare.seteazăIndex);
  },

  încarcăIndex: function() {
    $.getJSON(Căutare.adresăIndex, Căutare.seteazăIndex);
  },

  seteazăIndex: function(data) {
    Căutare.index = data;
    ProceduriRecente.încarcă();
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
          '<td class="persoane">' + creditor + persoaneTerţe + '</td>' +
          '<td class="vs">vs.</td>' +
          '<td class="persoane">' + debitori + '</td>' +
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
        '<div class="nume">' + (p.denumire || p.nume || '') + '</div>' +
        '<div class="id">' + (p.idno || p.idnp || '') + '</div>';
    }
  }
};

// --------------------------------------------------

var CalculatorDobîndaÎntîrziere = {
  $: $('#calculator'),

  init: function() {
    CalculatorDobîndaÎntîrziere.$
      .on('click', 'button.închide', this.închide)
      .on('click', 'button.adaugă', this.adaugăSumă)
      .on('keyup update paste click change', ':input:not(#dobînda)', this.calculeazăDobînda)
      .find(':input').bind('keydown', 'esc', this.închide);

    $('#bara-de-sus .calculator').on('click', function() {
      if (CalculatorDobîndaÎntîrziere.$.is(':visible')) CalculatorDobîndaÎntîrziere.închide();
      else CalculatorDobîndaÎntîrziere.deschide();
    });
  },

  deschide: function() {
    CalculatorDobîndaÎntîrziere.$
      .stop(true, true)
      .fadeToggle('fast', 'easeInCirc')
      .find('input').first().focus();

    CalculatorDobîndaÎntîrziere.resetează();
  },

  resetează: function() {
    CalculatorDobîndaÎntîrziere.$
      .find('input:text').val('').end()
      .find('#art619-1').removeAttr('checked').end()
      .find('#art619-2').attr('checked', 'checked').end()
      .find('#sume .item:not(.prima)').remove();
  },

  închide: function() {
    CalculatorDobîndaÎntîrziere.$
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

    item.next().find('.sumă').focus();
  },

  calculeazăDobînda: function() {
    var secţiune = CalculatorDobîndaÎntîrziere.$,
        întîrziere = Întîrzieri.colectează(secţiune),
        dobînda = (întîrziere);

    secţiune.find('#dobînda').val(dobînda);
  }
};

// --------------------------------------------------

var Instrumente = {
  $: $('.instrumente'),

  init: function() {
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
    monthNamesShort: 'Ian Feb Mar Apr Mai Iun Iul Aug Sep Oct Noi Dec'.split(' '),
    firstDay: 1,
    showAnim: 'fadeIn',
    prevText: 'Luna precedentă',
    nextText: 'Luna viitoare',
    showOn: 'none',
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-60:c+10',
    onSelect: function() {Calendar.închide(this)}
  },

  închide: function(el) {
    el = $(el);

    if (el.data('id')) el.attr('id', el.data('id'));

    el.datepicker('destroy').focus().trigger('input');
  },

  init: function() {
    $('.dată')
      .after(
        $('<span>')
          .addClass('ui-icon ui-icon-calendar semiascuns')
          .attr('title', 'Calendar')
      )
      .attr('title', 'Data trebuie să fie în formatul ZZ.LL.AAAA');

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

            if (cîmp.is('.dată.sfîrşit.perioadă')) {
              var începutPerioadă = cîmp.siblings('.început.perioadă');

              începutPerioadă = $.trim(începutPerioadă.val());

              if (RE_FORMATUL_DATEI.test(începutPerioadă)) {
                var minDate = moment(începutPerioadă, FORMATUL_DATEI).add('days', 1).toDate();

                cîmp.datepicker('option', 'minDate', minDate);
              }
            }
          }

          cîmp.datepicker('show');
        }
      })
      .on('keydown', '.dată', function(e) {
        if (e.keyCode == 27) Calendar.închide();
      });
  }
};

// --------------------------------------------------

var CîmpuriPersonalizate = {
  init: function() {
    Formular.$
      .on('click', 'button.adaugă-cîmp-personalizat', this.adaugă)
      .on('keydown', '.etichetă', function(e) {
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
        .find('.etichetă')
          .val(buton.data('etichetă'))
          .focus()
        .end()
        .show('blind', function() {
          $(this).find('.etichetă').select();
        });
  }
};

// --------------------------------------------------

var FormularPensie = {
  $: $(),
  $cota: $(),

  init: function() {
    Formular.$
      .on('înainte-de-deschidere', this.inserează)
      .on('închidere', this.elimină);

    Formular.$obiectulUrmăririi
      .on('input', '.încasare input', this.caluleazăOnorariulŞiPensia)
      .on('click', '.încasare button.adaugă', this.adaugăÎncasare);
  },

  evalueazăCota: function(cota) {
    cota = $.trim(cota).replace(/[^\/\d\.\,%]/g, '');

    if (/%$/.test(cota)) cota = cota.replace('%', '/100');

    try {
      cota = eval(cota);
    } catch(e) {
      cota = 0;
    }

    return cota;
  },

  caluleazăOnorariulŞiPensia: function(e) {
    var $încasare = $(this).closest('.încasare'),
        genulÎncasării = $încasare.find('#genul-încasării').val(),
        modulDeCuantificare = $încasare.find('#modul-de-cuantificare-' + genulÎncasării).val(),
        cota, pensia;

    FormularPensie.calculare[genulÎncasării + ' ' + modulDeCuantificare]($încasare);
  },

  calculare: {
    'periodică cotă': function($încasare) {
      var cota = FormularPensie.evalueazăCota($încasare.find('#cota-din-venit').val()),
          venitul = $încasare.find('#venitul').suma(),
          pensia = venitul * cota;

      if (isNaN(pensia)) return;

      $încasare.find('#pensie-cotă').val(pensia.toFixed(2));
      $încasare.find('#onorariul-calculat').val(Onorariu.pecuniar(pensia).toFixed(2));
    },

    'periodică sumă fixă': function($încasare) {
      var pensia = $încasare.find('#pensia-lunară-suma-fixă').suma();

      if (isNaN(pensia)) return;

      $încasare.find('#onorariul-calculat').val(Onorariu.pecuniar(pensia).toFixed(2));
    },

    'periodică mixtă': function($încasare) {
      var cota = FormularPensie.evalueazăCota($încasare.find('#cota-din-venit').val()),
          venitul = $încasare.find('#venitul').suma(),
          pensiaCotă = venitul * cota;

      if (isNaN(pensiaCotă)) return;

      $încasare.find('#pensie-cotă').val(pensiaCotă.toFixed(2));

      var pensiaSumăFixă = $încasare.find('#pensia-lunară-suma-fixă').suma(),
          totalPensie = pensiaCotă + pensiaSumăFixă;

      if (isNaN(totalPensie)) return;

      $încasare.find('#total-pensie-general').val(totalPensie.toFixed(2));
      $încasare.find('#onorariul-calculat').val(Onorariu.pecuniar(totalPensie).toFixed(2));
    },

    'restantă cotă': function($încasare) {
      var cota = FormularPensie.evalueazăCota($încasare.find('#cota-din-venit').val()),
          totalVenit = $încasare.find('#total-venit-pe-perioadă').suma(),
          totalPensieCotă = cota * totalVenit;

      if (isNaN(totalPensieCotă)) return;

      $încasare.find('#total-pensie-cotă').val(totalPensieCotă.toFixed(2));
      $încasare.find('#onorariul-calculat').val(Onorariu.pecuniar(totalPensieCotă).toFixed(2));
    },

    'restantă sumă fixă': function($încasare) {
      var numărulDeLuni = FormularPensie.numărulDeLuni($încasare),
          pensiaLunară = $încasare.find('#pensia-lunară-suma-fixă').suma(),
          totalPensie = pensiaLunară * numărulDeLuni;

      if (isNaN(totalPensie)) return;

      $încasare.find('#total-pensie-sumă-fixă').val(totalPensie.toFixed(2));
      $încasare.find('#onorariul-calculat').val(Onorariu.pecuniar(totalPensie).toFixed(2));
    },

    'restantă mixtă': function($încasare) {
      var cota = FormularPensie.evalueazăCota($încasare.find('#cota-din-venit').val()),
          totalVenit = $încasare.find('#total-venit-pe-perioadă').suma(),
          totalPensieCotă = cota * totalVenit;

      if (isNaN(totalPensieCotă)) return;

      $încasare.find('#total-pensie-cotă').val(totalPensieCotă.toFixed(2));

      var numărulDeLuni = FormularPensie.numărulDeLuni($încasare),
          pensiaLunarăSumăFixă = $încasare.find('#pensia-lunară-suma-fixă').suma(),
          totalPensieSumăFixă = numărulDeLuni * pensiaLunarăSumăFixă;

      if (isNaN(totalPensieSumăFixă)) return;

      $încasare.find('#total-pensie-sumă-fixă').val(totalPensieSumăFixă.toFixed(2));

      var totalPensie = totalPensieCotă + totalPensieSumăFixă;

      $încasare.find('#total-pensie-general').val(totalPensie.toFixed(2));
      $încasare.find('#onorariul-calculat').val(Onorariu.pecuniar(totalPensie).toFixed(2));
    }
  },

  numărulDeLuni: function($încasare) {
    var începutPerioadă = $încasare.find('#început-perioadă').val(),
        sfîrşitPerioadă = $încasare.find('#sfîrşit-perioadă').val();

    if (!RE_FORMATUL_DATEI.test(începutPerioadă) || !RE_FORMATUL_DATEI.test(sfîrşitPerioadă)) return 0;

    începutPerioadă = moment(începutPerioadă, FORMATUL_DATEI);
    sfîrşitPerioadă = moment(sfîrşitPerioadă, FORMATUL_DATEI);

    return sfîrşitPerioadă.diff(începutPerioadă, 'months', true);
  },

  adaugăÎncasare: function() {
    var $încasare = $($şabloane.find('#formular-încasare').html());

    $încasare
      .hide()
      .insertBefore(this)
      .show('blind');

    $.fx.off = true;
    $încasare.find('#genul-încasării').trigger('change');
    $.fx.off = false;

    if (!Formular.sePopulează) $încasare.find('input').first().focus();
  },

  inserează: function() {
    if (!Formular.pensieDeÎntreţinere()) return;

    var $secţiune = Formular.$obiectulUrmăririi.find('.conţinut'),
        şablon = FormulareŞablon.parseazăIncluderile($şabloane.find('#pensie-de-întreținere').html());

    $secţiune
      .data('conţinut-iniţial', $secţiune.html())
      .html(şablon)
      .find('#genul-încasării').trigger('change');

    FormularPensie.$ = $secţiune;
    Formular.focusează();
  },

  elimină: function() {
    if (!Formular.pensieDeÎntreţinere()) return;

    var secţiune = Formular.$obiectulUrmăririi.find('.conţinut');

    secţiune.html(secţiune.data('conţinut-iniţial'));
    secţiune.removeData('conţinut-iniţial');
  }
};

// --------------------------------------------------

var DobîndaDeÎntîrziere = {
  // test: '04.09.2009', '14.06.2012', 9, 363761.50 == 162227.68
  calculează: function(întîrziere) {
    var începutPerioadă = întîrziere.începutPerioadă,
        sfîrşitPerioadă = întîrziere.sfîrşitPerioadă,
        rata = întîrziere.rata,
        suma = întîrziere.suma;

    if (!RE_FORMATUL_DATEI.test(începutPerioadă) || !RE_FORMATUL_DATEI.test(sfîrşitPerioadă)) return;

    începutPerioadă = moment(începutPerioadă, FORMATUL_DATEI).format('YYYY-MM-DD');
    sfîrşitPerioadă = moment(sfîrşitPerioadă, FORMATUL_DATEI).format('YYYY-MM-DD');
    rata = parseInt(rata);

    DobîndaDeÎntîrziere.raport = {
      începutPerioadă: moment(începutPerioadă, 'YYYY-MM-DD').format(FORMATUL_DATEI),
      sfîrşitPerioadă: moment(sfîrşitPerioadă, 'YYYY-MM-DD').format(FORMATUL_DATEI),
      rata: rata,
      suma: suma,
      rînduri: {}
    };

    var data, dataPrecedentă, primaDatăAplicabilă,
        durate = {},
        rînd = {};

    for (data in RateDeBază) {
      if (data > începutPerioadă) break;

      dataPrecedentă = data;
    }

    primaDatăAplicabilă = dataPrecedentă;
    dataPrecedentă = null;

    for (data in RateDeBază) {
      if (dataPrecedentă) {
        if (dataPrecedentă == primaDatăAplicabilă) {
          durate[dataPrecedentă] = zileÎntre(începutPerioadă, data);
        } else if (data > sfîrşitPerioadă) {
          durate[dataPrecedentă] = zileÎntre(dataPrecedentă, sfîrşitPerioadă) + 1; // + 1 include ultima zi
        } else {
          durate[dataPrecedentă] = zileÎntre(dataPrecedentă, data);
        }

      }

      dataPrecedentă = data;
    }

    durate[data] = zileÎntre(data, sfîrşitPerioadă);

    function zileÎntre(data1, data2) {
      if (typeof data1 == 'string') data1 = moment(data1, 'YYYY-MM-DD').toDate();
      if (typeof data2 == 'string') data2 = moment(data2, 'YYYY-MM-DD').toDate();

      return Math.round((data2 - data1) / (24 * 3600 * 1000));
    }

    var rataFinală, dobînda = 0, dobîndaPerRînd, primulRînd = true;

    for (data in RateDeBază) {
      if (data < primaDatăAplicabilă) continue;
      if (data > sfîrşitPerioadă) break;

      rataFinală = (RateDeBază[data] + rata) / 100;
      dobîndaPerRînd = parseFloat((suma * rataFinală / 365 * durate[data]).toFixed(2));
      dobînda += dobîndaPerRînd;

      DobîndaDeÎntîrziere.raport.rînduri[data] = {
        data: moment(primulRînd ? începutPerioadă : data, 'YYYY-MM-DD').format(FORMATUL_DATEI),
        durata: durate[data],
        rata: RateDeBază[data],
        dobînda: dobîndaPerRînd
      };

      primulRînd = false;
    }

    return parseFloat(dobînda.toFixed(2));
  },

  raport: {}
};

// --------------------------------------------------

var Onorariu = {
  init: function() {
    var schimbareDate = 'keyup update paste change input',
        cîmpuriRelevante = [
          '.sumă:not(.irelevant-pentru-onorariu)',
          '.sumă:not(.calculat)',
          '.valuta',
          'input:checkbox',
          '#caracter',
          '#obiect'
        ].join(',');

    Formular.$obiectulUrmăririi.on(schimbareDate, cîmpuriRelevante, Onorariu.calculează);
    Formular.$.on(schimbareDate, '.debitor #gen-persoană, #părţile-au-ajuns-la-conciliere', Onorariu.calculează);
  },

  calculează: function() {
    if (!Formular.deschis) return;

    var $secţiune = Formular.$obiectulUrmăririi,
        caracter = $secţiune.find('#caracter').val(),
        genPersoană = $('.debitor #gen-persoană').val(),
        onorariu = 0;

    if (caracter == 'nonpecuniar') {
      var obiect = $('#obiect').val();

      valoare = Onorariu.nonpecuniar[obiect][genPersoană];
      onorariu = typeof valoare == 'function' ? valoare() : valoare;
    } else {
      if (Formular.pensieDeÎntreţinere()) {
        onorariu = $secţiune.find('.încasare #onorariul-calculat').suma();
      } else {
        var total = $secţiune.find('ul:first .sumă:not(.calculat), .întîrziere .dobîndă').suma();

        $secţiune.find('#total').val(total).trigger('change');
        onorariu = Onorariu.pecuniar(total);
      }
    }

    if ($('#părţile-au-ajuns-la-conciliere').is(':checked')) {
      onorariu *= .7;
    }

    $('#onorariu').val(onorariu.toFixed(2));
  },

  pecuniar: function(suma) {
    if (suma <= 100000) {
      var minim = $('#amendă').is(':checked') ? 200 : 500;

      return Math.max(suma * .10, minim);
    } else if (suma <= 300000) {
      return 10000 + (suma - 100000) * .05;
    } else if (suma > 300000) {
      return 20000 + (suma - 300000) * .03;
    }
  },

  nonpecuniar: {
    'evacuarea': {fizică: 200 * UC, juridică: 300 * UC},
    'instalarea': {fizică: 200 * UC, juridică: 200 * UC},
    'schimbul forţat': {fizică: 200 * UC, juridică: 200 * UC},
    'stabilirea domiciliului copilului': {fizică: 200 * UC, juridică: 200 * UC},
    'efectuarea de către debitor a unor acte obligatorii, nelegate de remiterea unor sume sau bunuri': {fizică: 200 * UC, juridică:200 * UC},
    'efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri mobile': {
      fizică: function() { return 100 * UC + .01 * Formular.$obiectulUrmăririi.find('.sumă').suma() },
      juridică: function() { return 200 * UC + .01 * Formular.$obiectulUrmăririi.find('.sumă').suma() }
    },
    'efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri imobile': {
      fizică: function() { return 100 * UC + .01 * Formular.$obiectulUrmăririi.find('.sumă').suma() },
      juridică: function() { return 200 * UC + .01 * Formular.$obiectulUrmăririi.find('.sumă').suma() }
    },
    'confiscarea bunurilor': {
      fizică: function() { return 100 * UC + .01 * Formular.$obiectulUrmăririi.find('.sumă').suma() },
      juridică: function() { return 100 * UC + .01 * Formular.$obiectulUrmăririi.find('.sumă').suma() }
    },
    'nimicirea unor bunuri': {
      fizică: function() { return 100 * UC + .01 * Formular.$obiectulUrmăririi.find('.sumă').suma() },
      juridică: function() { return 100 * UC + .01 * Formular.$obiectulUrmăririi.find('.sumă').suma() }
    },
    'restabilirea la locul de muncă': {fizică: 200 * UC, juridică: 200 * UC},
    'aplicarea măsurilor de asigurare a acţiunii': {
      fizică: function() {
        return $('.bunuri-supuse-înregistrării-sau-bani').is(':checked')
          ? 100 * UC
          : 120 * UC;
      },
      juridică: function() {
        return $('.bunuri-supuse-înregistrării-sau-bani').is(':checked')
          ? 100 * UC
          : 120 * UC;
      }
    }
  }
};

// --------------------------------------------------

var Defaults = {
};

// --------------------------------------------------

var TotalCheltuieli = {
  init: function() {
    var cîmpuriRelevante = [
      'input.cost',
      'input.valoare',
      'input.sumă',
      'input.cantitate',
      'input.din.arhivă',
      '#taxaB5 .licitaţie.repetată',
      '#taxaB6 .licitaţie.repetată'
    ].join(',');

    var evenimente = 'keyup update paste mouseup click';

    Cheltuieli.adăugate.on(evenimente, cîmpuriRelevante, this.calculează);
  },

  calculează: function(e, automat) {
    if (automat) return;

    var total = 0,
        lista = Cheltuieli.adăugate;

    total += lista.find('input.valoare, input.sumă').suma();
    total += lista.find('input.cost').suma() * UC;
    total += lista.find('#taxaB2-1 .cantitate').suma() * .5 * UC;
    total += lista.find('#taxaB9 .cantitate').suma() * 5 * UC;
    total += lista.find('#taxaA6 .din.arhivă').is(':checked') ? 1 * UC : 0;

    var licitaţieRepetată = lista.find('#taxaB6 .licitaţie.repetată');

    if (licitaţieRepetată.is(':checked')) {
      total -= licitaţieRepetată.closest('.item').find('.cost').suma() * .5 * UC;
    }

    var licitaţieRepetată = lista.find('#taxaB5 .licitaţie.repetată');

    if (licitaţieRepetată.is(':checked')) {
      total -= licitaţieRepetată.closest('.item').find('.cost').suma() * .5 * UC;
    }

    total += lista.find('#taxaA3 .cantitate').suma() * UC;
    total += lista.find('#taxaB7 .document').length * 3 * UC;
    total += lista.find('#taxaB13 .cantitate').suma() * 5 * UC;
    total += lista.find('#taxaC1 .cantitate').suma() * 5 * UC;

    var documenteExpediate = lista.find('#taxaB1 .document');

    documenteExpediate.each(function() {
      var destinatari = $(this).children('.destinatari-adăugaţi').children();

      if (destinatari.există()) {
        total +=
          destinatari.filter('.suplimentar').length * .25 * UC +
          (destinatari.filter(':not(.suplimentar)').există() ? 1 * UC : 0);
      }
    });

    $('#total-taxe-şi-speze').val(total);
  }
};

// --------------------------------------------------

var Sume = {
  init: function() {
    $('body').on('input keyup', 'input.sumă', function(e) {
      if (!/,/.test(this.value)) return;

      var poziţieCursor = this.selectionStart;

      this.value = this.value.replace(/,/g, '.');
      this.selectionStart = poziţieCursor;
      this.selectionEnd = poziţieCursor;
    });
  }
};

// --------------------------------------------------

var Întîrzieri = {
  init: function() {
    Formular.$
      .on('change', '#caracter', this.adaugăButon)
      .on('închidere', this.elimină)
      .on('input click change', ':input:not(#dobînda)', this.calculeazăDobînda)
      .on('click', '#adaugă-întîrziere', this.adaugă);
  },

  adaugăButon: function() {
    var caracter = $(this);

    if (caracter.val() == 'pecuniar') {
      $şabloane.find('#adaugă-întîrziere').clone()
        .appendTo(caracter.closest('.conţinut'));
    } else {
      Formular.$.find('#adaugă-întîrziere, .întîrziere').remove();
    }
  },

  adaugă: function() {
    var $secţiune = $(this).parent();

    $şabloane.find('.întîrziere').clone()
      .find(':radio').attr('name', function(i, name) {
        return name + $secţiune.find('.întîrziere').length;
      }).end()
      .hide()
      .insertBefore(this)
      .show('blind');
  },

  elimină: function() {
    Formular.$.find('#adaugă-întîrziere, .întîrziere').remove();
  },

  calculeazăDobînda: function() {
    var $întîrziere = $(this).closest('.întîrziere'),
        întîrziere = Întîrzieri.colectează($întîrziere),
        dobînda = DobîndaDeÎntîrziere.calculează(întîrziere);

    $întîrziere.find('.sumă.dobîndă').val(dobînda);
  },

  colectează: function($întîrziere) {
    return {
      începutPerioadă: $întîrziere.find('.început.perioadă').val(),
      sfîrşitPerioadă: $întîrziere.find('.sfîrşit.perioadă').val(),
      rata: $întîrziere.find(':radio:checked').val(),
      suma: $întîrziere.find('.sumă.întîrziată').val()
    };
  }
};

// --------------------------------------------------

var Rapoarte = {
  'întîrziere': {
    pagina: '/rapoarte/întîrziere.html',
    tab: null,
    date: function() {
      var întîrziere = Întîrzieri.colectează(this.$el.closest('.întîrziere'));

      return {
        total: DobîndaDeÎntîrziere.calculează(întîrziere),
        raport: DobîndaDeÎntîrziere.raport
      };
    }
  },

  init: function() {
    $(document)
      .on('click', '.întîrziere .ui-icon-print', this.deschide);
  },

  deschide: function() {
    var raport = $(this).data('raport');

    Rapoarte[raport].$el = $(this);
    Rapoarte[raport].tab = window.open(Rapoarte[raport].pagina, raport, '', true);
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

// --------------------------------------------------

$.fn.suma = function() {
  var suma = 0;

  this.filter('input').each(function() {
    var cîmp = $(this),
        existăValoare = $.trim(cîmp.val()) != '';


    if ($.isNumeric(cîmp.val()) && cîmp.val() >= 0) {
      if (cîmp.is('.invalid')) cîmp.removeClass('invalid');

      if (cîmp.next().is('.valuta') && cîmp.next('.valuta').val() != 'MDL') {
        var valuta = cîmp.next('.valuta').val(),
            rataBNM = RateBNM[valuta];

        suma += this.value * rataBNM.value / rataBNM.nominal;
      } else {
        suma += parseFloat(this.value);
      }
    } else {
      if (existăValoare) cîmp.addClass('invalid');
    };
  });

  return parseFloat(suma.toFixed(2));
};
