// valoarea unităţii convenţionale
var UC = 20;
var FORMATUL_DATEI = /(\d{2})\.(\d{2})\.(\d{4})/;

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
    DobînziDeÎntîrziere.init();
    Formular.init();
    Instrumente.init();
    Calculator.init();
    Calendar.init();
    CîmpuriPersonalizate.init();
    ProceduriRecente.init();
    Sume.init();
    FormularPensie.init();

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
        .append(Destinatari.persoanăTerţă);

      if (!Formular.sePopulează && !Formular.seIniţializează) destinatar.find('input').focus();
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

  titlu: $('#formular h1'),

  init: function() {
    Formular.$
      .on('click', 'button.închide', Formular.închide)
      .on('click', 'button.salvează', Formular.trimite)
      .on('keydown', function(e) {if (e.keyCode == 27) Formular.închide()})
      .on('închidere', Formular.resetează)
      .on('populat iniţializat', Formular.calculează);

    $(window).on('hashchange', function() {
      if (!/^#formular/.test(location.hash)) Formular.închide();
      else Formular.deschide();
    });
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
      Formular.titlu
        .attr('tabindex', 1)
        .focus()
        .removeAttr('tabindex');
    });
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
      var $secţiune = $('#obiectul-urmăririi'),
          obiectulUrmăririi = colectează($secţiune);

      if (Formular.pensieDeÎntreţinere()) { // pensie
        obiectulUrmăririi['încasări'] = $secţiune.find('.încasare').map(function() {
          var $încasare = $(this),
              încasare = {};

          if ($încasare.is('.periodică')) {
            încasare.data = $încasare.find('.dată').val();
          } else {
            încasare.început = $încasare.find('.dată.început').val();
            încasare.sfîrşit = $încasare.find('.dată.sfîrşit').val();
          }

          încasare.venit = {
            suma: $încasare.find('.sumă.venit').val(),
            valută: $încasare.find('.valuta').val()
          };
          încasare.pensie = $încasare.find('.sumă.pensie').val();
          încasare.onorariu = $încasare.find('.sumă.onorariu').val();

          return încasare;
        }).get();
      } else {
        obiectulUrmăririi['sume'] = colecteazăSumeÎnValută();
      }

      return obiectulUrmăririi;
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
      $.post('/date/' + Utilizator.login + '/proceduri/' + procedură.număr, JSON.stringify(procedură), function() {
        if (Formular.seCreazăProcedurăNouă()) {
          window.skipEventOnce.hashchange = true;
          location.hash = 'formular?' + procedură.număr;

          Formular.seteazăTitlu();
        }

        Formular.focusează();

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
      .success(function(procedură) {
        ProceduriRecente.notează(număr);
        Formular.populează(procedură);
      })
      .error(Formular.închide);

  },

  populează: function(procedură) {
    $.fx.off = true;
    Formular.sePopulează = true;

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

      var încasare, $încasare, i, periodică,
          adaugăÎncasarePeriodică = $secţiune.find('#adaugă :contains("periodică")'),
          adaugăÎncasareRestanţă = $secţiune.find('#adaugă :contains("restanţă")');

      for (i = 0; i < încasări.length; i++) {
        încasare = încasări[i];
        periodică = typeof încasare.început == 'undefined';

        if (periodică) {
          adaugăÎncasarePeriodică.click();
          $încasare = $secţiune.find('.încasare.periodică').last();
          $încasare.find('.dată').val(încasare.data);
        } else {
          adaugăÎncasareRestanţă.click();
          $încasare = $secţiune.find('.încasare.restanţă').last();
          $încasare
            .find('.început').val(încasare.început).end()
            .find('.sfîrşit').val(încasare.sfîrşit).end();
        }

        $încasare
          .find('.venit').val(încasare.venit.suma).end()
          .find('.valută').val(încasare.venit.valuta).end()
          .find('.onorariu').val(încasare.onorariu).end()
          .find('.pensie').val(încasare.pensie).end();

        FormularPensie.actualizeazăCîmpPensie();
      }
    }

    // ------------------------------------------
    function populeazăObiectulUrmăririi() {
      var $secţiune = $('#obiectul-urmăririi'),
          secţiune = procedură['obiectul-urmăririi'];

      populeazăSecţiune($secţiune, secţiune);

      if (Formular.pensieDeÎntreţinere()) {
        populeazăPensieÎntreţinere($secţiune, secţiune['încasări']);
      } else {
        var sume = secţiune.sume,
            cîmp, $cîmp;

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
      .fadeIn('fast');

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

    $('#creditor #gen-persoană, .debitor #gen-persoană').trigger('change');

    $('#obiectul-urmăririi').on('change', '#obiect', function() {
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

  anuleazăCacheIndex: function() {
    $.post(Căutare.adresăIndex);
  },

  încarcăIndex: function() {
    if (Căutare.index) Căutare.anuleazăCacheIndex();

    setTimeout(function() {
      $.getJSON(Căutare.adresăIndex, function(data) {
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

    item.next().find('.sumă').focus();
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

    el.datepicker('destroy').focus();
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
          .select()
        .end()
        .effect('highlight', {}, 1200);
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

    $('#obiectul-urmăririi')
      .on('input change', '.sumă.venit, .sumă.pensie, .valuta', this.caluleazăOnorariulŞiPensia)
      .on('input', '#cota', this.recalulează);
  },

  cota: function() {
    var cota = FormularPensie.$cota.val().replace(/[^\/\d\.\,%]/g, ''); // igiena

    if (/%$/.test(cota)) cota = cota.replace('%', '/100');

    try {
      cota = eval(cota);
    } catch(e) {
      cota = 0;
    }

    return eval(cota);
  },

  caluleazăOnorariulŞiPensia: function(e) {
    var $încasare = $(this).closest('.încasare'),
        venit = $încasare.find('.sumă.venit').suma(),
        cota = FormularPensie.cota(),
        $pensie = $încasare.find('.sumă.pensie'),
        pensie;

    if (cota) {
      pensie = venit * cota;
      $pensie.val(pensie.toFixed(2));
    } else {
      if (e == 'modificare-cotă') $pensie.val('');
      pensie = $pensie.suma();
    }

    $încasare.find('.sumă.onorariu').val(Onorariu.pecuniar(pensie).toFixed(2));

    Onorariu.calculează();
  },

  recalulează: function() {
    FormularPensie.actualizeazăCîmpPensie();

    FormularPensie.$.find('.încasare .venit').each(function() {
      FormularPensie.caluleazăOnorariulŞiPensia.apply(this, ['modificare-cotă']);
    });

    Onorariu.calculează();
  },

  actualizeazăCîmpPensie: function() {
    var introdusCota = $.trim(FormularPensie.$cota.val()) !== '';

    FormularPensie.$.find('.pensie')
      .attr('readonly', introdusCota)
      .prev('label').text(introdusCota ? 'Pensia calculată' : 'Pensia fixă');
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
    var $încasare = $şabloane.find('.încasări-pensie#' + $(this).text() + '>.încasare').clone()
      .removeAttr('id')
      .insertBefore($(this).closest('#adaugă'))
      .effect('highlight', {}, 1200);

    if (!Formular.sePopulează) $încasare.find('input').first().focus();
  },

  inserează: function() {
    if (!Formular.pensieDeÎntreţinere()) return;

    var $secţiune = $(this).find('#obiectul-urmăririi').find('.conţinut');

    $secţiune
      .data('conţinut-iniţial', $secţiune.html())
      .empty();

    $şabloane.find('.încasări-pensie#butonul').clone()
      .appendTo($secţiune)
      .on('mouseenter', '#adaugă', FormularPensie.opţiuni.afişează)
      .on('mouseleave', '#adaugă', FormularPensie.opţiuni.ascunde)
      .on('click', '#adaugă li', FormularPensie.adaugăÎncasare);

    FormularPensie.$ = $secţiune;
    FormularPensie.$cota = $secţiune.find('#cota');

    Formular.focusează();
  },

  elimină: function() {
    if (!Formular.pensieDeÎntreţinere()) return;

    var secţiune = $(this).find('#obiectul-urmăririi').find('.conţinut');

    secţiune.html(secţiune.data('conţinut-iniţial'));
    secţiune.removeData('conţinut-iniţial');
  }
};

// --------------------------------------------------

var DobîndaDeÎntîrziere = {
  rate: {},
  iniţializat: false,

  init: function() {
    if (DobîndaDeÎntîrziere.iniţializat) return;

    DobîndaDeÎntîrziere.încarcă();
    DobîndaDeÎntîrziere.iniţializat = true;
  },

  calculează: function(e) {
    if ($.isEmptyObject(DobîndaDeÎntîrziere.rate)) return;

    var suma = 0;

    Calculator.$.find('#sume .sumă').each(function() {
      var cîmp = $(this),
          valuta = cîmp.next('.valuta'),
          cursValutar = RateBNM[valuta.val()];

      if (valuta.val() == 'MDL') {
        suma += cîmp.suma();
      } else {
        suma += cîmp.suma() / cursValutar.nominal * cursValutar.value;
      }
    });

    var deLa = $.trim(Calculator.$.find('#de-la').val());
        pînăLa = $.trim(Calculator.$.find('#pînă-la').val());

    if (!FORMATUL_DATEI.test(deLa) || !FORMATUL_DATEI.test(pînăLa)) return;

    deLa = moment(deLa, 'DD.MM.YYYY').format('YYYY-MM-DD');
    pînăLa = moment(pînăLa, 'DD.MM.YYYY').format('YYYY-MM-DD');

    var data, dataPrecedentă, primaDatăAplicabilă, durate = {};

    for (data in DobîndaDeÎntîrziere.rate) {
      if (data > deLa) break;

      dataPrecedentă = data;
    }

    primaDatăAplicabilă = dataPrecedentă;
    dataPrecedentă = null;

    for (data in DobîndaDeÎntîrziere.rate) {
      if (dataPrecedentă) {
        if (dataPrecedentă == primaDatăAplicabilă) {
          durate[dataPrecedentă] = zileÎntre(deLa, data);
        } else if (data > pînăLa) {
          durate[dataPrecedentă] = zileÎntre(dataPrecedentă, pînăLa) + 1; // + 1 include ultima zi
        } else {
          durate[dataPrecedentă] = zileÎntre(dataPrecedentă, data);
        }
      }

      dataPrecedentă = data;
    }

    durate[data] = zileÎntre(data, pînăLa);

    function zileÎntre(data1, data2) {
      if (typeof data1 == 'string') data1 = moment(data1, 'YYYY-MM-DD').toDate();
      if (typeof data2 == 'string') data2 = moment(data2, 'YYYY-MM-DD').toDate();

      return Math.round((data2 - data1) / (24 * 3600 * 1000));
    }

    var rataBNM, dobînda = 0,
        rataAplicată = parseFloat(Calculator.$.find(':radio[name="rata-aplicată"]:checked').val());

    for (data in DobîndaDeÎntîrziere.rate) {
      if (data < primaDatăAplicabilă) continue;
      if (data > pînăLa) break;

      rataBNM = (DobîndaDeÎntîrziere.rate[data] + rataAplicată) / 100;
      dobînda += Math.round(suma * rataBNM / 365 * durate[data] * 100) / 100;
    }

    dobînda = Math.round(dobînda * 100) / 100;

    Calculator.$.find('#dobînda').val(dobînda);
  },

  încarcă: function() {
    $.getJSON('rate-bnm/rata_de_bază.json')
      .success(function(data) {
        DobîndaDeÎntîrziere.rate = data;
        DobîndaDeÎntîrziere.calculează();
      });
  }
};

// --------------------------------------------------

var Onorariu = {
  init: function() {
    var schimbareDate = 'keyup update paste change',
        cîmpuriRelevante = [
          '.sumă:not(.irelevant-pentru-onorariu)',
          '.sumă:not(.calculat)',
          '.valuta',
          'input:checkbox',
          '#caracter',
          '#obiect'
        ].join(',');

    $('#obiectul-urmăririi').on(schimbareDate, cîmpuriRelevante, Onorariu.calculează);
    Formular.$.on(schimbareDate, '.debitor #gen-persoană, #părţile-au-ajuns-la-conciliere', Onorariu.calculează);
  },

  calculează: function() {
    if (!Formular.deschis) return;

    var caracter = $('#caracter').val(),
        genPersoană = $('.debitor #gen-persoană').val(),
        onorariu = 0;

    if (caracter == 'nonpecuniar') {
      var obiect = $('#obiect').val();

      valoare = Onorariu.nonpecuniar[obiect][genPersoană];
      onorariu = typeof valoare == 'function' ? valoare() : valoare;
    } else {
      var $secţiune = $('#obiectul-urmăririi');

      if (Formular.pensieDeÎntreţinere()) {
        onorariu = $secţiune.find('.încasare .onorariu').suma();
      } else {
        var total = $secţiune.find('.sumă:not(.calculat)').suma();

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
      fizică: function() { return 100 * UC + .01 * $('#obiectul-urmăririi .sumă').suma() },
      juridică: function() { return 200 * UC + .01 * $('#obiectul-urmăririi .sumă').suma() }
    },
    'efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri imobile': {
      fizică: function() { return 100 * UC + .01 * $('#obiectul-urmăririi .sumă').suma() },
      juridică: function() { return 200 * UC + .01 * $('#obiectul-urmăririi .sumă').suma() }
    },
    'confiscarea bunurilor': {
      fizică: function() { return 100 * UC + .01 * $('#obiectul-urmăririi .sumă').suma() },
      juridică: function() { return 100 * UC + .01 * $('#obiectul-urmăririi .sumă').suma() }
    },
    'nimicirea unor bunuri': {
      fizică: function() { return 100 * UC + .01 * $('#obiectul-urmăririi .sumă').suma() },
      juridică: function() { return 100 * UC + .01 * $('#obiectul-urmăririi .sumă').suma() }
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

var DobînziDeÎntîrziere = {
  init: function() {
    Formular.$
      .on('change', '#caracter', this.adaugăButon)
      .on('închidere', this.elimină);
  },

  adaugăButon: function() {
    var caracter = $(this);

    if (caracter.val() == 'pecuniar') {
      $şabloane.find('#adaugă-întîrziere').clone()
        .appendTo(caracter.closest('.conţinut'))
        .on('click', DobînziDeÎntîrziere.adaugă);
    } else {
      Formular.$.find('#adaugă-întîrziere').remove();
    }
  },

  adaugă: function() {
    $şabloane.find('.întîrziere').clone()
      .insertBefore(this);
  },

  elimină: function() {
    Formular.$.find('#adaugă-întîrziere, .întîrziere').remove();
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
