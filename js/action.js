var UC = 20; // valoarea unităţii convenţionale în MDL
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
    SelecturiFoarteLate.seteazăŞoapte();
    Persoane.init();
    Cheltuieli.init();
    ButonDeEliminare.init();
    Subsecţiuni.init();
    Formular.init();
    Calendar.init();
    CîmpuriPersonalizate.init();
    ProceduriRecente.init();
    Sume.init();
    ÎncasarePensie.init();
    Rapoarte.init();
    Secţiuni.init();
    ListeMeniu.init();

    $(window).trigger('hashchange');

    if (Utilizator.autentificat) {
      BaraDeSus.init();
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
    Formular.$.on('click', 'button.adaugă.persoană', this.adaugă);
  },

  adaugă: function() {
    var buton = $(this),
        fieldset = buton.prev();

    fieldset.clone()
      .addClass('eliminabil de tot')
      .removeAttr('id') // #creditor
      .find('.conţinut').removeAttr('style').end()
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

var SelecturiFoarteLate = {
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
    Formular.$
      .on('change', this.selector, this.inserează);
  },

  inserează: function(e) {
    var $select = $(this),
        selectorŞablon = '.' + $select.attr('id') + '.conţinut[title="' + $select.val() + '"]',
        şablon = FormulareŞablon.parseazăIncluderile($şabloane.find(selectorŞablon).html()),
        item = $select.closest('li'),
        $subformular;

    item.nextAll().remove();
    item.after(şablon);

    $subformular = item.nextAll();
    $subformular.find(FormulareŞablon.selector).trigger('change');

    if (!Formular.sePopulează && !Formular.seIniţializează) {
      $subformular
        .find(':input:not(' + FormulareŞablon.selector + ')').first().focus().end().end()
        .find('.adaugă-cîmp-personalizat.implicit').click();
    }

    try {
      $subformular.effect('highlight', {}, 1200, function() {$(this).clearQueue()});
    } catch(e) {} // "Uncaught TypeError: Cannot read property '0' of undefined" jquery-ui.min.js:5
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
        .on('mouseenter', '.listă', this.marcheazăItemiAdăugaţiDeja)
        .on('click', '.listă .item', this.adaugăItem);
    },

    marcheazăItemiAdăugaţiDeja: function() {
      var itemiUniciAdăugaţiDeja = Cheltuieli.adăugate.children('.item.unic'),
          itemi = $(this).find('.listă ol').children();

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

      $(this).closest('.itemi').fadeOut();

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
        .on('keydown focusout', '.destinatari-adăugaţi .persoană.terţă input', this.ascundeLaEnterSauEsc);
    },

    ascundeLaEnterSauEsc: function(e) {
      if (e.keyCode == 13 || e.keyCode == 27 || e.type == 'focusout') {
        e.preventDefault();
        e.stopPropagation();
        Destinatari.adăugaţiDeja.click();
      }
    },

    ascundeSauAfişează: function(e) {
      var destinatari = $(this),
          subformular = destinatari.closest('.subformular');

      subformular.find('.destinatari-adăugaţi').not(this)
        .addClass('comprimaţi')
        .removeClass('cu umbră');

      if (e.target == this && destinatari.children().există()) {
        destinatari
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
  $: $şabloane.find('#destinatari'),
  adăugaţiDeja: $(),

  init: function() {
    this.categorii.init();
    this.butonDeAdăugare.init();
  },

  butonDeAdăugare: {
    init: function() {
      Cheltuieli.adăugate
        .on('mouseenter', '.adaugă-destinatar', this.afişeazăCategoriile);
    },

    afişeazăCategoriile: function() {
      Destinatari.adăugaţiDeja = $(this).prev('.destinatari-adăugaţi');
      Destinatari.$.appendTo(this).afişează();
    }
  },

  categorii: {
    init: function() {
      Destinatari.$
        .on('click', '.listă .titlu .adaugă-toate', this.adaugăToate)
        .on('click', '.listă>.itemi>li', Destinatari.adaugă)
        .on('mouseenter', '.listă', this.marcheazăItemiAdăugaţiDeja);
    },

    marcheazăItemiAdăugaţiDeja: function() {
      var destinatari = $(this).find('.itemi').children(),
          destinatariAdăugaţiDeja = Destinatari.adăugaţiDeja.children(':not(.persoană.terţă)');

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
    },

    adaugăToate: function(e) {
      e.stopPropagation();

      var destinatari = $(this).parent().next('.itemi'),
          adăugaţiDeja = Destinatari.adăugaţiDeja.children().map(function() {
            return ':contains("' + $(this).text() + '")';
          }).get().join(',');

      destinatari.children('li').not(adăugaţiDeja).trigger('click');
    }
  },

  adaugă: function(e) {
    e.stopPropagation();

    var destinatar = $(this).clone();

    destinatar
      .addClass('eliminabil de tot')
      .appendTo(Destinatari.adăugaţiDeja);

    $(this).addClass('dezactivat');

    if (destinatar.is('.persoană.terţă')) {
      Destinatari.adăugaţiDeja.click();
      destinatar.append('<input/>');

      if (!Formular.sePopulează && !Formular.seIniţializează) {
        destinatar.find('input').focus();
        Destinatari.$.hide();
      }
    }

    TotalCheltuieli.calculează();
  }
};

// --------------------------------------------------

var ButonDeEliminare = {
  $: $şabloane.find('.elimină'),
  eliminabilPrecedent: $(),

  init: function() {
    Formular.$
      .on('click', '.elimină', this.acţionează)
      .on('mousemove', '.eliminabil', this.afişează)
      .on('mouseleave', '.eliminabil', this.ascunde);
  },

  afişează: function(e) {
    e.stopPropagation();

    var eliminabil = $(this),
        buton = ButonDeEliminare.$;

    if (eliminabil.is('.spre-eliminare')) return;
    if (eliminabil.is(':not(.de.tot)') && !eliminabil.siblings('.eliminabil').există()) return;

    if (eliminabil.children().există()) {
      buton.insertBefore(eliminabil.children().first());
    } else {
      eliminabil.prepend(buton);
    }

    buton.show();

    ButonDeEliminare.eliminabilPrecedent.removeClass('spre-eliminare');
    ButonDeEliminare.eliminabilPrecedent = eliminabil.addClass('spre-eliminare');
  },

  ascunde: function() {
    ButonDeEliminare.$
      .removeClass('afişat')
      .parent().removeClass('spre-eliminare').end()
      .stop(true, true)
      .appendTo(document.body);
  },

  acţionează: function() {
    var eliminabil = ButonDeEliminare.$.parent();

    ButonDeEliminare.ascunde();

    if (eliminabil.is('.eliminabil.de.tot') || eliminabil.siblings('.eliminabil').există()) {
      eliminabil
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
    $('#număr-licenţă').val(Utilizator.login);
  },

  logout: function() {
    $.get('/bin/logout_pas1.php', function(data) {
      $.cookie('login', null);
      $.ajax({
        url: '/bin/logout_pas2.php',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + data);
        },
        error: function() {
          location = '/';
        }
      });
    });
  }
};

// --------------------------------------------------

var Formular = {
  $: $('#formular'),
  $titlu: $('#formular h1'),
  $obiectulUrmăririi: $('#formular #obiectul-urmăririi'),

  init: function() {
    this.$
      .on('keyup', function(e) {if (e.keyCode == 27) Formular.închide()})
      .on('click', 'button.închide', this.închide)
      .on('click', 'button.salvează', this.salvează)
      .on('închidere', this.resetează)
      .on('populat iniţializat', this.calculează)
      .on('populat iniţializat', this.eliminăAmendaDupăCaz)
      .on('salvat', this.actualizeazăDataUltimeiModificări);

    this.baraDeInstrumente.init();

    $(window).on('hashchange', function() {
      if (/^#formular/.test(location.hash)) Formular.deschide();
      else if (Formular.$.is(':visible')) Formular.închide();
    });
  },

  baraDeInstrumente: {
    init: function() {
      Formular.$.find('.bara-de-instrumente')
        .on('click', '.spre-secţiuni', Formular.focusează)
        .on('click', '.spre-secţiuni+.opţiuni li', Formular.focuseazăSecţiunea);

      Formular.$.on('salvat', this.anunţăSalvarea);
    },

    anunţăSalvarea: function() {
      var mesaj = Formular.$.find('.bara-de-instrumente .salvează+.mesaj');

      mesaj.addClass('afişat');

      setTimeout(function() {
        mesaj.removeClass('afişat');
      }, 1000);
    }
  },

  focuseazăSecţiunea: function() {
    var secţiune = $(this).text().substr(2),
        $titluSecţiune = Formular.$.find('legend label:contains("' + secţiune + '")'),
        $opţiuni = $(this).closest('.opţiuni'),
        top = $titluSecţiune.offset().top;

    if ($(document).scrollTop() == top) {
      $('html,body')
        .animate({scrollTop: $(document).scrollTop() + 25}, 50)
        .animate({scrollTop: $(document).scrollTop() - 25}, 50);
    }

    $('html,body').animate({scrollTop: top}, 750);
    $opţiuni.css('height', 0);
    setTimeout(function() {$opţiuni.removeAttr('style')}, 800);
    $titluSecţiune.closest('fieldset').find('.conţinut :input:not([readonly]):first').focus();
  },

  eliminăAmendaDupăCaz: function() {
    if (Formular.deOrdingGeneral()) {
      Formular.$obiectulUrmăririi.find('li:has(#amendă)').remove();
    }
  },

  actualizeazăDataUltimeiModificări: function(e, procedură) {
    Formular.$.find('#data-ultimei-modificări span')
      .text(procedură['data-ultimei-modificări'])
      .parent().show();
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
    return {
      'număr': (Formular.$.find('#număr').text().match(/[SP]?-\d+/) || [null])[0],
      'data-intentării': Formular.$.find('#data-intentării').val(),
      'document-executoriu': colectează('#document-executoriu'),
      'obiectul-urmăririi': colecteazăObiectulUrmăririi(),
      'cheltuieli': colecteazăCheltuieli(),
      'creditor': colectează('#creditor'),
      'persoane-terţe': colecteazăPersoaneTerţe(),
      'debitori': colecteazăDebitori(),
      'tip': HashController.date().match(/^[SP]?/)[0],
      'data-ultimei-modificări': moment().format('DD.MM.YYYY HH:mm')
    };


    // ------------------------------------------
    function colectează(secţiune) {
      var $secţiune = $(secţiune),
          date = {},
          cîmpuri = [
            'ul:not(.subsecţiune) label+:input:not(.calculat):last-child',
            'ul:not(.subsecţiune) label+select.foarte.lat',
            'ul:not(.subsecţiune) label+.dată',
            'ul:not(.subsecţiune) label+input#salariu-recuperat',
            'ul:not(.subsecţiune) label+input#valoarea-acţiunii',
            'ul:not(.subsecţiune) .etichetă+:input'
          ].join(',');

      $secţiune.find(cîmpuri).each(function() {
        var $input = $(this),
            $label = $input.prev();

        if ($label.is('.etichetă')) {
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
        obiectulUrmăririi['sechestrări-bunuri'] = colecteazăSechestrăriBunuri($secţiune);
      }

      return obiectulUrmăririi;
    }

    // ------------------------------------------
    function colecteazăÎntîrzieri($secţiune) {
      return $secţiune.find('.subsecţiune.întîrziere').map(function() {
        var $întîrziere = $(this);

        return {
          începutPerioadă: $întîrziere.find('.început.perioadă').val(),
          sfîrşitPerioadă: $întîrziere.find('.sfîrşit.perioadă').val(),
          rata: $întîrziere.find(':radio:checked').val(),
          suma: $întîrziere.find('.sumă.întîrziată').val(),
          dobînda: $întîrziere.find('.sumă.dobîndă').val(),
          încheiere: $întîrziere.find('button[data-raport="încheiere-dobîndă-de-întîrziere"]').data('pagina'),
          anexa: $întîrziere.find('button[data-raport="anexa-dobîndă-de-întîrziere"]').data('pagina')
        };
      }).get();
    }

    // ------------------------------------------
    function colecteazăSechestrăriBunuri($secţiune) {
      return $secţiune.find('.subsecţiune.sechestrare-bunuri').map(function() {
        var $sechestrare = $(this);

        return {
          data: $sechestrare.find('.dată').val(),
          bunuri: $sechestrare.find('.personalizat').map(function() {
            var cîmp = $(this);

            return {
              descriere: cîmp.find('.etichetă').val(),
              sumă: cîmp.find('.sumă').val(),
              valuta: cîmp.find('.valuta').val()
            };
          }).get()
        };
      }).get();
    }

    // ------------------------------------------
    function colecteazăÎncasări($secţiune) {
      return $secţiune.find('.subsecţiune.încasare').map(function() {
        var date = {};

        $(this).find(':input:not([readonly])').each(function() {
          date[this.id] = $.trim($(this).val());
        });

        return date;
      }).get();
    }

    // ------------------------------------------
    function colecteazăSumeÎnValută($secţiune) {
      var sume = {};

      $secţiune.find('ul:not(.subsecţiune) .sumă+.valuta').each(function() {
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
              item.subformular[this.id] = $(this).val1();
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
      return Formular.$.find('.persoană-terţă').map(function() {
        return colectează(this);
      }).get();
    }

    // ------------------------------------------
    function colecteazăDebitori() {
      return Formular.$.find('.debitor').map(function() {
        return colectează(this);
      }).get();
    }
  },

  salvează: function() {
    var procedură = Formular.colectează();

    if (procedură.număr) post();
    else $.get('/date/' + Utilizator.login + '/proceduri/', function(răspuns) {
      var ultimulNumăr = $(răspuns).find('a').map(function() {
        var reNumăr = /^([SP]?)-(\d+).json$/;

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
      var cale = '/date/' + Utilizator.login + '/proceduri/' + procedură.număr + '.json';

      $.post(cale, JSON.stringify(procedură), function(_, status) {
        if (Formular.seCreazăProcedurăNouă()) {
          window.skipEventOnce.hashchange = true;
          location.hash = 'formular?' + procedură.număr;

          Formular.seteazăTitlu();
        }

        Formular.$.trigger('salvat', [procedură]);

        if (status == 'notmodified') return;

        Căutare.încarcăIndexFărăCache();
        ProceduriRecente.încărcat = false;
      });
    }
  },

  încarcă: function() {
    var număr = HashController.date();

    $.getJSON('/date/' + Utilizator.login + '/proceduri/' + număr + '.json')
      .success(function(procedură) {
        ProceduriRecente.notează(număr);
        Formular.populează(procedură);
        Formular.verificăRapoarte();
      })
      .error(Formular.închide);

  },

  populează: function(procedură) {
    $.fx.off = true;
    Formular.sePopulează = true;

    Formular.$.find('#data-intentării').val(procedură['data-intentării']);
    Formular.$.find('#data-ultimei-modificări span')
      .text(procedură['data-ultimei-modificări'])
      .parent().show();

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
    }

    // ------------------------------------------
    function populeazăObiectulUrmăririi() {
      var $secţiune = Formular.$obiectulUrmăririi,
          secţiune = procedură['obiectul-urmăririi'];

      populeazăSecţiune($secţiune, secţiune);
      populeazăPensieÎntreţinere($secţiune, secţiune['încasări']);
      populeazăSume($secţiune, secţiune['sume']);
      populeazăÎntîrzieri($secţiune, secţiune['întîrzieri']);
      populeazăSechestrăriBunuri($secţiune, secţiune['sechestrări-bunuri']);
    }

    // ------------------------------------------
    function populeazăPensieÎntreţinere($secţiune, încasări) {
      if (!încasări) return;

      var $încasare, i, prima = true,
          buton = $secţiune.find('#adaugă-subsecţiune .încasare');

      for (i = 0; i < încasări.length; i++) {
        if (!prima) buton.click();

        $încasare = $secţiune.find('.subsecţiune.încasare:last');
        populeazăSecţiune($încasare, încasări[i]);
        $încasare.find('#venitul').trigger('input');

        if (prima) prima = false;
      }
    }

    // ------------------------------------------
    function populeazăÎntîrzieri($secţiune, întîrzieri) {
      if (!întîrzieri) return;

      var întîrziere, $întîrziere,
          buton = $secţiune.find('#adaugă-subsecţiune .întîrziere');

      for (var i = 0; i < întîrzieri.length; i++) {
        întîrziere = întîrzieri[i];

        buton.click();
        $întîrziere = $secţiune.find('.subsecţiune.întîrziere:last');
        $întîrziere.find('.început.perioadă').val(întîrziere['începutPerioadă']);
        $întîrziere.find('.sfîrşit.perioadă').val(întîrziere['sfîrşitPerioadă']);
        $întîrziere.find(':radio[value="' + întîrziere['rata'] + '"]').attr('checked', true);
        $întîrziere.find('.sumă.întîrziată').val(întîrziere['suma']);
        $întîrziere.find('.sumă.dobîndă').val(întîrziere['dobînda']);

        $întîrziere.find('button[data-raport="încheiere-dobîndă-de-întîrziere"]')
          .data('pagina', întîrziere['încheiere'])
          .toggleClass('salvat', !!întîrziere['încheiere']);

        $întîrziere.find('button[data-raport="anexa-dobîndă-de-întîrziere"]')
          .data('pagina', întîrziere['anexa'])
          .toggleClass('salvat', !!întîrziere['anexa']);
      }
    }

    // ------------------------------------------
    function populeazăSechestrăriBunuri($secţiune, sechestrări) {
      if (!sechestrări) return;

      var sechestrare, $sechestrare, bun, $bun, primul = true,
          buton = $secţiune.find('#adaugă-subsecţiune .sechestrare-bunuri');

      for (var i = 0; i < sechestrări.length; i++) {
        buton.click();

        sechestrare = sechestrări[i];
        $sechestrare = $secţiune.find('.subsecţiune.sechestrare-bunuri:last'),

        $sechestrare.find('.dată').val(sechestrare.data);
        primul = true;

        for (var j = 0; j < sechestrare.bunuri.length; j++) {
          bun = sechestrare.bunuri[j];

          if (!primul) $sechestrare.find('.adaugă-cîmp-personalizat').click();

          $bun = $sechestrare.find('.personalizat:last');
          $bun.find('.etichetă').val(bun.descriere);
          $bun.find('.sumă').val(bun.sumă);
          $bun.find('.valuta').val(bun.valuta).trigger('input');

          if (primul) primul = false;
        }
      }
    }

    // ------------------------------------------
    function populeazăSume($secţiune, sume) {
      if (!sume) return;

      var cîmp, $cîmp,
          $secţiune = $secţiune.find('ul:first'),
          buton = $secţiune.find('.adaugă-cîmp-personalizat');

      for (cîmp in sume) {
        $cîmp = $secţiune.find('label:contains(' + cîmp + ')+.sumă');

        if (!$cîmp.există()) {
          buton.click();
          $cîmp = $secţiune.find('.etichetă+.sumă').last();
          $cîmp.prev().val(cîmp).trigger('input');
        }

        $cîmp.val(sume[cîmp].suma);
        $cîmp.next('.valuta').val(sume[cîmp].valuta);
      }
    }

    // ------------------------------------------
    function populeazăCheltuieli() {
      var $secţiune = Cheltuieli.$,
          $lista = Cheltuieli.$.find('#categorii-taxe-şi-speze');

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
          var prima = true, $cîmp, $itemSubformular;

          $.each(item.subformular, function(nume, valoare) {
            if (prima) {
              prima = false;
            } else {
              $adaugă.click();
            }

            $itemSubformular = $subformular.find('li.eliminabil:last');
            $cîmp = $itemSubformular.find(':input');

            if (this.document) {
              $cîmp.val(this.document).trigger('input');
              Destinatari.adăugaţiDeja = $cîmp.next('.destinatari-adăugaţi');

              if (this.destinatari) {
                $.each(this.destinatari, function() {
                  Destinatari.$.find('li:not(.listă):contains("' + this + '")').click();
                });
              }

              if (this['destinatari-persoane-terţe']) {
                $.each(this['destinatari-persoane-terţe'], function() {
                  Destinatari.$.find('li.persoană.terţă').clone()
                    .addClass('eliminabil de tot')
                    .append('<input/>')
                    .find('input').val(this).end()
                    .appendTo(Destinatari.adăugaţiDeja);
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
      var $adaugă = Formular.$.find('#creditor+button.adaugă');

      if (procedură['persoane-terţe']) {
        $.each(procedură['persoane-terţe'], function() {
          $adaugă.click();

          $secţiune = Formular.$.find('.persoană-terţă:last');
          populeazăSecţiune($secţiune, this);
        });
      }
    }

    // ------------------------------------------
    function populeazăDebitori() {
      var $secţiune,
          prima = true,
          $adaugă = Formular.$.find('.debitor+button.adaugă');

      $.each(procedură['debitori'], function() {
        if (prima) {
          prima = false;
        } else {
          $adaugă.click();
        }

        $secţiune = Formular.$.find('.debitor:last');
        populeazăSecţiune($secţiune, this);
      });
    }
  },

  resetează: function() {
    Formular.$
      .find('#data-intentării').val('').end()
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

      .find('fieldset .conţinut').removeAttr('style').end()

      .find('#categorii-taxe-şi-speze')
        .find('.dezactivat').removeClass('dezactivat').end()
      .end();
  },

  închide: function() {
    Formular.focusează();
    Formular.$
      .stop(true, true)
      .find('.bara-de-instrumente').fadeOut().end()
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
      .find('.bara-de-instrumente').fadeIn('slow').end()
      .css('top', $(window).height())
      .show()
      .animate({'top': '40px'});

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

    Formular.$
      .find('#data-ultimei-modificări').hide().end()
      .find('#creditor #gen-persoană, .debitor #gen-persoană').trigger('change');

    if (Formular.seCreazăProcedurăNouă()) {
      Cheltuieli.$.find('#taxaA1').click();

      var caracterProcedură = Formular.$obiectulUrmăririi.find('#caracter'),
          genCreditor = Formular.$.find('#creditor #gen-persoană');

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
  },

  verificăRapoarte: function() {
    Formular.$.addClass('încă-nu-verificat-rapoarte');

    $.get('/date/' + Utilizator.login + '/rapoarte/', function(html) {
      var rapoarte = Formular.$.find('#rapoarte').find('li:not(.titlu)').remove().end();

      $(html).find('a:not([href="../"])').map(function() {
        var numeRaport = decodeURI(this.getAttribute('href').replace(/\.html$/, '')),
            dataŞiOraSalvării = this.nextSibling.data.match(/(\d{2}-[a-z]{3}-\d{4} \d{2}:\d{2})/i)[1];

        dataŞiOraSalvării = moment(dataŞiOraSalvării, 'D-MMM-YYYY H:m').format('DD.MM.YYYY H:m');

        $('<li>')
          .append($('<a>').text(numeRaport).attr('href', this.href))
          .append($('<span>').text(dataŞiOraSalvării).addClass('data-şi-ora-salvării'))
          .appendTo(rapoarte);
      });

      Formular.$.removeClass('încă-nu-verificat-rapoarte');
    });
  }
}

// --------------------------------------------------

var ProceduriRecente = {
  încărcat: false,

  $: $('#proceduri-recente').find('.listă-proceduri'),

  init: function() {
    ProceduriRecente.$.on('click', '.item', function() {
      var număr = $(this).find('.număr').contents()[0].data.replace(Utilizator.login, '');

      location.hash = 'formular?' + număr;
    });
  },

  url: function() {
    return '/date/' + Utilizator.login + '/proceduri/recente.json';
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

      lista[număr] = Căutare.index[''][număr];
    });

    ProceduriRecente.$
      .html(ListăDeProceduri.formatează(lista))
      .on('mouseenter', '.item', function() {$(this).addClass('selectat')})
      .on('mouseleave', '.item', function() {$(this).removeClass('selectat')});

    ProceduriRecente.încărcat = true;
  },

  notează: function(număr) {
    setTimeout(function() {
      if (ProceduriRecente.numărulUltimei() == număr) return;

      $.post(ProceduriRecente.url(), număr, ProceduriRecente.afişează);
    }, 1000);
  },

  numărulUltimei: function() {
    var ceaMaiRecentăProcedură = ProceduriRecente.$.find('.item');

    if (!ceaMaiRecentăProcedură.există()) return;

    return ceaMaiRecentăProcedură.first().find('.număr').contents(':first').text().replace(Utilizator.login, '');
  }
}

// --------------------------------------------------

var Căutare = {
  $: $('#căutare'),

  init: function() {
    Căutare.$.find('input')
      .on('input', Căutare.găseşte)
      .bind('keydown', 'down', Căutare.rezultate.selectează)
      .bind('keydown', 'up', Căutare.rezultate.selectează)
      .bind('keydown', 'return', Căutare.rezultate.deschide)
      .bind('keyup', 'esc', function() {$(this).val('').trigger('input')});

    Căutare.rezultate.$
      .on('mouseenter', '.item', function() {$(this).addClass('selectat')})
      .on('mouseleave', '.item', function() {$(this).removeClass('selectat')});

    Căutare.adresăIndex = '/date/' + Utilizator.login + '/proceduri/index.json';
    Căutare.încarcăIndex();
  },

  rezultate: {
    $: $('#rezultate'),
    $nimic: $('#nimic'),

    afişează: function(proceduri, text) {
      var rezultate = ListăDeProceduri.formatează(proceduri, text);

      if (rezultate) {
        Căutare.rezultate.$nimic.hide();
        Căutare.rezultate.$.html(rezultate);
      } else {
        Căutare.rezultate.$nimic.fadeIn();
      }

      ProceduriRecente.$.parent().hide();
    },

    selectează: function(e) {
      e.preventDefault();

      var lista = Căutare.rezultate.$;

      if (!lista.find('.item').există()) return;

      var direcţia = e.data,
          spre = {up: 'prev', down: 'next'},
          începutPerioadă = {up: '.item:last', down: '.item:first'};

      var $item = lista.find('.selectat'),
          $spre = $item.există() ? $item[spre[direcţia]]() : lista.find(începutPerioadă[direcţia]);

      $item.removeClass('selectat');
      $spre.addClass('selectat');
    },

    deschide: function(e) {
      e.preventDefault();

      var item = Căutare.rezultate.$.find('.selectat');

      if (!item.există()) return;

      var număr = item.find('.număr').text()
        .replace(item.find('.data-hotărîrii').text(), '')
        .replace(Utilizator.login, '');

      location.hash = 'formular?' + număr;
    }
  },

  găseşte: function(e) {
    var text = $.reEscape($.trim(this.value));

    if (!text.length) {
      Căutare.anulează();
      return;
    }

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
          $.each(Căutare.index[i], function(_, număr) {
            if (!unice[număr]) unice[număr] = Căutare.index[''][număr];
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
  },

  anulează: function() {
    Căutare.rezultate.$.html('');
    Căutare.rezultate.$nimic.hide();
    ProceduriRecente.$.parent().show();
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
        '<li class="item">' +
          '<div class="număr">' +
            evidenţiază(număr) +
            '<div class="data-hotărîrii">' + procedură['data-hotărîrii'] + '</div>' +
          '</div>' +
          '<div class="persoane">' + creditor + persoaneTerţe + '</div>' +
          '<div class="persoane">' + debitori + '</div>' +
        '</li>\n\n';
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

var BaraDeSus = {
  $: $('#bara-de-sus'),

  init: function() {
    this.$
      .on('click', '.dialog+button', this.afişeazăDialog)
      .on('ascundere', '.dialog', this.deselecteazăButonul)
      .on('afişare', '.dialog', this.selecteazăButonul)
      .on('click', '.dialog button.închide', this.închideDialog)
      .on('keyup', '.dialog :input', function(e) {
        if (e.keyCode == 27) $(this).closest('.dialog').ascunde();
      });

    Formular.$
      .on('iniţializat populat', this.semiascundeInstrumente)
      .on('închidere', this.semiaratăInstrumente);

    Profil.init();
    CalculatorDobîndaÎntîrziere.init();
  },

  semiascundeInstrumente: function() {
    BaraDeSus.$.find('.instrumente').addClass('semiascuns');
  },

  semiaratăInstrumente: function() {
    BaraDeSus.$.find('.instrumente').removeClass('semiascuns');
  },

  afişeazăDialog: function() {
    var buton = $(this),
        dialog = buton.prev('.dialog');

    if (dialog.is(':visible')) {
      dialog.ascunde();
    } else {
      BaraDeSus.$.find('.dialog:visible').not(this).ascunde();

      dialog.afişează(function() {
        $(this).find('input:not([readonly]):first').focus();
      });
    }
  },

  închideDialog: function() {
    $(this).closest('.dialog').ascunde();
  },

  selecteazăButonul: function() {
    $(this).next('button').addClass('selectat');
  },

  deselecteazăButonul: function() {
    $(this).next('button').removeClass('selectat');
  }
};

// --------------------------------------------------

var Profil = {
  $: $('#profil'),

  init: function() {
    Bănci.încarcă(function() {
      Profil.url = '/date/' + Utilizator.login + '/profil.json';
      Profil.încarcăDate();
      Profil.$
        .on('click', 'button.salvează', Profil.salvează)
        .on('ascundere', Profil.reseteazăDialog);
    });
  },

  încarcăDate: function() {
    $.getJSON(Profil.url, function(date) {
      Profil.date = date;
      Profil.reseteazăDialog();
    });
  },

  salvează: function() {
    function cîmp(selector) {return Profil.$.find(selector).val()}

    Profil.date = {
      'nume': cîmp('#nume-executor'),
      'adresa': cîmp('#adresa-executor'),
      'codul-fiscal': cîmp('#codul-fiscal'),
      'instanţa-teritorială': cîmp('#instanţa-teritorială'),
      'email': cîmp('#email'),
      'cont-taxe-speze': cîmp('#cont-taxe-speze'),
      'banca-taxe-speze': cîmp('#banca-taxe-speze'),
      'cont-onorarii': cîmp('#cont-onorarii'),
      'banca-onorarii': cîmp('#banca-onorarii')
    };

    $.post(Profil.url, JSON.stringify(Profil.date), function() {
      Profil.$.find('button.închide').click();
    });
  },

  reseteazăDialog: function() {
    function cîmp(selector, valoare) {Profil.$.find(selector).val(valoare)}

    cîmp('#nume-executor', Profil.date['nume']);
    cîmp('#adresa-executor', Profil.date['adresa']);
    cîmp('#codul-fiscal', Profil.date['codul-fiscal']);
    cîmp('#instanţa-teritorială', Profil.date['instanţa-teritorială']);
    cîmp('#email', Profil.date['email']);
    cîmp('#cont-taxe-speze', Profil.date['cont-taxe-speze']);
    cîmp('#banca-taxe-speze', Profil.date['banca-taxe-speze']);
    Bănci.setează(Profil.date['banca-taxe-speze'], Profil.$.find('#banca-taxe-speze'));
    cîmp('#cont-onorarii', Profil.date['cont-onorarii']);
    cîmp('#banca-onorarii', Profil.date['banca-onorarii']);
    Bănci.setează(Profil.date['banca-onorarii'], Profil.$.find('#banca-onorarii'));
  }
};

// --------------------------------------------------

var Bănci = {
  lista: {},

  încarcă: function(callback) {
    if ($.isEmptyObject(this.lista)) {
      $.getJSON('/bnm/bănci.json', function(lista) {
        Bănci.lista = lista;
        Bănci.initCîmpuri();

        callback();
      })
    }
  },

  initCîmpuri: function() {
    $(document)
      .on('input', 'input.sufix-cod-bancă', Bănci.listeazăDupăSufix)
      .on('click', '.şoaptă-cod-bancă', function() {$(this).next().focus().select()});
  },

  listeazăDupăSufix: function(e) {
    var cîmp = $(this),
        sufix = $.trim(cîmp.val());

    if (!sufix) {
      ascundeRezultate();
      return;
    }

    var rezultate = Bănci.cautăDupăSufix(sufix);

    if ($.isEmptyObject(rezultate)) return;

    var primul = true,
        lista = '', cod;

    for (cod in rezultate) {
      lista +=
        '<li class="item' + (primul ? ' selectat' : '') + '">' +
          cod.replace(/(.{3})$/, ' <b>$1</b>') + ': ' + rezultate[cod] +
        '</li>';

      if (primul) primul = false;
    }

    lista = '<ul class="rezultate cu umbră">' + lista + '</ul>';
    ascundeRezultate();

    $(lista)
      .insertBefore(cîmp)
      .on('mouseenter', '.item', function() {$(this).addClass('selectat').siblings().removeClass('selectat')})
      .on('mouseleave', '.item', function() {$(this).removeClass('selectat')})
      .on('click', '.item', alegeItem);

    cîmp
      .bind('keydown', 'down', evidenţiazăItem)
      .bind('keydown', 'up', evidenţiazăItem)
      .bind('keyup', 'esc', ascundeRezultate)
      .bind('keydown', 'return', alegeItem);

    function evidenţiazăItem(e) {
      var tasta = e.data,
          lista = cîmp.prev('.rezultate'),
          curent = lista.find('.selectat'), următorul;

      switch (tasta) {
      case 'down':
        următorul = curent.is(':last-child') ? lista.children().first() : curent.next('.item');
        break;
      case 'up':
        următorul = curent.is(':first-child') ? lista.children().last() : curent.prev('.item');
        break;
      }

      curent.removeClass('selectat');
      următorul.addClass('selectat');
    }

    function alegeItem() {
      var banca = cîmp.prev('.rezultate').find('.selectat').text(),
          sufix = banca.match(/(\d{3}): /)[1];

      Bănci.setează(sufix, cîmp);
      ascundeRezultate();
    }


    function ascundeRezultate() {
      cîmp
        .off('keydown keyup')
        .prev('.rezultate').remove();
    }
  },

  cautăDupăSufix: function(sufix) {
    var MAX_REZULTATE = 10;
    var lungimeSufix = sufix.length,
        cod, numărRezultate = 0,
        rezultate = {};

    for (cod in Bănci.lista) {
      if (cod.substr(8, lungimeSufix) == sufix) {
        rezultate[cod] = Bănci.lista[cod];
        numărRezultate++;

        if (numărRezultate == MAX_REZULTATE) break;
      }
    }

    return rezultate;
  },

  setează: function(sufix, cîmp) {
    banca = Bănci.cautăDupăSufix(sufix);

    if ($.isEmptyObject(banca)) return;

    var cod, sufix, denumire;

    for (cod in banca) denumire = banca[cod];

    sufix = $.trim(cod.substr(8))
    cîmp = $(cîmp);

    cîmp.val(sufix);
    cîmp.siblings('.şoaptă-cod-bancă').text(cod.substr(0, 8)), cod.substr(0, 8);
    cîmp.siblings('p').text(denumire);
}
};

// --------------------------------------------------

var CalculatorDobîndaÎntîrziere = {
  $: $('#calculator'),

  init: function() {
    this.$
      .on('input change', ':input:not(.dobîndă)', this.calculeazăDobînda)
      .on('afişare', this.resetează);
  },

  resetează: function() {
    CalculatorDobîndaÎntîrziere.$
      .find('input:text').val('').end()
      .find('#art619-1').removeAttr('checked').end()
      .find('#art619-2').attr('checked', 'checked').end()
      .find('#sume .item:not(.prima)').remove();
  },

  calculeazăDobînda: function() {
    var secţiune = CalculatorDobîndaÎntîrziere.$,
        întîrziere = Subsecţiuni.întîrzieri.colectează(secţiune),
        dobînda = DobîndaDeÎntîrziere.calculează(întîrziere);

    secţiune.find('.dobîndă').val(dobînda);
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
    this.insereazăButon();

    $(document)
      .on('click', '.dată+.ui-icon-calendar', this.afişează)
      .on('focus', '.dată', this.seteazăMasca);
  },

  insereazăButon: function() {
    $('<span>')
      .addClass('ui-icon ui-icon-calendar semiascuns')
      .attr('title', 'Calendar')
      .insertAfter('.dată');
  },

  afişează: function() {
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
  },

  seteazăMasca: function() {
    $(this).mask('99.99.9999');
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
      })
      .on('eliminare', '.personalizat', function() {
        $(this).find('input').val(0).trigger('input');
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
          .trigger('input')
        .end()
        .show('blind', function() {
          if (Formular.sePopulează || Formular.seIniţializează) return;

          $(this).find('.etichetă')
            .focus()
            .select();
        });
  }
};

// --------------------------------------------------

var ÎncasarePensie = {
  $: $(),
  $cota: $(),

  init: function() {
    Formular.$
      .on('înainte-de-deschidere', this.inserează)
      .on('închidere', this.elimină);

    Formular.$obiectulUrmăririi
      .on('input', '.încasare input', this.caluleazăOnorariulŞiPensia);
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

    ÎncasarePensie.calculare[genulÎncasării + ' ' + modulDeCuantificare]($încasare);
  },

  calculare: {
    'periodică cotă': function($încasare) {
      var cota = ÎncasarePensie.evalueazăCota($încasare.find('#cota-din-venit').val()),
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
      var cota = ÎncasarePensie.evalueazăCota($încasare.find('#cota-din-venit').val()),
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
      var cota = ÎncasarePensie.evalueazăCota($încasare.find('#cota-din-venit').val()),
          totalVenit = $încasare.find('#total-venit-pe-perioadă').suma(),
          totalPensieCotă = cota * totalVenit;

      if (isNaN(totalPensieCotă)) return;

      $încasare.find('#total-pensie-cotă').val(totalPensieCotă.toFixed(2));
      $încasare.find('#onorariul-calculat').val(Onorariu.pecuniar(totalPensieCotă).toFixed(2));
    },

    'restantă sumă fixă': function($încasare) {
      var numărulDeLuni = ÎncasarePensie.numărulDeLuni($încasare),
          pensiaLunară = $încasare.find('#pensia-lunară-suma-fixă').suma(),
          totalPensie = pensiaLunară * numărulDeLuni;

      if (isNaN(totalPensie)) return;

      $încasare.find('#total-pensie-sumă-fixă').val(totalPensie.toFixed(2));
      $încasare.find('#onorariul-calculat').val(Onorariu.pecuniar(totalPensie).toFixed(2));
    },

    'restantă mixtă': function($încasare) {
      var cota = ÎncasarePensie.evalueazăCota($încasare.find('#cota-din-venit').val()),
          totalVenit = $încasare.find('#total-venit-pe-perioadă').suma(),
          totalPensieCotă = cota * totalVenit;

      if (isNaN(totalPensieCotă)) return;

      $încasare.find('#total-pensie-cotă').val(totalPensieCotă.toFixed(2));

      var numărulDeLuni = ÎncasarePensie.numărulDeLuni($încasare),
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

  inserează: function() {
    if (!Formular.pensieDeÎntreţinere()) return;

    var $secţiune = Formular.$obiectulUrmăririi.find('.conţinut');

    $secţiune
      .data('conţinut-iniţial', $secţiune.find('ul:first').remove())
      .find('#adaugă-subsecţiune .încasare').click().end()
      .find('.subsecţiune.încasare #genul-încasării').trigger('change');

    ÎncasarePensie.$ = $secţiune;
    Formular.focusează();
  },

  elimină: function() {
    if (!Formular.pensieDeÎntreţinere()) return;

    var secţiune = Formular.$obiectulUrmăririi.find('.conţinut');

    secţiune.prepend(secţiune.data('conţinut-iniţial'));
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
  $: $('#onorariu'),

  init: function() {
    var schimbareDate = 'change input',
        cîmpuriRelevante = [
          '.sumă:not(.irelevant-pentru-onorariu, .calculat)',
          '.valuta',
          FormulareŞablon.selector,
          'input:checkbox',
          '#caracter',
          '#obiect'
        ].join(',');

    Formular.$obiectulUrmăririi.on(schimbareDate, cîmpuriRelevante, this.calculează);
    Formular.$.on(schimbareDate, '.debitor #gen-persoană, #părţile-au-ajuns-la-conciliere', this.calculează);
  },

  calculează: function() {
    if (Formular.seIniţializează || Formular.sePopulează) return;
    if (Onorariu.timerCalculare) return;

    Onorariu.timerCalculare = setTimeout(function() {
      var $secţiune = Formular.$obiectulUrmăririi,
          caracter = $secţiune.find('#caracter').val(),
          onorariu = 0;

      if (caracter == 'nonpecuniar') {
        var obiect = Formular.$obiectulUrmăririi.find('#obiect').val(),
            genPersoană = Formular.$.find('.debitor #gen-persoană').val();

        valoare = Onorariu.nonpecuniar[obiect][genPersoană];
        onorariu = typeof valoare == 'function' ? valoare() : valoare;
      } else {
        var total = $secţiune.find('.conţinut ul:first .sumă:not(.calculat), .întîrziere .dobîndă').suma();

        $secţiune.find('#total').val(total).trigger('change');

        if (Formular.pensieDeÎntreţinere()) {
          onorariu = $secţiune.find('.încasare #onorariul-calculat').suma();
        } else {
          onorariu = Onorariu.pecuniar(total);
        }
      }

      if (Cheltuieli.$.find('#părţile-au-ajuns-la-conciliere').is(':checked')) {
        onorariu *= .7;
      }

      Onorariu.$.val(onorariu.toFixed(2));
      Onorariu.timerCalculare = false;
    }, 200);
  },

  pecuniar: function(suma) {
    if (suma <= 100000) {
      var minim = Formular.$obiectulUrmăririi.find('#amendă').is(':checked') ? 200 : 500;

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

  calculează: function(e) {
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

    Cheltuieli.$.find('#total-taxe-şi-speze').val(total);
  }
};

// --------------------------------------------------

var Sume = {
  init: function() {
    $(document).on('input keyup', 'input.sumă', this.înlocuieşteVirgulaCuPunct);
  },

  înlocuieşteVirgulaCuPunct: function(e) {
    if (!/,/.test(this.value)) return;

    var poziţieCursor = this.selectionStart;

    this.value = this.value.replace(/,/g, '.');
    this.selectionStart = poziţieCursor;
    this.selectionEnd = poziţieCursor;
  }
};

// --------------------------------------------------

var Subsecţiuni = {
  init: function() {
    Formular.$
      .on('înainte-de-deschidere', this.ajusteazăVizibilitateOpţiuni)
      .on('închidere', this.eliminăSubsecţiuni);

    Formular.$obiectulUrmăririi
      .on('mouseenter', '#adaugă-subsecţiune', this.ajusteazăVizibilitateOpţiuni)
      .on('change', '#caracter', this.ajusteazăVizibilitateOpţiuni)
      .on('eliminare', '.subsecţiune', function() {
        $(this).find('.sumă').val(0).trigger('input');
      });

    this.încasări.init();
    this.întîrzieri.init();
    this.bunuriSechestrate.init();
  },

  ajusteazăVizibilitateOpţiuni: function() {
    if (Formular.pensieDeÎntreţinere()) return;

    var $secţiune = Formular.$obiectulUrmăririi,
        $opţiuni = $secţiune.find('#adaugă-subsecţiune'),
        $amendă = $secţiune.find('#amendă'),
        caracter = $secţiune.find('#caracter').val();

    $opţiuni.find('.încasare').hide();

    if (caracter == 'nonpecuniar') {
      $opţiuni
        .find('.sechestrare-bunuri').show().end()
        .find('.întîrziere').hide();
    } else if (caracter == 'pecuniar') {
      $opţiuni
        .find('.sechestrare-bunuri').show().end()
        .find('.întîrziere').toggle(!$amendă.is(':checked'));
    }

  },

  eliminăSubsecţiuni: function() {
    Formular.$obiectulUrmăririi.find('.subsecţiune').remove();
  },

  încasări: {
    init: function() {
      Formular.$obiectulUrmăririi
        .on('click', '#adaugă-subsecţiune .încasare', this.adaugăSubsecţiune);
    },

    adaugăSubsecţiune: function() {
      var $încasare = $($şabloane.find('#subsecţiune-încasare').html());

      $încasare
        .hide()
        .insertBefore($(this).closest('#adaugă-subsecţiune'))
        .show('blind');

      $.fx.off = true;
      $încasare.find('#genul-încasării').trigger('change');
      $.fx.off = false;

      if (!Formular.sePopulează) $încasare.find('input').first().focus();

      $(this).siblings().show();
    }
  },

  întîrzieri: {
    init: function() {
      Formular.$obiectulUrmăririi
        .on('input change', '.subsecţiune.întîrziere :input:not(.dobîndă)', this.calculeazăDobînda)
        .on('click', '#adaugă-subsecţiune li.întîrziere', this.adaugăSubsecţiune);
    },

    adaugăSubsecţiune: function() {
      var $secţiune = $(this).closest('.conţinut'), $subsecţiune;

      $subsecţiune = $şabloane.find('.subsecţiune.întîrziere').clone()
        .find(':radio').attr('name', function(i, name) {
          return name + $secţiune.find('.subsecţiune.întîrziere').length;
        }).end()
        .hide()
        .insertBefore($(this).closest('#adaugă-subsecţiune'))
        .show('blind');

      if (!Formular.seIniţializează && !Formular.sePopulează) {
        $subsecţiune.find('.început.perioadă').focus();
      }
    },

    calculeazăDobînda: function() {
      if (Formular.sePopulează || Formular.seIniţializează) return;

      var $întîrziere = $(this).closest('.subsecţiune.întîrziere'),
          întîrziere = Subsecţiuni.întîrzieri.colectează($întîrziere),
          dobînda = DobîndaDeÎntîrziere.calculează(întîrziere);

      $întîrziere.find('.sumă.dobîndă').val(dobînda);
      Onorariu.calculează();
    },

    colectează: function($întîrziere) {
      return {
        începutPerioadă: $întîrziere.find('.început.perioadă').val(),
        sfîrşitPerioadă: $întîrziere.find('.sfîrşit.perioadă').val(),
        rata: $întîrziere.find(':radio:checked').val(),
        suma: $întîrziere.find('.sumă.întîrziată').val()
      };
    },

    titluÎncheiere: function($subsecţiune) {
      var începutPerioadă = $subsecţiune.find('.început.perioadă').val(),
          sfîrşitPerioadă = $subsecţiune.find('.sfîrşit.perioadă').val();

      return 'Încheiere-cu-privire-la-calcularea-dobînzilor-de-întîrziere-' +
          începutPerioadă + '-' + sfîrşitPerioadă;
    },

    titluAnexă: function($subsecţiune) {
      var începutPerioadă = $subsecţiune.find('.început.perioadă').val(),
          sfîrşitPerioadă = $subsecţiune.find('.sfîrşit.perioadă').val();

      return 'Anexă-încheiere-cu-privire-la-calcularea-dobînzilor-de-întîrziere-' +
          începutPerioadă + '-' + sfîrşitPerioadă;
    }
  },

  bunuriSechestrate: {
    init: function() {
      Formular.$obiectulUrmăririi
        .on('click', '#adaugă-subsecţiune .sechestrare-bunuri', this.adaugăSubsecţiune)
        .on('click', '.subsecţiune.sechestrare-bunuri .adaugă-cîmp-personalizat', this.scoateClasaDeTot)
        .on('eliminare', '.personalizat', this.calculeazăTotal)
        .on('input change', ':input:not(.etichetă)', this.calculeazăTotal);
    },

    adaugăSubsecţiune: function() {
      var $secţiune = $(this).parent();

      $şabloane.find('.subsecţiune.sechestrare-bunuri').clone()
        .hide()
        .insertBefore($(this).closest('#adaugă-subsecţiune'))
        .show().find('textarea.etichetă').trigger('input').end().hide() // ajustează dimensiunea etichetei personalizate
        .show('blind', function() {
          $(this).find('textarea.etichetă').select();
        });
    },

    scoateClasaDeTot: function() {
      var subsecţiune = $(this).parent().parent();

      setTimeout(function() {
        subsecţiune.find('.personalizat.eliminabil.de.tot').removeClass('de tot');
      }, 100);
    },

    calculeazăTotal: function() {
      var subsecţiune = $(this).closest('.subsecţiune'),
          total = subsecţiune.find('.total');

      total.val(subsecţiune.find('.sumă').not(total).suma());
    }
  }
};

// --------------------------------------------------

var Rapoarte = {
  init: function() {
    $(document).on('click', '[data-raport]', this.deschide);

    Formular.$.on('închidere', this.închide);
  },

  deschide: function() {
    var buton = $(this),
        raport = buton.data('raport'),
        pagina;

    if (buton.is('.salvat')) {
      pagina = buton.data('pagina');
    } else {
      pagina = '/rapoarte/' + raport + '.html';
    }

    Rapoarte[pagina] = {
      tab: window.open(pagina, raport, '', true),
      buton: $(this)
    };
  },

  închide: function() {
    var excepţii = {
      init: 0,
      deschide: 0,
      închide: 0
    };

    var nume, raport;

    for (var nume in Rapoarte) {
      if (nume in excepţii) continue;

      raport = Rapoarte[nume];

      if (raport && raport.tab) raport.tab.close()
    }
  }
};

// --------------------------------------------------

var Secţiuni = {
  init: function() {
    Formular.$.on('click', 'fieldset button.desfăşoară', this.desfăşoară);
  },

  desfăşoară: function() {
    var fieldset = $(this).closest('fieldset'),
        set;

    if (fieldset.is('#creditor') || fieldset.is('.debitor') || fieldset.is('.persoană-terţă')) {
      set = Formular.$.find('#creditor, .debitor, .persoană-terţă');
    } else if (fieldset.is('#document-executoriu') || fieldset.is('#obiectul-urmăririi')) {
      set = Formular.$.find('#document-executoriu, #obiectul-urmăririi');
    } else {
      set = fieldset;
    }

    set.find('.conţinut').toggle('blind', function() {
      var conţinut = $(this),
          titlu = $(this).is(':visible') ? 'Colapsează' : 'Desfăşoară'

      $(this).closest('fieldset').find('button.desfăşoară').attr('title', titlu);
    });
  }
};

// --------------------------------------------------

var ListeMeniu = {
  init: function() {
    Formular.$
      .on('mouseenter', '.listă', this.afişează)
      .on('mouseleave', '.listă', this.ascunde);
  },

  afişează: function() {
    $(this).children('.itemi').afişează();
  },

  ascunde: function() {
    $(this).children('.itemi').ascunde();
  }
};

// --------------------------------------------------

$.fn.există = function() {
  return this.length > 0;
}

// --------------------------------------------------

$.fn.ascunde = function() {
  return this.stop(true, true).fadeOut().trigger('ascundere');
};

// --------------------------------------------------

$.fn.afişează = function(callback) {
  return this.delay(200).fadeIn(callback).trigger('afişare');
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

// --------------------------------------------------

Action.init();
