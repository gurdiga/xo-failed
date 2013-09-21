/*global top:false moment:false RateDeBază:false RateBNM:false Handlebars:false*/

(function(window, document, moment) {
  'use strict';

  // --------------------------------------------------

  $.extend($.expr[':'], {

    'focused': function(element) {
      return element === element.ownerDocument.activeElement;
    }

  });

  // --------------------------------------------------

  $.extend($.fn, {

    'există': function() {
      return this.length > 0;
    },


    'ascunde': function() {
      return this.stop(true, true).fadeOut(function() {
        $(this).trigger('ascundere');
      });
    },


    'afişează': function() {
      return this.delay(200).fadeIn(function() {
        $(this).trigger('afişare');
      });
    },


    'val1': function(value) {
      if (typeof value !== 'undefined') {
        if (this.is(':checkbox')) {
          return this.prop('checked', value === true);
        } else {
          return this.val(value);
        }
      }

      return this.is(':checkbox') ? this.is(':checked') : this.val();
    },


    'suma': function() {
      var suma = 0;

      this.filter('input').each(function() {
        /*jshint maxcomplexity:5*/
        var cîmp = $(this),
            existăValoare = $.trim(cîmp.val()) !== '';


        if ($.isNumeric(cîmp.val()) && cîmp.val() >= 0) {
          if (cîmp.is('.invalid')) cîmp.removeClass('invalid');

          if (cîmp.next().is('.valuta') && cîmp.next('.valuta').val() !== 'MDL') {
            var valuta = cîmp.next('.valuta').val(),
                rataBNM = RateBNM[valuta];

            suma += this.value * rataBNM.value / rataBNM.nominal;
          } else {
            suma += parseFloat(this.value);
          }
        } else {
          if (existăValoare) cîmp.addClass('invalid');
        }
      });

      return parseFloat(suma.toFixed(2));
    }

  });

  // --------------------------------------------------

  $.extend($, {

    'reEscape': function(re) {
      return re.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
    },


    'put': function(url, data) {
      return $.ajax({
        type: 'PUT',
        url: url,
        data: data
      });
    }

  });

  // --------------------------------------------------

  window.$şabloane = $('#şabloane');

  var UC = 20, // valoarea unităţii convenţionale în MDL
      RE_FORMATUL_DATEI = /(\d{2})\.(\d{2})\.(\d{4})/,
      FORMATUL_DATEI = 'DD.MM.YYYY',

  location = window.location,

  Action = {
    init: function() {
      Action.seteazăOpţiuniAjax();

      Utilizator.init();

      if (!Utilizator.autentificat) return;

      BNM.init();
      HashController.init();
      Valute.init();
      SubsecţiuniDinamice.init();
      TextareaElastice.init();
      SelecturiFoarteLate.init();
      Persoane.init();
      Cheltuieli.init();
      ButonDeEliminare.init();
      Subsecţiuni.init();
      FormularProcedură.init();
      Calendar.init();
      EticheteEditabile.init();
      ProceduriRecente.init();
      Sume.init();
      ÎncasarePensie.init();
      Încheieri.init();
      Secţiuni.init();
      ListeMeniu.init();
      ButoaneProceduri.init();
      BaraDeSus.init();
      Căutare.init();

      $(window).trigger('hashchange');
    },

    '#index': function() {
      $('#căutare input').focus();
    },

    seteazăOpţiuniAjax: function() {
      $.ajaxSetup({
        beforeSend: function() {
          var salvareProcedură = /\.json$/.test(this.url),
              creareProcedură = /\/proceduri\/$/.test(this.url);

          if (this.type === 'PUT' && (salvareProcedură || creareProcedură)) {
            var tip = StructuriDate.tipPerUrl(this.url);

            if (tip) {
              var data = JSON.parse(this.data);

              StructuriDate.seteazăVersiune(tip, data);
              this.data = JSON.stringify(data);
            }
          }
        },

        dataFilter: function(data, type) {
          if (type === 'json') {
            var tip = StructuriDate.tipPerUrl(this.url);

            if (tip) {
              data = JSON.parse(data);
              data = StructuriDate.aplicăSchimbări(tip, data);
              data = JSON.stringify(data);
            }
          }

          return data;
        }
      });

    }
  },

  // --------------------------------------------------

  BNM = {
    init: function() {
      $.get('/date/bnm/current.js');
      $.get('/date/bnm/rata_de_bază.js');
    }
  },

  // --------------------------------------------------

  Valute = {
    init: function() {
      this.populeazăListe();
    },

    populeazăListe: function() {
      var şablon = window.$şabloane.find('.valute').html();

      $('ul .valuta').html(şablon);
    }
  },

  // --------------------------------------------------

  Persoane = {
    init: function() {
      FormularProcedură.$.on('click', 'button.adaugă.persoană', this.adaugă);
    },

    adaugă: function() {
      var $buton = $(this),
          $persoanaPrecedentă = $buton.prev(),
          $persoanaAdăugată = $buton.prev().clone();

      $persoanaAdăugată
        .removeAttr('id') // #creditor
        .find('.conţinut').removeAttr('style').end()
        .find('input,textarea').val('').end()
        .find('legend').text(function(i, text) {
          if ($buton.is('.persoană.terţă')) {
            $persoanaAdăugată.addClass('persoană-terţă');

            return $buton.find('.legend.label').text();
          } else {
            return text;
          }
        }).end()
        .hide()
        .insertAfter($persoanaPrecedentă)
        .find('#gen-persoană').trigger('change').end()
        .show('blind', function() {
          $persoanaAdăugată.addClass('dispensabilă eliminabil de tot');
          FormularProcedură.$.trigger('adăugat-persoană');
        });
    }
  },

  // --------------------------------------------------

  HashController = {
    init: function() {
      $(window).on('hashchange', function() { HashController.acţionează(location, document.body); });
    },

    acţionează: function(location, body) {
      var hashValid = (/^#formular\?([SP]|\d+)?$/).test(location.hash);

      if (location.hash && !hashValid) location.hash = '';

      if (!Utilizator.autentificat) {
        location.hash = '';
        return;
      }

      $(body).addClass('autentificat');

      var pagina = HashController.pagină();

      if (Action[pagina]) Action[pagina]();
    },

    hash: function(hash) {
      hash = hash || location.hash;

      if (hash === '' || hash === '#') hash = '#index';

      return hash;
    },

    pagină: function() {
      return this.hash().split('?')[0];
    },

    date: function() {
      return this.hash().split('?')[1] || '';
    }
  },

  // --------------------------------------------------

  TextareaElastice = {
    evenimente: 'keydown keyup input focus mouseup',

    init: function() {
      FormularProcedură.$
        .attr('spellcheck', 'false')
        .on(this.evenimente, 'textarea', this.autodimensionează);
    },

    autodimensionează: function() {
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
    }
  },

  // --------------------------------------------------

  SelecturiFoarteLate = {
    init: function() {
      FormularProcedură.$
        .on('change', 'select.foarte.lat', this.afişeazăŞoaptă)
        .find('select.foarte.lat').trigger('change').end()
        .on('change', 'select.care.schimbă.formularul', this.afişeazăŞoaptePentruSelecturileUrmătoare);
    },

    afişeazăŞoaptă: function() {
      var $select = $(this);

      $select.next('.şoaptă').remove();

      if ($select.find('option:selected').is('.scurtă')) return;

      $('<p>')
        .insertAfter($select)
        .hide()
        .slideDown()
        .text($select.find('option:selected').text())
        .addClass('şoaptă');
    },

    afişeazăŞoaptePentruSelecturileUrmătoare: function() {
      $(this).closest('li')
        .nextAll().find('select.foarte.lat').trigger('change');
    }
  },

  // --------------------------------------------------

  SubsecţiuniDinamice = {
    selector: 'select.care.schimbă.formularul',

    init: function() {
      FormularProcedură.$.on('change', this.selector, this.inserează);
    },

    inserează: function() {
      var $select = $(this),
          selectorŞablon = '.' + $select.attr('id') + '.conţinut[title="' + $select.val() + '"]',
          şablon = SubsecţiuniDinamice.parseazăIncluderile(window.$şabloane.find(selectorŞablon).html()),
          $item = $select.closest('li'),
          $subformular;

      $item.nextAll().remove();
      $item.after(şablon).hide().slideDown();

      $subformular = $item.nextAll();
      $subformular.find(SubsecţiuniDinamice.selector).trigger('change');

      if (FormularProcedură.seIniţializează) return;

      $subformular
        .find(':input:not(' + SubsecţiuniDinamice.selector + ')').first().focus().end().end()
        .find('.adaugă-cîmp-personalizat.implicit').click();

      $select.trigger('inserat-subsecţiune');
    },

    parseazăIncluderile: function(html) {
      if (!html) return html;

      return html.replace(/<!-- include (.*?) -->/g, function(match, selector) {
        return window.$şabloane.find(selector).html();
      });
    }
  },

  // --------------------------------------------------

  Cheltuieli = {
    $: $('#cheltuieli'),
    $adăugate: $('#cheltuieli .adăugate'),

    init: function() {
      this.categorii.init();
      this.subformulare.init();
      this.destinatariDocumenteAdresabile.init();
      this.achitare.init();

      Destinatari.init();
      Onorariu.init();
      TotalCheltuieli.init();
    },

    // întoarce unul dintre procedură.cheltuieli.itemi după id
    item: function(itemi, id) {
      for (var i = 0, l = itemi.length; i < l; i++) {
        if (itemi[i].id === id) return itemi[i].date;
      }
    },

    categorii: {
      $: $('#categorii-taxe-şi-speze'),

      init: function() {
        this.$
          .on('mouseenter', '.listă', this.marcheazăItemiAdăugaţiDeja)
          .on('click', '.listă .item', this.adaugăItem);
      },

      marcheazăItemiAdăugaţiDeja: function() {
        var itemiUniciAdăugaţiDeja = Cheltuieli.$adăugate.children('.item.unic'),
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

      pregăteşteOCopieLaItem: function($item) {
        $item = $item.clone();

        var subformular = $item.attr('data-şablon-subformular');

        if (subformular) {
          window.$şabloane.find('[title="' + subformular + '"]').clone()
            .removeAttr('title')
            .appendTo($item);
        }

        var bifăAchitare = window.$şabloane.find('.achitare').clone();

        return $item
          .append(bifăAchitare)
          .addClass('eliminabil de tot');
      },

      adaugăItem: function() {
        var $item = $(this);

        if ($item.is('.dezactivat')) return;

        var $copieItem = Cheltuieli.categorii.pregăteşteOCopieLaItem($item)
          .hide()
          .appendTo(Cheltuieli.$adăugate)
          .show('blind')
          .find('.etichetă').trigger('input').end();

        if (!FormularProcedură.seIniţializează) {
          $copieItem.find(':input:visible').first().focus();
        }

        Cheltuieli.$adăugate.trigger('recalculare');

        $(this).closest('.itemi').fadeOut();

        TotalCheltuieli.calculează();
      }
    },

    subformulare: {
      init: function() {
        Cheltuieli.$adăugate.on('click', 'button.adaugă', this.adaugă);
      },

      adaugă: function() {
        var numeŞablon = $(this).closest('.item').attr('data-şablon-subformular'),
            şablon = window.$şabloane.find('.subformular[title="' + numeŞablon + '"] .document').first(),
            $subformular = şablon.clone();

        $subformular
          .hide()
          .insertBefore($(this).parent())
          .show('blind');

        if (!FormularProcedură.seIniţializează) $subformular.find('textarea,input').first().focus();

        TotalCheltuieli.calculează();
      }
    },

    destinatariDocumenteAdresabile: {
      init: function() {
        Cheltuieli.$adăugate
          .on('click', '.destinatari-adăugaţi', this.ascundeSauAfişează)
          .on('eliminare', '.destinatari-adăugaţi .eliminabil', this.ascundeListaDacăNuMaiSunt)
          .on('eliminare', '.destinatari-adăugaţi .eliminabil', TotalCheltuieli.calculează);
      },

      ascundeSauAfişează: function(e) {
        var destinatari = $(this),
            subformular = destinatari.closest('.subformular');

        subformular.find('.destinatari-adăugaţi').not(this)
          .addClass('comprimaţi')
          .removeClass('cu umbră');

        if (e.target === this && destinatari.children().există()) {
          destinatari
            .toggleClass('comprimaţi')
            .toggleClass('cu umbră');
        }
      },

      ascundeListaDacăNuMaiSunt: function() {
        var destinatar = $(this);

        if (!destinatar.siblings().există()) destinatar.parent().click();
      }
    },

    achitare: {
      init: function() {
        FormularProcedură.$.on('click', '.achitare :checkbox', this.setează);
      },

      setează: function() {
        var bifa = $(this),
            data = bifa.siblings('.la').find('.dată'),
            item = bifa.closest('.item');

        if (bifa.is(':checked') && $.trim(data.val()) === '') {
          data.val(moment().format(FORMATUL_DATEI));
        }

        item.toggleClass('achitat', bifa.is(':checked'));
      }
    }
  },

  // --------------------------------------------------

  Destinatari = {
    $: window.$şabloane.find('#destinatari'),
    $adăugaţiDeja: $(),

    init: function() {
      this.categorii.init();
      this.butonDeAdăugare.init();
    },

    butonDeAdăugare: {
      init: function() {
        Cheltuieli.$adăugate
          .on('mouseenter', '.adaugă-destinatar', this.afişeazăCategoriile);
      },

      afişeazăCategoriile: function() {
        Destinatari.$adăugaţiDeja = $(this).prev('.destinatari-adăugaţi');
        Destinatari.$
          .find('.itemi>li').removeClass('dezactivat').end()
          .appendTo(this)
          .afişează();
      }
    },

    categorii: {
      init: function() {
        Cheltuieli.$
          .on('click', '#destinatari .listă .titlu .adaugă-toate', this.adaugăToate)
          .on('click', '#destinatari .listă>.itemi>li', Destinatari.adaugă)
          .on('mouseenter', '#destinatari .listă', this.marcheazăItemiAdăugaţiDeja);
      },

      marcheazăItemiAdăugaţiDeja: function() {
        var destinatari = $(this).find('.itemi').children(),
            destinatariAdăugaţiDeja = Destinatari.$adăugaţiDeja.children(':not(.persoană.terţă)');

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
            adăugaţiDeja = Destinatari.$adăugaţiDeja.children().map(function() {
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
        .appendTo(Destinatari.$adăugaţiDeja);

      $(this).addClass('dezactivat').hide().show(); /* hide-show e pentru actualizarea cursorului */

      if (destinatar.is('.persoană.terţă')) {
        Destinatari.$adăugaţiDeja.click();
        destinatar.append('<input/>');

        if (!FormularProcedură.seIniţializează) {
          Destinatari.$.hide();
          destinatar.find('input').focus();
        }
      }

      TotalCheltuieli.calculează();
      Destinatari.actualizeazăNumăr(Destinatari.$adăugaţiDeja);
    },

    actualizeazăNumăr: function($lista) {
      $lista.toggleClass('comprimaţi');
      setTimeout(function() {
        $lista.toggleClass('comprimaţi');
      }, 1);
    }
  },

  // --------------------------------------------------

  ButonDeEliminare = {
    $: window.$şabloane.find('.elimină'),
    eliminabilPrecedent: $(),

    init: function() {
      FormularProcedură.$
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

      eliminabil
        .trigger('eliminare')
        .slideUp(function() {
          eliminabil.trigger('eliminat').remove();
          TotalCheltuieli.calculează(); // TODO de mutat asta în locul corespunzător
        });
    }
  },

  // --------------------------------------------------

  Utilizator = {
    login: '',
    autentificat: false,

    init: function() {
      Utilizator.verificăSessiuneaHttp();

      Utilizator.login = $.cookie('login');
      Utilizator.autentificat = !!$.trim(Utilizator.login);

      $('#autentificare').toggle(!Utilizator.autentificat);
      $('body').toggleClass('autentificat', Utilizator.autentificat);
      $('#număr-licenţă').val(Utilizator.login);
    },

    verificăSessiuneaHttp: function() {
      $(document).ajaxError(function(event, response) {
        if (response.status === 401 || response.status === 403) {
          $.cookie('login', null);
          location.reload();
        }
      });
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
  },

  // --------------------------------------------------

  FormularProcedură = {
    $: $('#formular'),
    $titlu: $('#formular h1'),
    $obiectulUrmăririi: $('#formular #obiectul-urmăririi'),
    cache: {},

    init: function() {
      this.$
        .on('click', 'button.închide', this.închide)
        .on('click', 'button.salvează', this.salveazăSauCrează)
        .on('închidere', this.resetează)
        .on('populat iniţializat', this.calculează)
        .on('populat iniţializat', this.eliminăAmendaDupăCaz)
        .on('populat', this.actualizeazăDataUltimeiModificări)
        .on('salvat', this.actualizeazăDataUltimeiModificări);

      this.baraDeInstrumente.init();

      $(window).on('hashchange', function() {
        if (/^#formular/.test(location.hash)) FormularProcedură.deschide();
        else if (FormularProcedură.$.is(':visible')) FormularProcedură.închide();
      });

      this.$obiectulUrmăririi.on('adăugat-cîmp-personalizabil', function(e, $li) {
        if (FormularProcedură.seIniţializează) return;

        $li.find('input.autofocus').focus();
      });

      AcţiuniProcedurale.init();
      this.secţiuni.init();
    },

    tip: function() {
      return FormularProcedură.seCreazăProcedurăNouă() ?
        HashController.date() :
        FormularProcedură.$.find('#tip').text();
    },

    baraDeInstrumente: {
      init: function() {
        FormularProcedură.$.find('.bara-de-instrumente')
          .on('focus', 'button', this.afişează)
          .on('blur', 'button', this.semiascunde)
          .on('click', '.spre-secţiuni', FormularProcedură.focusează);

        FormularProcedură.$.on('salvat', this.anunţăSalvarea);
        FormularProcedură.$.on('salvat-deja', this.anunţăSalvatDeja);
      },

      afişează: function() {
        $(this).parent().addClass('focusat');
      },

      semiascunde: function() {
        $(this).parent().removeClass('focusat');
      },

      anunţăSalvarea: function() {
        FormularProcedură.baraDeInstrumente.afişeazăMesaj('salvat');
      },

      anunţăSalvatDeja: function() {
        FormularProcedură.baraDeInstrumente.afişeazăMesaj('salvat-deja');
      },

      afişeazăMesaj: function(mesaj) {
        var $mesaj = FormularProcedură.$.find('.bara-de-instrumente .salvează~.mesaj.' + mesaj);

        $mesaj.addClass('afişat');

        setTimeout(function() {
          $mesaj.removeClass('afişat');
        }, 1000);
      }
    },

    eliminăAmendaDupăCaz: function() {
      if (FormularProcedură.deOrdingGeneral()) {
        FormularProcedură.$obiectulUrmăririi.find('li:has(#amendă)').remove();
      }
    },

    actualizeazăDataUltimeiModificări: function(e, procedură) {
      FormularProcedură.$.find('#data-ultimei-modificări span')
        .text(procedură['data-ultimei-modificări'])
        .parent().show();
    },

    calculează: function() {
      FormularProcedură.deschis = true;
      TotalCheltuieli.calculează();
      Onorariu.calculează();
      FormularProcedură.focusează();
    },

    focusează: function() {
      $('html,body').animate({scrollTop: 0}, 500, function() {
        FormularProcedură.$titlu
          .attr('tabindex', 1)
          .focus()
          .removeAttr('tabindex');
      });
    },

    deOrdingGeneral: function() {
      return (/^(\d+)?$/).test(HashController.date());
    },

    pensieDeÎntreţinere: function() {
      return HashController.date().substr(0, 1) === 'P';
    },

    seCreazăProcedurăNouă: function() {
      return HashController.pagină() === '#formular' && /^[SP]?$/.test(HashController.date());
    },

    seDeschideProcedurăSalvată: function() {
      return HashController.pagină() === '#formular' && /^\d+$/.test(HashController.date());
    },

    seteazăTitlu: function(procedură) {
      var descriere, prefix, tip, afişeazăTireu, număr;

      if (FormularProcedură.seCreazăProcedurăNouă()) {
        descriere = $('#crează-procedură').find('li[data-href="' + location.hash + '"]').text();
        prefix = '';
        tip = '';
        afişeazăTireu = false;
        număr = '';
      } else {
        descriere = $('#crează-procedură').find('li[data-href="#formular?' + procedură['tip'] + '"]').text();
        prefix = Utilizator.login;
        tip = procedură['tip'];
        afişeazăTireu = true;
        număr = HashController.date();
      }

      FormularProcedură.$.find('h1')
        .find('#descriere').text(descriere).end()
        .find('#prefix').text(prefix).end()
        .find('#tip').text(tip).end()
        .find('#număr').text(număr).end()
        .find('#tireu').toggle(afişeazăTireu).end();
    },

    secţiuni: {
      init: function() {
        for (var secţiune in this) {
          if (typeof this[secţiune].init === 'function') this[secţiune].init();
        }
      },

      'generică': {
        colectează: function(selector) {
          var $secţiune = $(selector),
              date = {};

          var cîmpuri = [
            'ul:not(.subsecţiune) label+:input:not(.calculat):last-child',
            'ul:not(.subsecţiune) label+select.foarte.lat',
            'ul:not(.subsecţiune) label+.dată',
            'ul:not(.subsecţiune) label+input#salariu-recuperat',
            'ul:not(.subsecţiune) label+input#valoarea-acţiunii',
            'ul:not(.subsecţiune) .etichetă+:input'
          ].join(',');

          $secţiune.find(cîmpuri).each(function() {
            /*jshint maxcomplexity:5 */
            var $input = $(this),
                $label = $input.prev();

            if ($input.is('.dată.amînare')) return; // avem subrutină specială pentru asta

            if ($label.is('.etichetă')) {
              if (!date.subformular) date.subformular = {};

              date.subformular[$label.val()] = $input.is('.sumă') ? $input.suma() : $input.val();
            } else {
              date[$input.attr('id')] = $input.val1();
            }
          });

          return date;
        },

        populează: function(selector, secţiune) {
          var $secţiune = $(selector), id;

          for (id in secţiune) {
            $secţiune.find('#' + id)
              .val1(secţiune[id])
              .trigger('change');
          }
        },

        resetează: function(selector) {
          return $(selector).find(':input').val('');
        }
      },

      'persoane-terţe': {
        colectează: function() {
          return FormularProcedură.$.find('.persoană-terţă').map(function() {
            return FormularProcedură.secţiuni['generică'].colectează(this);
          }).get();
        },

        populează: function(persoaneTerţe) {
          if (persoaneTerţe.length === 0) return;

          var $butonDeAdăugare = FormularProcedură.$.find('#creditor+button.adaugă'),
              $secţiune;

          $.each(persoaneTerţe, function() {
            $butonDeAdăugare.click();

            $secţiune = FormularProcedură.$.find('.persoană-terţă:last');
            FormularProcedură.secţiuni['generică'].populează($secţiune, this);
          });
        },

        resetează: function() {
          FormularProcedură.$.find('.persoană-terţă').remove();
        }
      },

      'debitori': {
        colectează: function() {
          return FormularProcedură.$.find('.debitor').map(function() {
            return FormularProcedură.secţiuni['generică'].colectează(this);
          }).get();
        },

        populează: function(debitori) {
          var $secţiune,
              prima = true,
              $butonDeAdăugare = FormularProcedură.$.find('.debitor+button.adaugă');

          $.each(debitori, function() {
            if (prima) {
              prima = false;
            } else {
              $butonDeAdăugare.click();
            }

            $secţiune = FormularProcedură.$.find('.debitor:last');
            FormularProcedură.secţiuni['generică'].populează($secţiune, this);
          });
        },

        resetează: function() {
          FormularProcedură.$.find('.debitor')
            .not(':first').remove().end()
            .find('input,textarea').val('').end()
            .first().removeClass('dispensabilă').end();
        }
      },

      'obiectul-urmăririi': {
        colectează: function() {
          /*jshint maxcomplexity:8*/
          var $secţiune = FormularProcedură.$obiectulUrmăririi,
              $obiectulUrmăririi = $secţiune.find('#obiect'),
              obiectulUrmăririi;

          if (FormularProcedură.pensieDeÎntreţinere()) {
            obiectulUrmăririi = {'încasări': FormularProcedură.secţiuni['pensie-de-întreţinere'].colectează()};
          } else {
            obiectulUrmăririi = FormularProcedură.secţiuni['generică'].colectează($secţiune);
          }

          if ($obiectulUrmăririi.val() === 'aplicarea măsurilor de asigurare a acţiunii') {
            FormularProcedură.secţiuni['măsuri-de-asigurare'].colectează(obiectulUrmăririi);
          } else if ($obiectulUrmăririi.val() === 'efectuarea de către debitor a unor acţiuni obligatorii, legate de remiterea unor bunuri mobile') {
            obiectulUrmăririi['bunuri-ridicate'] = FormularProcedură.secţiuni['sume-personalizate'].colectează('.bunuri-ridicate');
          } else if ($obiectulUrmăririi.val() === 'efectuarea de către debitor a unor acţiuni obligatorii, legate de remiterea unor bunuri imobile') {
            obiectulUrmăririi['bunuri-transmise'] = FormularProcedură.secţiuni['sume-personalizate'].colectează('.bunuri-transmise');
          } else if ($obiectulUrmăririi.val() === 'nimicirea bunurilor') {
            obiectulUrmăririi['bunuri-nimicite'] = FormularProcedură.secţiuni['sume-personalizate'].colectează('.bunuri-nimicite');
          } else if ($obiectulUrmăririi.val() === 'confiscarea bunurilor') {
            obiectulUrmăririi['bunuri-confiscate'] = FormularProcedură.secţiuni['sume-personalizate'].colectează('.bunuri-confiscate');
          } else {
            obiectulUrmăririi['sume'] = FormularProcedură.secţiuni['sume'].colectează();
          }

          if (obiectulUrmăririi.caracter === 'pecuniar') {
            obiectulUrmăririi['întîrzieri'] = FormularProcedură.secţiuni['întîrzieri'].colectează();
            obiectulUrmăririi['sechestrări-bunuri'] = FormularProcedură.secţiuni['sechestrări-bunuri'].colectează();
          } else {
            obiectulUrmăririi['amînări'] = FormularProcedură.secţiuni['amînări'].colectează();
            obiectulUrmăririi['încheiere'] = $secţiune.find('.încheieri a').data('pagina'); // TODO?
          }

          return obiectulUrmăririi;
        },

        populează: function(obiectulUrmăririi) {
          /*jshint maxcomplexity:8*/
          var $secţiune = FormularProcedură.$obiectulUrmăririi;

          FormularProcedură.secţiuni['generică'].populează($secţiune, obiectulUrmăririi);
          FormularProcedură.secţiuni['pensie-de-întreţinere'].populează(obiectulUrmăririi['încasări']);

          if ($secţiune.find('#obiect').val() === 'aplicarea măsurilor de asigurare a acţiunii') {
            FormularProcedură.secţiuni['măsuri-de-asigurare'].populează(obiectulUrmăririi);
          } else if ($secţiune.find('#obiect').val() === 'efectuarea de către debitor a unor acţiuni obligatorii, legate de remiterea unor bunuri mobile') {
            FormularProcedură.secţiuni['sume-personalizate'].populează('bunuri-ridicate', obiectulUrmăririi);
          } else if ($secţiune.find('#obiect').val() === 'efectuarea de către debitor a unor acţiuni obligatorii, legate de remiterea unor bunuri imobile') {
            FormularProcedură.secţiuni['sume-personalizate'].populează('bunuri-transmise', obiectulUrmăririi);
          } else if ($secţiune.find('#obiect').val() === 'interzicerea altor persoane de a săvîrşi anumite acţiuni în privinţa obiectului în litigiu,' +
              ' inclusiv transmiterea de bunuri către debitor sau îndeplinirea unor alte obligaţii faţă de el') {
            FormularProcedură.secţiuni['sume-personalizate'].populează('bunuri-în-litigiu', obiectulUrmăririi);
          } else if ($secţiune.find('#obiect').val() === 'confiscarea bunurilor') {
            FormularProcedură.secţiuni['sume-personalizate'].populează('bunuri-confiscate', obiectulUrmăririi);
          } else if ($secţiune.find('#obiect').val() === 'nimicirea bunurilor') {
            FormularProcedură.secţiuni['sume-personalizate'].populează('bunuri-nimicite', obiectulUrmăririi);
          } else {
            FormularProcedură.secţiuni['sume'].populează(obiectulUrmăririi['sume']);
          }

          FormularProcedură.secţiuni['întîrzieri'].populează(obiectulUrmăririi['întîrzieri']);
          FormularProcedură.secţiuni['sechestrări-bunuri'].populează(obiectulUrmăririi['sechestrări-bunuri']);
          FormularProcedură.secţiuni['amînări'].populează(obiectulUrmăririi['amînări']);

          if (obiectulUrmăririi['încheiere']) {
            $secţiune.find('.buton[data-formular]')
              .attr('data-pagina', obiectulUrmăririi['încheiere'])
              .addClass('salvat');
          }
        },

        resetează: function() {
        }
      },

      'pensie-de-întreţinere': {
        $: null,

        init: function() {
          this.$ = FormularProcedură.$obiectulUrmăririi;
        },

        colectează: function() {
          return this.$.find('.subsecţiune.încasare').map(function() {
            var date = {};

            $(this).find(':input:not([readonly])').each(function() {
              date[this.id] = $.trim($(this).val());
            });

            return date;
          }).get();
        },

        populează: function(încasări) {
          /*jshint maxcomplexity:5*/
          if (!încasări) return;

          var $încasare, i, prima = true,
              $butonDeAdăugare = this.$.find('#adaugă-subsecţiune .încasare');

          for (i = 0; i < încasări.length; i++) {
            if (prima) {
              prima = false;
            } else {
              $butonDeAdăugare.click();
            }

            $încasare = this.$.find('.subsecţiune.încasare:last');
            FormularProcedură.secţiuni['generică'].populează($încasare, încasări[i]);
            $încasare.find('#venitul').trigger('input');
          }
        }
      },

      'măsuri-de-asigurare': {
        $: null,

        init: function() {
          this.$ = FormularProcedură.$obiectulUrmăririi;
        },

        colectează: function(obiectulUrmăririi) {
          var $secţiune = this.$;

          if ($secţiune.find('.personalizat.valoarea-acţiunii').există()) {
            obiectulUrmăririi['valoarea-acţiunii'] = FormularProcedură.secţiuni['valoarea-acţiunii'].colectează();
          } else {
            if ($secţiune.find('#măsura-de-asigurare').val() === 'interzicerea altor persoane de a săvîrşi anumite acţiuni în privinţa obiectului în litigiu,' +
                ' inclusiv transmiterea de bunuri către debitor sau îndeplinirea unor alte obligaţii faţă de el') {
              obiectulUrmăririi['bunuri-în-litigiu'] = FormularProcedură.secţiuni['sume-personalizate'].colectează('.bunuri-în-litigiu');
            } else {
              obiectulUrmăririi['bunuri-sechestrate'] = FormularProcedură.secţiuni['sume-personalizate'].colectează('.bunuri-sechestrate');
              obiectulUrmăririi['sume-sechestrate'] = FormularProcedură.secţiuni['sume-personalizate'].colectează('.sume-sechestrate');
            }
          }
        },

        populează: function(obiectulUrmăririi) {
          if (obiectulUrmăririi['valoarea-acţiunii']) {
            FormularProcedură.secţiuni['valoarea-acţiunii'].populează(obiectulUrmăririi['valoarea-acţiunii']);
          } else {
            if (obiectulUrmăririi['măsura-de-asigurare'] === 'interzicerea altor persoane de a săvîrşi anumite acţiuni în privinţa obiectului în litigiu,' +
                ' inclusiv transmiterea de bunuri către debitor sau îndeplinirea unor alte obligaţii faţă de el') {
              FormularProcedură.secţiuni['sume-personalizate'].populează('bunuri-în-litigiu', obiectulUrmăririi);
            } else {
              FormularProcedură.secţiuni['sume-personalizate'].populează('bunuri-sechestrate', obiectulUrmăririi);
              FormularProcedură.secţiuni['sume-personalizate'].populează('sume-sechestrate', obiectulUrmăririi);
            }
          }
        }
      },

      'amînări': {
        $: null,

        init: function() {
          this.$ = FormularProcedură.$obiectulUrmăririi;
        },

        colectează: function() {
          return this.$.find('.dată.amînare').map(function() {
            var $input = $(this),
                $label = $input.prev(),
                amînăre = {};

            amînăre[$label.val()] = $input.val();

            return amînăre;
          }).get();
        },

        populează: function(amînări) {
          /*jshint maxcomplexity:5*/
          if (!amînări || amînări.length === 0) return;

          var $butonDeAdăugare = this.$.find('button.adaugă-cîmp-personalizat.amînare');

          if (!$butonDeAdăugare.există()) return;

          var i = 0, amînare, etichetă, $amînare;

          for (; i < amînări.length; i++) {
            $butonDeAdăugare.click();
            amînare = amînări[i];

            for (etichetă in amînare) {
              // hack! :)
              // aici întotdeauna va fi doar un item
              $amînare = $butonDeAdăugare.parent().prev();
              $amînare.find('.etichetă').val(etichetă);
              $amînare.find('.dată').val(amînare[etichetă]);
            }
          }
        },

        resetează: function() {
          this.$.find('.dată.amînare').remove();
        }
      },

      'sume': {
        $: null,

        init: function() {
          this.$ = FormularProcedură.$obiectulUrmăririi;
        },

        colectează: function() {
          var sume = {};

          this.$.find('ul:not(.subsecţiune) .sumă+.valuta').each(function() {
            var cîmp = $(this).prev(),
                etichetă = cîmp.prev(),
                denumire = etichetă[etichetă.is('label') ? 'text' : 'val']();

            sume[denumire] = {
              suma: cîmp.val(),
              valuta: cîmp.next('.valuta').val()
            };
          });

          return sume;
        },

        populează: function(sume) {
          if (!sume) return;

          var $secţiune = this.$.find('ul:first'),
              $butonDeAdăugare = $secţiune.find('.adaugă-cîmp-personalizat.sumă'),
              cîmp, $cîmp;

          for (cîmp in sume) {
            $cîmp = $secţiune.find('label:contains(' + cîmp + ')+.sumă');

            if (!$cîmp.există()) {
              $butonDeAdăugare.click();
              $cîmp = $secţiune.find('.etichetă+.sumă').last();
              $cîmp.prev().val(cîmp).trigger('input');
            }

            $cîmp.val(sume[cîmp].suma);
            $cîmp.next('.valuta').val(sume[cîmp].valuta);
          }
        }
      },

      'sume-personalizate': {
        $: null,

        init: function() {
          this.$ = FormularProcedură.$obiectulUrmăririi;
        },

        colectează: function(selector) {
          return this.$.find('.personalizat' + selector).map(function() {
            var $item = $(this);

            return {
              descrierea: $item.find('.etichetă').val(),
              suma: $item.find('.sumă').val(),
              valuta: $item.find('.valuta').val()
            };
          }).get();
        },

        populează: function(colecţie, obiectulUrmăririi) {
          var clasăButonDeAdăugare = 'pentru-' + colecţie,
              clasăCîmpPersonalizat = colecţie,
              $secţiune = this.$,
              sume = obiectulUrmăririi[colecţie],
              $butonDeAdăugare = $secţiune.find('button.adaugă-cîmp-personalizat.' + clasăButonDeAdăugare),
              $cîmpul, sumă;

          if (!sume) return;

          for (var i = 0; i < sume.length; i++) {
            sumă = sume[i];

            $butonDeAdăugare.click();
            $cîmpul = $butonDeAdăugare.parent().prev('.' + clasăCîmpPersonalizat);
            $cîmpul.find('.etichetă').val(sumă['descrierea']);
            $cîmpul.find('.sumă').val(sumă['suma']);
            $cîmpul.find('.valuta').val(sumă['valuta']);
          }
        },

        resetează: function() {
        }
      },

      'întîrzieri': {
        $: null,

        init: function() {
          this.$ = FormularProcedură.$obiectulUrmăririi;
        },

        colectează: function() {
          return this.$.find('.subsecţiune.întîrziere').map(function() {
            var $întîrziere = $(this);

            return {
              începutPerioadă: $întîrziere.find('.început.perioadă').val(),
              sfîrşitPerioadă: $întîrziere.find('.sfîrşit.perioadă').val(),
              rata: $întîrziere.find(':radio:checked').val(),
              suma: $întîrziere.find('.sumă.întîrziată').val(),
              dobînda: $întîrziere.find('.sumă.dobîndă').val(),
              încheieri: FormularProcedură.secţiuni.încheieri.colectează($întîrziere.find('.încheieri a'))
            };
          }).get();
        },

        populează: function(întîrzieri) {
          if (!întîrzieri) return;

          var întîrziere, $întîrziere,
              $secţiune = this.$,
              $butonDeAdăugare = $secţiune.find('#adaugă-subsecţiune .întîrziere');

          for (var i = 0; i < întîrzieri.length; i++) {
            întîrziere = întîrzieri[i];

            $butonDeAdăugare.click();
            $întîrziere = $secţiune.find('.subsecţiune.întîrziere:last');
            $întîrziere.find('.început.perioadă').val(întîrziere['începutPerioadă']);
            $întîrziere.find('.sfîrşit.perioadă').val(întîrziere['sfîrşitPerioadă']);
            $întîrziere.find(':radio[value="' + întîrziere['rata'] + '"]').prop('checked', true);
            $întîrziere.find('.sumă.întîrziată').val(întîrziere['suma']);
            $întîrziere.find('.sumă.dobîndă').val(întîrziere['dobînda']);

            FormularProcedură.secţiuni['încheieri'].populează(întîrziere['încheieri'], $întîrziere.find('.încheieri a'));
          }
        },

        resetează: function() {
          this.$.find('.subsecţiune.întîrziere').remove();
        }
      },

      'sechestrări-bunuri': {
        $: null,

        init: function() {
          this.$ = FormularProcedură.$obiectulUrmăririi;
        },

        colectează: function() {
          return this.$.find('.subsecţiune.sechestrare-bunuri').map(function() {
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
              }).get(),
              încheieri: FormularProcedură.secţiuni['încheieri'].colectează($sechestrare.find('.încheieri a'))
            };
          }).get();
        },

        populează: function(sechestrări) {
          /*jshint maxcomplexity:6*/
          if (!sechestrări) return;

          var sechestrare, $sechestrare, bun, $bun, primul = true,
              $secţiune = this.$,
              $butonDeAdăugare = $secţiune.find('#adaugă-subsecţiune .sechestrare-bunuri');

          for (var i = 0; i < sechestrări.length; i++) {
            $butonDeAdăugare.click();

            sechestrare = sechestrări[i];
            $sechestrare = $secţiune.find('.subsecţiune.sechestrare-bunuri:last'),

            $sechestrare.find('.dată').val(sechestrare.data);
            primul = true;

            for (var j = 0; j < sechestrare.bunuri.length; j++) {
              bun = sechestrare.bunuri[j];

              if (primul) {
                primul = false;
              } else {
                $sechestrare.find('.adaugă-cîmp-personalizat').click();
              }

              $bun = $sechestrare.find('.personalizat:last');
              $bun.find('.etichetă').val(bun.descriere);
              $bun.find('.sumă').val(bun.sumă);
              $bun.find('.valuta').val(bun.valuta).trigger('input');
            }
          }
        },

        resetează: function() {
          this.$.find('.subsecţiune.sechestrare-bunuri').remove();

        }
      },

      'valoarea-acţiunii': {
        $: null,

        init: function() {
          this.$ = FormularProcedură.$obiectulUrmăririi;
        },

        colectează: function() {
          var $valoareaAcţiunii = this.$.find('.personalizat.valoarea-acţiunii');

          return {
            suma: $valoareaAcţiunii.find('.sumă').val(),
            valuta: $valoareaAcţiunii.find('.valuta').val()
          };
        },

        populează: function(valoareaAcţiunii) {
          var $butonDeAdăugare = this.$.find('button.adaugă-cîmp-personalizat.valoarea-acţiunii'),
              $cîmpul;

          $butonDeAdăugare.click();
          $cîmpul = $butonDeAdăugare.parent().prev('.valoarea-acţiunii');
          $cîmpul.find('.sumă').val(valoareaAcţiunii['suma']);
          $cîmpul.find('.valuta').val(valoareaAcţiunii['valuta']);
        },

        resetează: function() {
          this.$.find('.personalizat.valoarea-acţiunii').remove();
        }
      },

      'încheieri': {
        $: $('#încheieri a'),

        colectează: function($secţiune) {
          var încheieri = {};

          $secţiune = $secţiune || this.$;

          $secţiune.each(function() {
            var formular = this.getAttribute('formular'),
                încheiere = this.getAttribute('href');

            if (formular === încheiere) return true;

            încheieri[formular] = încheiere;
          });

          return încheieri;
        },

        populează: function(încheieri, $secţiune) {
          $secţiune = $secţiune || this.$;

          return $secţiune.each(function() {
            if (!încheieri) return;

            var $încheiere = $(this),
                formular = $încheiere.attr('formular');

            if (!încheieri[formular]) return;

            $încheiere.attr('href', încheieri[formular]);

            if ($încheiere.attr('href') !== formular) {
              $încheiere.addClass('salvat');
            }
          });
        },

        resetează: function() {
          this.$.each(function() {
            $(this).removeClass('salvat');
          });
        }
      },

      'cheltuieli': {
        item: {
          'generic': {
            colectează: function($item) {
              var $achitare = $item.find('.achitare'),
                  date = {},
                  subformular = {};

              date = {
                'achitat': $achitare.find(':checkbox').is(':checked'),
                'data-achitării': $achitare.find('.dată').val()
              };

              $item.find('label+:input').each(function() {
                subformular[this.id] = $(this).val();
              });

              $item.find(':input+label').each(function() { // bife
                if ($(this).is('.achitare label')) return; // ignorăm bifa “achitat”

                var $cîmp = $(this).prev();

                subformular[$cîmp.attr('id')] = $cîmp.is(':checked');
              });

              if (!$.isEmptyObject(subformular)) date.subformular = subformular;

              return date;
            },

            populează: function($item, date) {
              var $achitare = $item.find('.achitare');

              $achitare.find(':checkbox').attr('checked', date['achitat']);
              $achitare.find('.dată').val(date['data-achitării']);

              if (!date.subformular) return;

              for (var id in date.subformular) {
                if (typeof date.subformular[id] === 'boolean') {
                  $item.find('#' + id).attr('checked', date.subformular[id]);
                } else {
                  $item.find('#' + id).val(date.subformular[id]);
                }
              }
            }
          },

          'listă': {
            colectează: function($item) {
              var date = FormularProcedură.secţiuni.cheltuieli.item.generic.colectează($item),
                  subformular = [],
                  item, $cîmp;

              $item.find('.personalizat').each(function() {
                item = {};

                $(this).find('[nume-cîmp]').each(function() {
                  $cîmp = $(this);
                  item[$cîmp.attr('nume-cîmp')] = $cîmp.val1();
                });

                subformular.push(item);
              });

              date.subformular = subformular;

              return date;
            },

            populează: function($item, date) {
              FormularProcedură.secţiuni.cheltuieli.item.generic.populează($item, date);

              var $rînduri = $item.find('.personalizat'),
                  $rînd;

              date.subformular.forEach(function(rînd, i) {
                for (var nume in rînd) {
                  if (i === 0) $rînd = $rînduri.eq(0);
                  else $rînd = $rînd.clone().insertAfter($rînd);

                  $rînd.find('[nume-cîmp="' + nume + '"]').val(rînd[nume]);
                }
              });
            }
          },

          'documente-adresabile': {
            colectează: function($item) {
              var date = FormularProcedură.secţiuni.cheltuieli.item.generic.colectează($item),
                  subformular = [],
                  $destinatariAdăugaţi;

              $item.find('.etichetă').each(function() {
                $destinatariAdăugaţi = $(this).siblings('.destinatari-adăugaţi').children();

                subformular.push({
                  'document': $(this).val(),
                  'destinatari': $destinatariAdăugaţi.filter(':not(.persoană.terţă)')
                    .map(function() { return $(this).text(); })
                    .get(),
                  'destinatari-persoane-terţe': $destinatariAdăugaţi.filter('.persoană.terţă')
                    .map(function() { return $(this).find('input').val(); })
                    .get()
                });
              });

              date.subformular = subformular;

              return date;
            },

            populează: function($item, date) {
              FormularProcedură.secţiuni.cheltuieli.item.generic.populează($item, date);

              var $destinatariAdăugaţi, $rînd;

              if (!date.subformular) return;

              date.subformular.forEach(function(document, i) {
                if (i === 0) {
                  $rînd = $item.find('.personalizat').eq(0);
                } else {
                  $rînd = $rînd.clone().insertAfter($rînd);
                }

                $rînd.find('.etichetă').val(document.document);
                $destinatariAdăugaţi = $rînd.find('.destinatari-adăugaţi').empty();

                document['destinatari'].forEach(function(destinatar) {
                  $destinatariAdăugaţi.append($('<li>', {html: destinatar, 'class': 'eliminabil'}));
                });

                document['destinatari-persoane-terţe'].forEach(function(destinatar) {
                  $('<li>', {text: 'persoană terţă', 'class': 'eliminabil persoană terţă'}).
                    append($('<input>', {value: destinatar})).
                    appendTo($destinatariAdăugaţi);
                });
              });
            }
          }
        },

        colectează: function() {
          var $secţiune = Cheltuieli.$,
              itemi = [];

          Cheltuieli.$adăugate.children().each(function() {
            itemi.push({
              id: this.id,
              date: FormularProcedură.secţiuni['cheltuieli'].
                item[this.getAttribute('gen-date') || 'generic'].
                colectează($(this))
            });
          });

          var cheltuieli = {
            'onorariu': $secţiune.find('#onorariu').val1(),
            'părţile-au-ajuns-la-conciliere': $secţiune.find('#părţile-au-ajuns-la-conciliere').val1(),
            'itemi': itemi
          };

          return cheltuieli;
        },

        populează: function(cheltuieli) {
          var $secţiune = Cheltuieli.$adăugate,
              $item, selector;

          $secţiune.find('#onorariu').val1(cheltuieli['onorariu']);
          $secţiune.find('#părţile-au-ajuns-la-conciliere').val(cheltuieli['părţile-au-ajuns-la-conciliere']);

          cheltuieli.itemi.forEach(function(item) {
            selector = '#' + item.id;
            Cheltuieli.categorii.$.find(selector).click();
            $item = $secţiune.find(selector);

            FormularProcedură.secţiuni['cheltuieli'].item[$item.attr('gen-date') || 'generic'].populează($item, item.date);
          });
        },

        resetează: function() {
          Cheltuieli.$adăugate.children().remove();
          Cheltuieli.categorii.$.find('.dezactivat').removeClass('dezactivat');
          Cheltuieli.$
            .find(':input:not([type="hidden"])').val('').end()
            .find('#părţile-au-ajuns-la-conciliere').prop('checked', false);
        }
      }
    },

    colectează: function() {
      return {
        'data-intentării': this.$.find('#data-intentării').val(),
        'document-executoriu': this.secţiuni['generică'].colectează('#document-executoriu'),
        'obiectul-urmăririi': this.secţiuni['obiectul-urmăririi'].colectează(),
        'cheltuieli': this.secţiuni['cheltuieli'].colectează(),
        'creditor': this.secţiuni['generică'].colectează('#creditor'),
        'persoane-terţe': this.secţiuni['persoane-terţe'].colectează(),
        'debitori': this.secţiuni['debitori'].colectează(),
        'tip': this.tip(),
        'data-ultimei-modificări': moment().format('DD.MM.YYYY HH:mm'),
        'încheieri': this.secţiuni['încheieri'].colectează()
      };
    },

    număr: function() {
      var re = /^#formular\?(\d+)/;

      if (re.test(location.hash)) {
        return location.hash.match(re)[1];
      }
    },

    salveazăSauCrează: function() {
      if (FormularProcedură.seCreazăProcedurăNouă()) {
        FormularProcedură.crează();
      } else {
        FormularProcedură.salvează();
      }
    },

    salvează: function() {
      if (FormularProcedură.seTrimite) return;

      var număr = FormularProcedură.număr(),
          procedură = FormularProcedură.colectează(),
          cale = '/date/' + Utilizator.login + '/proceduri/' + număr + '/date.json';

      if (!FormularProcedură.suntSchimbări(procedură, număr)) {
        FormularProcedură.$.trigger('salvat-deja', [procedură]);
        return;
      }

      FormularProcedură.seTrimite = true;

      $.put(cale, JSON.stringify(procedură))
        .done(function(_, status) {
          FormularProcedură.seTrimite = false;

          if (status === 'notmodified') {
            FormularProcedură.$.trigger('salvat-deja', [procedură]);
            return;
          }

          FormularProcedură.$.trigger('salvat', [procedură, număr]);
          FormularProcedură.puneÎnCache(procedură, număr);
          Căutare.încarcăIndexFărăCache();
        })
        .fail(function() {
          FormularProcedură.seTrimite = false;
        });
    },

    crează: function() {
      if (FormularProcedură.seTrimite) return;

      var procedură = FormularProcedură.colectează(),
          cale = '/date/' + Utilizator.login + '/proceduri/';

      FormularProcedură.seTrimite = true;

      $.put(cale, JSON.stringify(procedură))
        .done(function(cale) {
          FormularProcedură.seTrimite = false;

          var număr = cale.match(/(\d+)\/date.json$/)[1],
              adresaNouă = '#formular?' + număr;

          history.replaceState(null, null, adresaNouă);

          FormularProcedură.seteazăTitlu(procedură);
          FormularProcedură.$.trigger('salvat', [procedură, număr]);
          FormularProcedură.puneÎnCache(procedură, număr);
          Căutare.încarcăIndexFărăCache();
        })
        .fail(function() {
          FormularProcedură.seTrimite = false;
        });
    },

    puneÎnCache: function(procedură, număr) {
      var copieProcedură = $.extend(true, {}, procedură);

      delete copieProcedură['data-ultimei-modificări'];
      FormularProcedură.cache[număr] = JSON.stringify(copieProcedură);
    },

    suntSchimbări: function(procedură, număr) {
      var copieProcedură = $.extend(true, {}, procedură);

      delete copieProcedură['data-ultimei-modificări'];
      return FormularProcedură.cache[număr] !== JSON.stringify(copieProcedură);
    },

    încarcă: function() {
      var număr = HashController.date();

      $.getJSON('/date/' + Utilizator.login + '/proceduri/' + număr + '/date.json')
        .done(function(procedură) {
          ProceduriRecente.notează(număr);
          FormularProcedură.populează(procedură);
          FormularProcedură.seteazăTitlu(procedură);
          FormularProcedură.puneÎnCache(procedură, număr);
        })
        .fail(FormularProcedură.închide);

    },

    populează: function(procedură) {
      this.seIniţializează = true;

      this.$.find('#data-intentării').val(procedură['data-intentării']);
      this.secţiuni['generică'].populează('#document-executoriu', procedură['document-executoriu']);
      this.secţiuni['obiectul-urmăririi'].populează(procedură['obiectul-urmăririi']);
      this.secţiuni['cheltuieli'].populează(procedură.cheltuieli);
      this.secţiuni['generică'].populează('#creditor', procedură['creditor']);
      this.secţiuni['persoane-terţe'].populează(procedură['persoane-terţe']);
      this.secţiuni['debitori'].populează(procedură['debitori']);
      this.secţiuni['încheieri'].populează(procedură['încheieri']);

      this.seIniţializează = false;
      this.$.trigger('populat', [procedură]);
    },

    resetează: function() {
      FormularProcedură.$
        .find('#data-intentării').val('').end()
        // pentru cazul cînd unele secţiuni sunt închise
        .find('fieldset .conţinut').removeAttr('style').end();

      FormularProcedură.secţiuni['generică'].resetează('#creditor');
      FormularProcedură.secţiuni['generică'].resetează('#document-executoriu');
      FormularProcedură.secţiuni['debitori'].resetează();
      FormularProcedură.secţiuni['persoane-terţe'].resetează();
      FormularProcedură.secţiuni['încheieri'].resetează();
      FormularProcedură.secţiuni['sechestrări-bunuri'].resetează();
      FormularProcedură.secţiuni['întîrzieri'].resetează();
      FormularProcedură.secţiuni['cheltuieli'].resetează();
    },

    închide: function(xhr, status) {
      FormularProcedură.$.trigger('înainte-de-închidere');

      if (status) window.console.error('Eroare la încărcare:', arguments);

      location.hash = '';

      FormularProcedură.focusează();
      FormularProcedură.$
        .find('.bara-de-instrumente').fadeOut().end()
        .animate({'top': $(window).height()}, function() {
          $(this).hide().trigger('închis');
        })
        .trigger('închidere');
    },

    deschide: function() {
      BaraDeSus.$.find('.dialog:visible').ascunde();

      FormularProcedură.$.trigger('înainte-de-deschidere');

      FormularProcedură.$
        .stop(true, true)
        .find('.bara-de-instrumente').fadeIn('slow').end()
        .css('top', $(window).height())
        .show()
        .animate({'top': '40px'}, 'slow');

      if (FormularProcedură.seDeschideProcedurăSalvată()) {
        FormularProcedură.încarcă();
      } else {
        FormularProcedură.resetează();
        FormularProcedură.iniţializează();
      }
    },

    iniţializează: function() {
      FormularProcedură.seIniţializează = true;

      FormularProcedură.$
        .find('#data-ultimei-modificări').hide().end()
        .find('#creditor #gen-persoană, .debitor #gen-persoană').trigger('change');

      FormularProcedură.seteazăTitlu({tip: HashController.date()});

      if (FormularProcedură.seCreazăProcedurăNouă()) {
        Cheltuieli.$.find('#taxaA1, #taxaA2').click();

        var caracterProcedură = FormularProcedură.$obiectulUrmăririi.find('#caracter'),
            genCreditor = FormularProcedură.$.find('#creditor #gen-persoană');

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
      FormularProcedură.seIniţializează = false;
      FormularProcedură.$.trigger('iniţializat');
    }
  },

  // --------------------------------------------------

  ProceduriRecente = {
    încărcat: false,
    lista: [],

    $: $('#proceduri-recente').find('.listă-proceduri'),

    init: function() {
    },

    url: function() {
      return '/date/' + Utilizator.login + '/proceduri/recente.json';
    },

    încarcă: function() {
      if (ProceduriRecente.încărcat || !Căutare.index) return;

      $.getJSON(ProceduriRecente.url(), ProceduriRecente.afişează);
    },

    încarcăFărăCache: function() {
      $.getJSON(ProceduriRecente.url() + '?' + (new Date()).getTime(), ProceduriRecente.afişează);
    },

    afişează: function(proceduri) {
      if (proceduri.length === 0 || !Căutare.index) {
        if (proceduri.length === 0) GhidÎnceput.$.show();

        return;
      }

      ProceduriRecente.lista = proceduri;
      ProceduriRecente.$.html(ListăProceduri.formatează(proceduri));
      Căutare.$.show();
      GhidÎnceput.$.hide();

      ProceduriRecente.încărcat = true;
      $(document).trigger('încărcat-proceduri-recente');
    },

    notează: function(număr) {
      if (ProceduriRecente.numărulUltimei() === număr) return;

      $.put(ProceduriRecente.url(), JSON.stringify(număr))
        .done(ProceduriRecente.afişează);
    },

    numărulUltimei: function() {
      return ProceduriRecente.lista[0];
    }
  },

  // --------------------------------------------------

  Căutare = {
    $: $('#căutare'),
    pauză: 200,

    init: function() {
      Căutare.$.find('input')
        .on('input', Căutare.găseşte)
        .bind('keydown', 'down', Căutare.rezultate.selectează)
        .bind('keydown', 'up', Căutare.rezultate.selectează)
        .bind('keydown', 'return', Căutare.rezultate.deschide)
        .bind('keyup', 'esc', function() { $(this).val('').trigger('input'); });

      Căutare.$
        .on('mouseenter', '.item', function() { $(this).addClass('selectat'); })
        .on('mouseleave', '.item', function() { $(this).removeClass('selectat'); });

      Căutare.adresăIndex = '/date/' + Utilizator.login + '/proceduri/index.json';
      Căutare.încarcăIndex();
    },

    rezultate: {
      $: $('#rezultate'),
      $găsite: $('#găsite'),
      $nimic: $('#nimic'),

      afişează: function(proceduri, text) {
        var rezultate = ListăProceduri.formatează(proceduri, text);

        if (rezultate) {
          Căutare.rezultate.$găsite.show();
          Căutare.rezultate.$nimic.hide();
          Căutare.rezultate.$.html(rezultate);
        } else {
          Căutare.rezultate.$nimic.fadeIn();
          Căutare.rezultate.$găsite.hide();
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

      deschide: function() {
        Căutare.rezultate.$.find('.selectat').first().click();
      }
    },

    găseşte: function() {
      if (Căutare.înAşteptare && !Căutare.seÎndeplineşte) {
        clearTimeout(Căutare.înAşteptare);
      }

      var text = $.reEscape($.trim(this.value));

      if (!text.length) {
        Căutare.anulează();
        return;
      }

      Căutare.înAşteptare = setTimeout(function() {
        /*jshint maxcomplexity:5*/
        Căutare.seÎndeplineşte = true;

        var rezultate = {
          laÎnceputDeRînd: [],
          laÎnceputDeCuvînt: [],
          oriunde: [],
          unificate: function() {
            var unice = [],
                toate = this.laÎnceputDeRînd
                  .concat(this.laÎnceputDeCuvînt)
                  .concat(this.oriunde),
                număr,
                i, j, l = toate.length;

            for (i = 0; i < l; i++) {
              for (j = 0; j < toate[i].length; j++) {
                număr = toate[i][j];
                if (unice.indexOf(număr) === -1) unice.push(număr);
              }
            }

            return unice;
          }
        };

        var laÎnceputDeRînd = new RegExp('^' + text, 'gi'),
            laÎnceputDeCuvînt = new RegExp('\\b' + text, 'gi'),
            oriunde = new RegExp(text, 'gi');

        var index = Căutare.index, item;

        for (item in index) {
          if (laÎnceputDeRînd.test(item)) rezultate.laÎnceputDeRînd.push(index[item]);
          else if (laÎnceputDeCuvînt.test(item)) rezultate.laÎnceputDeCuvînt.push(index[item]);
          else if (oriunde.test(item)) rezultate.oriunde.push(index[item]);
        }

        Căutare.anulează();
        Căutare.rezultate.afişează(rezultate.unificate(), text);
        Căutare.seÎndeplineşte = false;
      }, Căutare.pauză);
    },

    anulează: function() {
      Căutare.rezultate.$.html('');
      Căutare.rezultate.$nimic.hide();
      Căutare.rezultate.$găsite.hide();
      ProceduriRecente.$.parent().show();
    },

    încarcăIndexFărăCache: function() {
      ProceduriRecente.încarcăForţat = true;
      $.get(Căutare.adresăIndex + '?' + (new Date()).getTime(), Căutare.seteazăIndex);
    },

    încarcăIndex: function() {
      $.getJSON(Căutare.adresăIndex)
        .done(Căutare.seteazăIndex)
        .fail(GhidÎnceput.afişează);
    },

    seteazăIndex: function(data) {
      Căutare.index = data;

      if (ProceduriRecente.încarcăForţat) {
        ProceduriRecente.încarcăForţat = false;
        ProceduriRecente.încarcăFărăCache();
      } else {
        ProceduriRecente.încarcă();
      }

      $(document).trigger('actualizat-index');
    }
  },

  // --------------------------------------------------

  GhidÎnceput = {
    $: $('#ghid-început'),

    afişează: function(xhr, statusText, errorMessage) {
      if (errorMessage === 'Not Found') {
        Căutare.$.hide();
        GhidÎnceput.$.show();
      }
    }
  },

  // --------------------------------------------------

  ListăProceduri = {
    formatează: function(proceduri, text) {
      // ------------------------------------------
      function evidenţiază(conţinut) {
        /*jshint maxcomplexity:5*/
        if ($.isPlainObject(conţinut)) {
          var itemi = {};

          for (var item in conţinut) {
            if (item === 'data-hotărîrii') {
              itemi[item] = conţinut[item];
            } else {
              itemi[item] = evidenţiază(conţinut[item]);
            }
          }

          return itemi;
        } else if ($.isArray(conţinut)) {
          return $.map(conţinut, evidenţiază);
        } else {
          var reFragment = new RegExp('(' + text + ')', 'gi');

          return conţinut.replace(reFragment, '<b>$1</b>');
        }
      }

      // ------------------------------------------
      function persoană(p) {
        return '' +
          '<div class="nume">' + (p.denumire || p.nume || '') + '</div>' +
          '<div class="id">' + (p.idno || p.idnp || '') + '</div>';
      }

      // ==========================================

      var rezultate = '';

      for (var i = 0; i < proceduri.length; i++) {
        var număr = proceduri[i],
            procedură = Căutare.index[''][număr];

        // în development, cînd şterg procedurile de pe disc, şi ele rămîn
        // în lista celor recente, şi aici generează ceva de genul:
        //
        //   Uncaught TypeError: Cannot call method 'replace' of undefined
        //
        // în producţie n-ar trebui să se întîmple aşa ceva.
        if (!procedură) continue;

        procedură = evidenţiază(procedură);

        var creditor = persoană(procedură['creditor']),
            persoaneTerţe = $.map(procedură['persoane-terţe'], persoană).join(''),
            debitori = $.map(procedură['debitori'], persoană).join(''),
            href = '#formular?' + număr;

        număr = Utilizator.login + procedură['tip'] + '-' + număr;
        rezultate +=
          '<li class="item" data-href="' + href + '">' +
            '<div class="număr">' +
              '<span>' + evidenţiază(număr) + '</span>' +
              '<div class="data-hotărîrii">' + procedură['data-hotărîrii'] + '</div>' +
            '</div>' +
            '<div class="persoane">' + creditor + persoaneTerţe + '</div>' +
            '<div class="persoane">' + debitori + '</div>' +
          '</li>\n\n';
      }

      return rezultate;
    }
  },

  // --------------------------------------------------

  BaraDeSus = {
    $: $('#bara-de-sus'),

    init: function() {
      this.$
        .on('click', '.dialog+button', this.afişeazăDialog)
        .on('ascundere', '.dialog', this.deselecteazăButonul)
        .on('afişare', '.dialog', this.selecteazăButonul)
        .on('afişare', '.dialog', this.focuseazăPrimulCîmp)
        .on('click', '.dialog button.închide', this.închideDialog)
        .on('keyup', '.dialog :input', function(e) {
          if (e.keyCode === 27) $(this).closest('.dialog').ascunde();
        });

      FormularProcedură.$
        .on('iniţializat populat', this.semiascundeInstrumente)
        .on('închidere', this.semiaratăInstrumente);

      Profil.init();
      CalculatorDobîndaÎntîrziere.init();
    },

    semiascundeInstrumente: function() {
      BaraDeSus.$.addClass('semiascuns');
    },

    semiaratăInstrumente: function() {
      BaraDeSus.$.removeClass('semiascuns');
    },

    afişeazăDialog: function() {
      var buton = $(this),
          dialog = buton.prev('.dialog');

      if (dialog.is(':visible')) {
        dialog.ascunde();
      } else {
        BaraDeSus.$.find('.dialog:visible').not(this).ascunde();
        dialog.afişează();
      }
    },

    focuseazăPrimulCîmp: function() {
      $(this).find('input:not([readonly]):first').focus();
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
  },

  // --------------------------------------------------

  Profil = {
    $: $('#profil'),

    cîmpNecompletat: '[lipseşte în profil]',

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
        Profil.$.trigger('încărcat');
      });
    },

    salvează: function() {
      function cîmp(selector) { return Profil.$.find(selector).val(); }

      Profil.date = {
        'nume': cîmp('#nume'),
        'adresă': cîmp('#adresă'),
        'telefon': cîmp('#telefon'),
        'cod-fiscal': cîmp('#cod-fiscal'),
        'instanţă-teritorială': cîmp('#instanţă-teritorială'),
        'email': cîmp('#email'),
        'cont-taxe-speze': cîmp('#cont-taxe-speze'),
        'bancă-taxe-speze': cîmp('#bancă-taxe-speze'),
        'cont-onorarii': cîmp('#cont-onorarii'),
        'bancă-onorarii': cîmp('#bancă-onorarii')
      };

      $.put(Profil.url, JSON.stringify(Profil.date))
        .done(function() {
          Profil.$
            .find('button.închide').click().end()
            .trigger('salvat');
        });
    },

    reseteazăDialog: function() {
      function cîmp(selector, valoare) { Profil.$.find(selector).val(valoare); }

      // TODO: uneori, la refresh, aici Profil.date e undefined
      cîmp('#nume', Profil.date['nume']);
      cîmp('#adresă', Profil.date['adresă']);
      cîmp('#telefon', Profil.date['telefon']);
      cîmp('#cod-fiscal', Profil.date['cod-fiscal']);
      cîmp('#instanţă-teritorială', Profil.date['instanţă-teritorială']);
      cîmp('#email', Profil.date['email']);
      cîmp('#cont-taxe-speze', Profil.date['cont-taxe-speze']);
      cîmp('#bancă-taxe-speze', Profil.date['bancă-taxe-speze']);
      Bănci.setează(Profil.date['bancă-taxe-speze'], Profil.$.find('#bancă-taxe-speze'));
      cîmp('#cont-onorarii', Profil.date['cont-onorarii']);
      cîmp('#bancă-onorarii', Profil.date['bancă-onorarii']);
      Bănci.setează(Profil.date['bancă-onorarii'], Profil.$.find('#bancă-onorarii'));
    }
  },

  // --------------------------------------------------

  Bănci = {
    lista: {},

    încarcă: function(callback) {
      if ($.isEmptyObject(this.lista)) {
        $.get('/date/bnm/bănci.js', function() {
          Bănci.initCîmpuri();

          callback();
        });
      }
    },

    initCîmpuri: function() {
      $(document)
        .on('input', 'input.sufix-cod-bancă', Bănci.listeazăDupăSufix)
        .on('click', '.şoaptă-cod-bancă', function() { $(this).next().focus().select(); });
    },

    listeazăDupăSufix: function() {
      /*jshint maxcomplexity:5*/
      // ----
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

      // ----
      function alegeItem() {
        var banca = cîmp.prev('.rezultate').find('.selectat').text(),
            sufix = banca.match(/(\d{3}): /)[1];

        Bănci.setează(sufix, cîmp);
        ascundeRezultate();
      }

      // ----
      function ascundeRezultate() {
        cîmp
          .off('keydown keyup')
          .prev('.rezultate').remove();
      }

      // ====
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
        .on('mouseenter', '.item', function() { $(this).addClass('selectat').siblings().removeClass('selectat'); })
        .on('mouseleave', '.item', function() { $(this).removeClass('selectat'); })
        .on('click', '.item', alegeItem);

      cîmp
        .bind('keydown', 'down', evidenţiazăItem)
        .bind('keydown', 'up', evidenţiazăItem)
        .bind('keyup', 'esc', ascundeRezultate)
        .bind('keydown', 'return', alegeItem);
    },

    cautăDupăSufix: function(sufix) {
      var MAX_REZULTATE = 10;
      var lungimeSufix = sufix.length,
          cod, numărRezultate = 0,
          rezultate = {};

      for (cod in Bănci.lista) {
        if (cod.substr(8, lungimeSufix) === sufix) {
          rezultate[cod] = Bănci.lista[cod];
          numărRezultate++;

          if (numărRezultate === MAX_REZULTATE) break;
        }
      }

      return rezultate;
    },

    setează: function(sufix, cîmp) {
      var banca = Bănci.cautăDupăSufix(sufix);

      if ($.isEmptyObject(banca)) return;

      var cod, denumire;

      for (cod in banca) denumire = banca[cod];

      sufix = $.trim(cod.substr(8));
      cîmp = $(cîmp);

      cîmp.val(sufix);
      cîmp.siblings('.şoaptă-cod-bancă').text(cod.substr(0, 8));
      cîmp.siblings('p').text(denumire);
    }
  },

  // --------------------------------------------------

  CalculatorDobîndaÎntîrziere = {
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
        .find('#art619-2').prop('checked', 'checked').end()
        .find('#sume .item:not(.prima)').remove();
    },

    calculeazăDobînda: function() {
      var secţiune = CalculatorDobîndaÎntîrziere.$,
          întîrziere = Subsecţiuni.întîrzieri.colectează(secţiune),
          dobînda = DobîndaDeÎntîrziere.calculează(întîrziere).dobînda;

      secţiune.find('.dobîndă').val(dobînda);
    }
  },

  // --------------------------------------------------

  Calendar = {
    opţiuni: {
      dateFormat: 'dd.mm.yy',
      dayNamesMin: 'Du Lu Ma Mi Jo Vi Sî Du'.split(' '),
      monthNames: 'Ianuarie Februarie Martie Aprilie Mai Iunie' +
        'Iulie August Septembrie Octombrie Noiembrie Decembrie'.split(' '),
      monthNamesShort: 'Ian Feb Mar Apr Mai Iun Iul Aug Sep Oct Noi Dec'.split(' '),
      firstDay: 1,
      showAnim: 'fadeIn',
      prevText: 'Luna precedentă',
      nextText: 'Luna viitoare',
      showOn: 'none',
      changeMonth: true,
      changeYear: true,
      yearRange: 'c-60:c+10',
      onSelect: function() { Calendar.închide(this); },
      beforeShow: function() { Calendar.veziDacăMaiECeva(this); }
    },

    init: function() {
      this.insereazăButoane();

      $(document)
        .on('click', 'input.dată+.ui-icon-calendar', this.afişează);
    },

    închide: function(el) {
      el = $(el);

      if (el.attr('data-id')) el.attr('id', el.attr('data-id'));

      el.datepicker('destroy').focus().trigger('input');

      if (el.attr('data-ceva')) el.val(el.val() + el.attr('data-ceva'));
    },

    // dacă în cîmpul pentru dată mai este ceva, de exemplu ora, memorizează
    // pentru a repopula după ce se selectează ceva din calendar
    veziDacăMaiECeva: function(input) {
      var valoarea = input.value;

      if (valoarea.length === 10) return; // este introdusă doar data

      $(input).attr('data-ceva', valoarea.substr(10));
    },

    insereazăButoane: function(container) {
      container = container || document.body;

      var buton = $('<span>')
        .addClass('ui-icon ui-icon-calendar semiascuns')
        .attr('title', 'Calendar');

      $('input.dată', container).after(buton);
    },

    afişează: function() {
      /*jshint maxcomplexity:6*/
      var cîmp = $(this).prev(),
          calendar = cîmp.datepicker('widget');

      if (calendar.is(':visible')) {
        cîmp.datepicker('destroy');
      } else {
        if (!cîmp.attr('data-datepicker')) {
          if (cîmp.attr('id')) {
            cîmp
              .attr('data-id', cîmp.attr('id'))
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
    }
  },

  // --------------------------------------------------

  // TODO:
  //  - de asigurat o valoare (cea default?) pentru etichete personalizate
  //  - de incrementat cînd mai este altul cu acelaşi nume? sau de stocat în array vs. hash?

  EticheteEditabile = {
    init: function() {
      FormularProcedură.$
        .on('click', 'button.adaugă-cîmp-personalizat', this.adaugă)
        .on('focus', '.etichetă', function() {
          $(this).parent().addClass('focusat');
        })
        .on('blur', '.etichetă', function() {
          $(this).parent().removeClass('focusat');
        })
        .on('keydown', '.etichetă', function(e) {
          if (e.keyCode === 13 || e.keyCode === 27) {
            if ($(this).next(':input:visible').există()) $(this).next().focus();
            else $(this).blur();
            e.stopPropagation();
          }
        })
        .on('eliminare', '.personalizat', function() {
          $(this).find('input').val(0).trigger('input');
        });
    },

    adaugă: function() {
      var $butonDeAdăugare = $(this),
          li = $butonDeAdăugare.closest('li'),
          $şablon;

      if ($butonDeAdăugare.attr('data-şablon')) {
        $şablon = window.$şabloane.find('.' + $butonDeAdăugare.attr('data-şablon')).html();
      } else {
        $şablon = $butonDeAdăugare.parent().prev().clone().find(':input').val('').end();
      }

      li
        .before($şablon)
        .prev()
          .find('.etichetă')
            .val($butonDeAdăugare.attr('data-etichetă'))
            .trigger('input')
          .end()
          .hide()
          .slideDown(function() {
            if (FormularProcedură.seIniţializează) return;

            $(this).find('.etichetă')
              .focus()
              .select();

            li.closest('fieldset').trigger('adăugat-cîmp-personalizabil', [li.prev('.personalizat')]);
          });
    }
  },

  // --------------------------------------------------

  ÎncasarePensie = {
    $: $(),
    $cota: $(),

    init: function() {
      FormularProcedură.$
        .on('înainte-de-deschidere', this.inserează)
        .on('înainte-de-închidere', this.elimină);

      FormularProcedură.$obiectulUrmăririi
        .on('input', '.încasare input', this.caluleazăOnorariulŞiPensia);
    },

    evalueazăCota: function(cota) {
      /*jshint evil:true*/
      cota = $.trim(cota).replace(/[^\/\d\.\,%]/g, '');

      if (/%$/.test(cota)) cota = cota.replace('%', '/100');

      try {
        cota = eval(cota);
      } catch (e) {
        cota = 0;
      }

      return cota;
    },

    caluleazăOnorariulŞiPensia: function() {
      var $încasare = $(this).closest('.încasare'),
          genulÎncasării = $încasare.find('#genul-încasării').val(),
          modulDeCuantificare = $încasare.find('#modul-de-cuantificare-' + genulÎncasării).val();

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
      if (!FormularProcedură.pensieDeÎntreţinere()) return;

      var $secţiune = FormularProcedură.$obiectulUrmăririi.find('.conţinut');

      $secţiune
        .data('conţinut-iniţial', $secţiune.find('ul:first').remove())
        .find('#adaugă-subsecţiune .încasare').click().end()
        .find('.subsecţiune.încasare #genul-încasării').trigger('change');

      ÎncasarePensie.$ = $secţiune;
      FormularProcedură.focusează();
    },

    elimină: function() {
      if (!FormularProcedură.pensieDeÎntreţinere()) return;

      var secţiune = FormularProcedură.$obiectulUrmăririi.find('.conţinut');

      secţiune.prepend(secţiune.data('conţinut-iniţial'));
      secţiune.removeData('conţinut-iniţial');
    }
  },

  // --------------------------------------------------

  DobîndaDeÎntîrziere = {
    // test: '04.09.2009', '14.06.2012', 9, 363761.50 === 162227.68
    calculează: function(întîrziere) {
      /*jshint maxcomplexity:11*/

      // ----
      function zileÎntre(data1, data2) {
        if (typeof data1 === 'string') data1 = moment(data1, 'YYYY-MM-DD').toDate();
        if (typeof data2 === 'string') data2 = moment(data2, 'YYYY-MM-DD').toDate();

        return Math.round((data2 - data1) / (24 * 3600 * 1000));
      }

      // ====
      var începutPerioadă = întîrziere.începutPerioadă,
          sfîrşitPerioadă = întîrziere.sfîrşitPerioadă,
          rata = întîrziere.rata,
          suma = întîrziere.suma,
          detalii;

      if (!RE_FORMATUL_DATEI.test(începutPerioadă) || !RE_FORMATUL_DATEI.test(sfîrşitPerioadă)) {
        return {dobînda: 0};
      }

      începutPerioadă = moment(începutPerioadă, FORMATUL_DATEI).format('YYYY-MM-DD');
      sfîrşitPerioadă = moment(sfîrşitPerioadă, FORMATUL_DATEI).format('YYYY-MM-DD');
      rata = parseInt(rata, 10);

      detalii = {
        începutPerioadă: moment(începutPerioadă, 'YYYY-MM-DD').format(FORMATUL_DATEI),
        sfîrşitPerioadă: moment(sfîrşitPerioadă, 'YYYY-MM-DD').format(FORMATUL_DATEI),
        rata: rata,
        suma: suma,
        rînduri: {}
      };

      var data, dataPrecedentă, primaDatăAplicabilă,
          durate = {};

      for (data in RateDeBază) {
        if (data > începutPerioadă) break;

        dataPrecedentă = data;
      }

      primaDatăAplicabilă = dataPrecedentă;
      dataPrecedentă = null;

      for (data in RateDeBază) {
        if (dataPrecedentă) {
          if (dataPrecedentă === primaDatăAplicabilă) {
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

      var rataFinală, dobînda = 0, dobîndaPerRînd, primulRînd = true;

      for (data in RateDeBază) {
        if (data < primaDatăAplicabilă) continue;
        if (data > sfîrşitPerioadă) break;

        rataFinală = (RateDeBază[data] + rata) / 100;
        dobîndaPerRînd = parseFloat((suma * rataFinală / 365 * durate[data]).toFixed(2));
        dobînda += dobîndaPerRînd;

        detalii.rînduri[data] = {
          data: moment(primulRînd ? începutPerioadă : data, 'YYYY-MM-DD').format(FORMATUL_DATEI),
          durata: durate[data],
          rata: RateDeBază[data],
          dobînda: dobîndaPerRînd
        };

        primulRînd = false;
      }

      return {
        dobînda: dobînda.toFixed(2),
        detalii: detalii
      };
    }
  },

  // --------------------------------------------------

  Onorariu = {
    $: $('#onorariu'),
    timeout: 500,

    init: function() {
      var schimbareDate = 'change input';
      var cîmpuriRelevante = [
        '.sumă:not(.irelevant-pentru-onorariu, .calculat)',
        '.valuta',
        SubsecţiuniDinamice.selector,
        'input:checkbox',
        '#caracter',
        '#obiect'
      ].join(',');

      FormularProcedură.$obiectulUrmăririi.on(schimbareDate, cîmpuriRelevante, this.calculează);
      FormularProcedură.$.on(schimbareDate, '.debitor #gen-persoană, #părţile-au-ajuns-la-conciliere', this.calculează);
    },

    calculează: function() {
      if (FormularProcedură.seIniţializează) return;
      if (Onorariu.timerCalculare) return;

      Onorariu.timerCalculare = setTimeout(function() {
        /*jshint maxcomplexity:6*/
        if (!FormularProcedură.$.is(':visible')) return;

        var $secţiune = FormularProcedură.$obiectulUrmăririi,
            caracter = $secţiune.find('#caracter').val(),
            onorariu = 0, valoare;

        if (caracter === 'nonpecuniar') {
          var obiect = FormularProcedură.$obiectulUrmăririi.find('#obiect').val(),
              genPersoană = FormularProcedură.$.find('.debitor #gen-persoană').val();

          valoare = Onorariu.nonpecuniar[obiect][genPersoană];
          onorariu = typeof valoare === 'function' ? valoare() : valoare;
        } else {
          var total = $secţiune.find('.conţinut ul:first .sumă:not(.calculat), .întîrziere .dobîndă').suma();

          $secţiune.find('#total').val(total).trigger('change');

          if (FormularProcedură.pensieDeÎntreţinere()) {
            onorariu = $secţiune.find('.încasare #onorariul-calculat').suma();
          } else {
            onorariu = Onorariu.pecuniar(total);
          }
        }

        if (Cheltuieli.$.find('#părţile-au-ajuns-la-conciliere').is(':checked')) {
          onorariu *= 0.7;
        }

        Onorariu.$.val(onorariu.toFixed(2));
        Onorariu.timerCalculare = false;
        $(document).trigger('calculat-onorariul');
      }, Onorariu.timeout);
    },

    pecuniar: function(suma) {
      if (suma <= 100000) {
        var minim = FormularProcedură.$obiectulUrmăririi.find('#amendă').is(':checked') ? 200 : 500;

        return Math.max(suma * 0.10, minim);
      } else if (suma <= 300000) {
        return 10000 + (suma - 100000) * 0.05;
      } else if (suma > 300000) {
        return 20000 + (suma - 300000) * 0.03;
      }
    },

    nonpecuniar: {
      'evacuarea': {fizică: 200 * UC, juridică: 300 * UC},
      'instalarea': {fizică: 200 * UC, juridică: 200 * UC},
      'schimbul forţat': {fizică: 200 * UC, juridică: 200 * UC},
      'stabilirea domiciliului copilului': {fizică: 200 * UC, juridică: 200 * UC},
      'efectuarea de către debitor a unor acţiuni obligatorii, nelegate de remiterea unor sume sau bunuri': {
        fizică: 200 * UC,
        juridică: 200 * UC
      },
      'efectuarea de către debitor a unor acţiuni obligatorii, legate de remiterea unor bunuri mobile': {
        fizică: function() { return 100 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); },
        juridică: function() { return 200 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); }
      },
      'efectuarea de către debitor a unor acţiuni obligatorii, legate de remiterea unor bunuri imobile': {
        fizică: function() { return 100 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); },
        juridică: function() { return 200 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); }
      },
      'confiscarea bunurilor': {
        fizică: function() { return 100 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); },
        juridică: function() { return 100 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); }
      },
      'nimicirea bunurilor': {
        fizică: function() { return 100 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); },
        juridică: function() { return 100 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); }
      },
      'restabilirea la locul de muncă': {fizică: 200 * UC, juridică: 200 * UC},
      'aplicarea măsurilor de asigurare a acţiunii': {
        fizică: function() {
          return $('.bunuri-supuse-înregistrării-sau-bani').is(':checked') ? 100 * UC : 120 * UC;
        },
        juridică: function() {
          return $('.bunuri-supuse-înregistrării-sau-bani').is(':checked') ? 100 * UC : 120 * UC;
        }
      }
    }
  },

  // --------------------------------------------------

  TotalCheltuieli = {
    init: function() {
      var cîmpuriRelevante = [
        'input.cost',
        'input.valoare',
        'input.sumă',
        'input.cantitate',
        'input#din-arhivă',
        '#taxaB5 .licitaţie.repetată',
        '#taxaB6 .licitaţie.repetată',
        '#speza5 #în-afara-circumscripţiei'
      ].join(',');

      var evenimente = 'keyup update paste mouseup click';

      Cheltuieli.$adăugate.on(evenimente, cîmpuriRelevante, this.calculează);
    },

    calculează: function() {
      var total = 0,
          lista = Cheltuieli.$adăugate;

      total += lista.find('input.valoare, input.sumă').suma();
      total += lista.find('input.cost').suma() * UC;
      total += lista.find('#taxaB2-1 .cantitate').suma() * 0.5 * UC;
      total += lista.find('#taxaB9 .cantitate').suma() * 5 * UC;
      total += lista.find('#taxaA6 #din-arhivă').is(':checked') ? 1 * UC : 0;

      var licitaţieRepetată = lista.find('#taxaB6 .licitaţie.repetată');

      if (licitaţieRepetată.is(':checked')) {
        total -= licitaţieRepetată.closest('.item').find('.cost').suma() * 0.5 * UC;
      }

      licitaţieRepetată = lista.find('#taxaB5 .licitaţie.repetată');

      if (licitaţieRepetată.is(':checked')) {
        total -= licitaţieRepetată.closest('.item').find('.cost').suma() * 0.5 * UC;
      }

      total += lista.find('#taxaA3 .cantitate').suma() * UC;
      total += lista.find('#taxaB7 .document').length * 3 * UC;
      total += lista.find('#taxaB13 .cantitate').suma() * 5 * UC;
      total += lista.find('#taxaC1 .cantitate').suma() * 5 * UC;

      // https://docs.google.com/document/d/1RCXVMBSJV8YOl-Fd-Cv6ji30_l-UU9jBXBZtwmMIb58/edit#bookmark=id.t8d2ds1n5h81
      if (lista.find('#speza5').există()) {
        // deplasările executorului judecătoresc efectuate în cadrul procedurii de
        // executare – 15 unităţi convenţionale *pentru întreaga procedură de executare*
        total += lista.find('#speza5 .cost-per-procedură').suma() * UC;

        // În cazul în care deplasarea executorului judecătoresc se face în afara
        // circumscripţiei judecătoriei unde îşi are sediul biroul său, creditorul
        // achită suplimentar 5 unităţi convenţionale pentru o deplasare
        total += lista.find('#speza5 #în-afara-circumscripţiei:checked').length * 5 * UC;
      }

      var documenteExpediate = lista.find('#taxaB1 .document');

      documenteExpediate.each(function() {
        var destinatari = $(this).children('.destinatari-adăugaţi').children();

        if (destinatari.există()) {
          total +=
            destinatari.filter('.suplimentar').length * 0.25 * UC +
            (destinatari.filter(':not(.suplimentar)').există() ? 1 * UC : 0);
        }
      });

      Cheltuieli.$.find('#total-taxe-şi-speze').val(total.toFixed(2));
    }
  },

  // --------------------------------------------------

  Sume = {
    init: function() {
      $(document).on('input keyup', 'input.sumă', this.înlocuieşteVirgulaCuPunct);
    },

    înlocuieşteVirgulaCuPunct: function() {
      if (!/,/.test(this.value)) return;

      var poziţieCursor = this.selectionStart;

      this.value = this.value.replace(/,/g, '.');
      this.selectionStart = poziţieCursor;
      this.selectionEnd = poziţieCursor;
    }
  },

  // --------------------------------------------------

  Subsecţiuni = {
    init: function() {
      FormularProcedură.$
        .on('înainte-de-deschidere', this.ajusteazăVizibilitateOpţiuni)
        .on('închidere', this.eliminăSubsecţiuni);

      FormularProcedură.$obiectulUrmăririi
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
      if (FormularProcedură.pensieDeÎntreţinere()) return;

      var $secţiune = FormularProcedură.$obiectulUrmăririi,
          $opţiuni = $secţiune.find('#adaugă-subsecţiune'),
          $amendă = $secţiune.find('#amendă'),
          caracter = $secţiune.find('#caracter').val();

      $opţiuni.find('.încasare').hide();

      if (caracter === 'nonpecuniar') {
        $opţiuni
          .find('.sechestrare-bunuri').show().end()
          .find('.întîrziere').hide();
      } else if (caracter === 'pecuniar') {
        $opţiuni
          .find('.sechestrare-bunuri').show().end()
          .find('.întîrziere').toggle(!$amendă.is(':checked'));
      }

    },

    eliminăSubsecţiuni: function() {
      FormularProcedură.$obiectulUrmăririi.find('.subsecţiune').remove();
    },

    încasări: {
      init: function() {
        FormularProcedură.$obiectulUrmăririi
          .on('click', '#adaugă-subsecţiune .încasare', this.adaugăSubsecţiune);
      },

      adaugăSubsecţiune: function() {
        var $încasare = $(window.$şabloane.find('#subsecţiune-încasare').html());

        $încasare
          .hide()
          .insertBefore($(this).closest('#adaugă-subsecţiune'))
          .show('blind');

        $încasare.find('#genul-încasării').trigger('change');

        if (!FormularProcedură.seIniţializează) $încasare.find('input').first().focus();

        $(this).siblings().show();
      }
    },

    întîrzieri: {
      init: function() {
        FormularProcedură.$obiectulUrmăririi
          .on('input change', '.subsecţiune.întîrziere :input:not(.dobîndă)', this.calculeazăDobînda)
          .on('click', '#adaugă-subsecţiune li.întîrziere', this.adaugăSubsecţiune);
      },

      adaugăSubsecţiune: function() {
        var $secţiune = $(this).closest('.conţinut'), $subsecţiune;

        $subsecţiune = window.$şabloane.find('.subsecţiune.întîrziere').clone()
          .find(':radio').attr('name', function(i, name) {
            return name + $secţiune.find('.subsecţiune.întîrziere').length;
          }).end()
          .hide()
          .insertBefore($(this).closest('#adaugă-subsecţiune'))
          .show('blind');

        if (!FormularProcedură.seIniţializează) {
          $subsecţiune.find('.început.perioadă').focus();
        }
      },

      calculeazăDobînda: function() {
        if (FormularProcedură.seIniţializează) return;

        var $întîrziere = $(this).closest('.subsecţiune.întîrziere'),
            întîrziere = Subsecţiuni.întîrzieri.colectează($întîrziere),
            dobînda = DobîndaDeÎntîrziere.calculează(întîrziere).dobînda;

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

        return 'cu-privire-la-calcularea-dobînzilor-de-întîrziere-' +
            începutPerioadă + '-' + sfîrşitPerioadă;
      },

      titluAnexă: function($subsecţiune) {
        var începutPerioadă = $subsecţiune.find('.început.perioadă').val(),
            sfîrşitPerioadă = $subsecţiune.find('.sfîrşit.perioadă').val();

        return 'anexă-cu-privire-la-calcularea-dobînzilor-de-întîrziere-' +
            începutPerioadă + '-' + sfîrşitPerioadă;
      }
    },

    bunuriSechestrate: {
      init: function() {
        FormularProcedură.$obiectulUrmăririi
          .on('click', '#adaugă-subsecţiune .sechestrare-bunuri', this.adaugăSubsecţiune)
          .on('click', '.subsecţiune.sechestrare-bunuri .adaugă-cîmp-personalizat', this.scoateClasaDeTot)
          .on('eliminare', '.personalizat', this.calculeazăTotal)
          .on('input change', ':input:not(.etichetă)', this.calculeazăTotal);
      },

      adaugăSubsecţiune: function() {
        window.$şabloane.find('.subsecţiune.sechestrare-bunuri').clone()
          .hide()
          .insertBefore($(this).closest('#adaugă-subsecţiune'))
          // ajustează dimensiunea etichetei personalizate
          .show().find('textarea.etichetă').trigger('input').end().hide()
          .show('blind', function() {
            $(this).find('input').first().select();
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
  },

  // --------------------------------------------------

  Încheieri = {
    $: null,
    deschise: {},

    init: function() {
      this.$ = FormularProcedură.$.find('#încheieri');
      this.butonaşe.init();

      setInterval(this.curăţaReferinţeLaFerestreleÎnchise, 5 * 1000);
      FormularProcedură.$.on('change', '#caracter, #obiect, #măsura-de-asigurare', this.ajusteazăLista);
    },

    închide: function() {
      var nume, încheiere;

      for (nume in Încheieri.deschise) {
        încheiere = Încheieri.deschise[nume];

        if (încheiere && încheiere.tab) încheiere.tab.close();
      }
    },

    curăţaReferinţeLaFerestreleÎnchise: function() {
      var încheiere, fereastră;

      for (încheiere in Încheieri.deschise) {
        fereastră = Încheieri.deschise[încheiere].tab;

        if (fereastră.closed) delete Încheieri.deschise[încheiere];
      }
    },

    ajusteazăLista: function() {
      /*
       * La "change" pe un select.care.schimbă.formularul se declanşează "change"
       * pe eventualele select.care.schimbă.formularul care s-au inserat, recursiv.
       *
       * Pentru evitarea reajustării multiple a listei de încheieri ca rezultat
       * al acestei recursivităţi, se folosim un timeout.
       * */
      if (Încheieri.timeoutAjustareListă) return;

      Încheieri.timeoutAjustareListă = setTimeout(function() {
        var $secţiune = FormularProcedură.$obiectulUrmăririi,
            caracter = $secţiune.find('#caracter').val(),
            obiect = $secţiune.find('#obiect').val(),
            măsurăDeAsigurare = $secţiune.find('#măsura-de-asigurare').val();

        var filtru = {
          'caracter': caracter,
          'obiect': obiect,
          'măsura-de-asigurare': măsurăDeAsigurare
        };

        Încheieri.$.find('li').show().find('a').each(function() {
          /*jshint maxcomplexity:5*/
          var item, valoare;

          for (item in filtru) {
            if (!filtru[item]) continue;
            if (!this.hasAttribute(item)) continue;

            valoare = filtru[item];

            if (this.getAttribute(item).split('|').indexOf(valoare) === -1) {
              $(this.parentNode).hide();
              return true; // return true is like "continue" for jQuery each loop
            }
          }
        });

        delete Încheieri.timeoutAjustareListă;
      }, 500);
    },

    formular: function(buton) {
      var formular = buton.attr('data-formular');

      if (FormularProcedură.$.is(':visible')) {
        var caracter = FormularProcedură.$obiectulUrmăririi.find('#caracter').val(),
            sufix = FormularProcedură.tip() + caracter;

        return '/formulare-încheieri/' + formular + '-' + sufix + '.html';
      } else {
        return '/formulare-încheieri/' + formular + '.html';
      }
    },

    deschide2: function(e) {
      e.preventDefault();

      var $buton = $(this),
          pagina = $buton.attr('href');

      Încheieri.deschise[pagina] = {
        tab: window.open(pagina, pagina, 'left=100,width=1000,height=1000'),
        buton: $buton
      };

      $(Încheieri.deschise[pagina].tab).on('salvat', FormularProcedură.salveazăSauCrează);
    },

    deschide: function() {
      var buton = $(this),
          formular = buton.attr('data-formular'),
          dinamic = buton.attr('data-dinamic'),
          pagina;

      if (buton.is('[dezactivat]')) return;
      if (!dinamic && buton.is('.salvat')) {
        pagina = buton.attr('data-pagina');
      } else {
        pagina = Încheieri.formular(buton);
      }

      Încheieri.deschise[pagina] = {
        tab: window.open(pagina, formular, 'left=100,width=1000,height=1000'),
        buton: buton
      };

      $(Încheieri.deschise[pagina].tab).on('salvat', FormularProcedură.salveazăSauCrează);
    },

    butonaşe: {
      init: function() {
        // TODO: aici de eliminat Încheieri.deschide în favoarea la Încheieri.deschide2?
        $(document)
          .on('click', '.încheieri a', Încheieri.deschide2)
          .on('click', '.buton[data-formular]', Încheieri.deschide)
          .on('mouseenter', '.buton[data-formular]', this.seteazăŞoaptă);

        FormularProcedură.$
          .on('închidere', Încheieri.închide)
          .on('salvat', Încheieri.butonaşe.activează);

        FormularProcedură.$.on('change', '#obiect', Încheieri.butonaşe.ajustează);
        MăsuriDeAsigurare.init();
      },

      activează: function() {
        FormularProcedură.$.find('.buton[data-formular]').removeAttr('dezactivat');
      },

      seteazăŞoaptă: function() {
        var $buton = $(this);

        if ($buton.is('[dezactivat]')) {
          if (!$buton.attr('şoaptă-activ')) {
            $buton
              .attr('şoaptă-activ', $buton.attr('title'))
              .attr('title', $buton.attr('title') + ' (mai întîi trebuie salvată procedura)');
          }
        } else {
          if ($buton.attr('şoaptă-activ')) {
            $buton.attr('title', $buton.attr('şoaptă-activ'));
          }
        }
      },

      ajustează: function() {
        var $opţiune = $(this).find('option:selected'),
            $buton = $(this).siblings('.buton[data-formular]');

        $buton
          .attr('data-formular', $opţiune.attr('data-formular-încheiere'))
          .attr('title', $opţiune.attr('data-şoaptă-buton'));
      }
    }
  },

  // --------------------------------------------------

  MăsuriDeAsigurare = {
    init: function() {
      FormularProcedură.$obiectulUrmăririi
        .on('click', '.adaugă-cîmp-personalizat', this.ascundeButonaşeDeAdăugare)
        .on('eliminare', '.personalizat.sume-sechestrate, .personalizat.bunuri-sechestrate', this.reafişeazăButonaşeDeAdăugareValoareAcţiune)
        .on('eliminare', '.personalizat.valoarea-acţiunii', this.reafişeazăToateButonaşele);
    },

    ascundeButonaşeDeAdăugare: function() {
      var $buton = $(this);

      if ($buton.is('.valoarea-acţiunii')) {
        FormularProcedură.$obiectulUrmăririi
          .find('.container-buton:has(button.pentru-bunuri-sechestrate,button.valoarea-acţiunii,button.pentru-sume-sechestrate)')
            .addClass('ascuns')
            .hide('blind');
      } else if ($buton.is('.pentru-bunuri-sechestrate') || $buton.is('.pentru-sume-sechestrate')) {
        FormularProcedură.$obiectulUrmăririi
          .find('.container-buton:has(button.valoarea-acţiunii)')
            .addClass('ascuns')
            .hide('blind');
      }
    },

    reafişeazăButonaşeDeAdăugareValoareAcţiune: function() {
      var $secţiune = FormularProcedură.$obiectulUrmăririi;
      var bunuriŞiSume = [
        'li.personalizat.bunuri-sechestrate',
        'li.personalizat.sume-sechestrate'
      ].join();

      if ($secţiune.find(bunuriŞiSume).length === 1) { // se elimină ultimul bun sau sumă
        $secţiune.find('.container-buton:has(button.valoarea-acţiunii)')
          .removeClass('ascuns')
          .show('blind');
      }
    },

    reafişeazăToateButonaşele: function() {
      var $secţiune = FormularProcedură.$obiectulUrmăririi;
      var butoaneDeAdăugare = [
        '.container-buton:has(button.pentru-bunuri-sechestrate)',
        '.container-buton:has(button.pentru-sume-sechestrate)',
        '.container-buton:has(button.valoarea-acţiunii)'
      ].join();

      $secţiune.find(butoaneDeAdăugare)
        .removeClass('ascuns')
        .show('blind');
    }
  },

  // --------------------------------------------------

  Secţiuni = {
    init: function() {
      FormularProcedură.$.on('click', 'fieldset.secţiune legend', this.desfăşoară);
    },

    desfăşoară: function() {
      var fieldset = $(this).closest('fieldset'),
          set;

      if (fieldset.is('#creditor') || fieldset.is('.debitor') || fieldset.is('.persoană-terţă')) {
        set = FormularProcedură.$.find('#creditor, .debitor, .persoană-terţă');
      } else if (fieldset.is('#document-executoriu') || fieldset.is('#obiectul-urmăririi')) {
        set = FormularProcedură.$.find('#document-executoriu, #obiectul-urmăririi');
      } else {
        set = fieldset;
      }

      set
        .toggleClass('desfăşurată comprimată')
        .find('.conţinut').animate({
          height: ['toggle', 'swing']
        }, 500);
    }
  },

  // --------------------------------------------------

  ListeMeniu = {
    init: function() {
      FormularProcedură.$
        .on('mouseenter', '.listă .titlu', this.afişează)
        .on('mouseleave', '.listă', this.ascunde);
    },

    afişează: function() {
      $(this).parent().children('.itemi').afişează();
    },

    ascunde: function() {
      $(this).children('.itemi').ascunde();
    }
  },

  // --------------------------------------------------

  ButoaneProceduri = {
    init: function() {
      $(document).on('click', 'li[data-href]', this.deschide);
    },

    deschide: function() {
      location.hash = $(this).attr('data-href');
    }
  },

  // --------------------------------------------------

  // TODO?
  AjaxBuffer = {
    put: function(url, data) {
      window.localStorage.setItem(url, JSON.stringify(data));
    },

    get: function(url) {
      return JSON.parse(window.localStorage.getItem(url));
    }
  },

  // --------------------------------------------------

  StructuriDate = {
    versiuni: {
      'profil': [],
      'procedură': [
        function(date) {
          var itemi = [];

          for (var id in date.cheltuieli.itemi) {
            itemi.push({
              id: id,
              date: date.cheltuieli.itemi[id]
            });
          }

          date.cheltuieli.itemi = itemi;

          return date;
        }
      ]
    },

    tipPerUrl: function(url) {
      if (/profil.json$/.test(url)) return 'profil';
      if (/proceduri\/$/.test(url)) return 'procedură';
      if (/proceduri\/\d+\/date.json$/.test(url)) return 'procedură';
    },

    seteazăVersiune: function(tip, date) {
      date.versiune = this.versiuni[tip].length;
    },

    aplicăSchimbări: function(tip, date) {
      date.versiune = date.versiune || 0;

      this.versiuni[tip].forEach(function(transformare, versiune) {
        if (versiune < date.versiune) return;

        date = transformare(date);
      });

      date.versiune = this.versiuni[tip].length;

      return date;
    }
  },

  // --------------------------------------------------

  Fragment = (function() {
    function găseşte$Fragment(identificator) {
      return $('script[type^="text/x-fragment"]#' + identificator);
    }

    var Fragment = function(identificator) {
      if (!identificator) throw new Error('Fragment: constructorul necesită un identificator');

      var $script = găseşte$Fragment(identificator);

      if (!$script.există()) throw new Error('Fragment: nu există framgment cu ID-ul ' + identificator);

      // --------------------
      this.html = $script.html();

      // --------------------
      this.compilează = function(date) {
        $.extend(date, $($.parseHTML(this.html)).data());

        return Handlebars.compile(this.html)(date);
      };
    };

    // --------------------
    Fragment.există = function(identificator) {
      return găseşte$Fragment(identificator).există();
    };

    // --------------------
    return Fragment;
  })(),

  // --------------------------------------------------

  AcţiuneProcedurală = (function() {
    var PREFIX_FRAGMENTE = 'acţiune-procedurală-',
        FRAGMENT_PROPUNERE = new Fragment('propunere-acţiune-procedurală');

    var AcţiuneProcedurală = function(identificator, date) {
      date = date || {};

      var dataCurentă = moment(Date.now()).format(FORMATUL_DATEI);

      date['data'] = date['data'] || dataCurentă;

      var fragment = new Fragment(PREFIX_FRAGMENTE + identificator),
          html = fragment.compilează(date);

      // --------------------
      this.propunere = function() {
        var descriere = $(html).find('.descriere').text();

        return FRAGMENT_PROPUNERE.compilează({
          descriere: descriere,
          identificator: identificator
        });
      };

      // --------------------
      this.adaugăLa = function($container) {
        var $html = $(html);

        Calendar.insereazăButoane($html);
        $container
          .trigger('înainte-de.adăugare-acţiune', [$html])
          .append($html)
          .trigger('după.adăugare-acţiune', [$html]);
      };

      // --------------------
      this.areStructuraCorespunzătoare = function() {
        /*jshint maxcomplexity:5*/
        var $html = $(html),
            lipsuri = [];

        if (!$html.is('[acţiune="' + identificator + '"]')) lipsuri.push('nu are atributul “acţiune”');
        if (!$html.find('[secţiune="dată"]').există()) lipsuri.push('nu are secţiune dată');
        if (!$html.find('[secţiune="conţinut"]').există()) lipsuri.push('nu are secţiune conţinut');
        if (!$html.find('.descriere').există()) lipsuri.push('nu are .descriere');
        // TODO: de determinat ce componente trebuie să existe pentru fiecare acţiune
        // şi de verificat prezenţa lor:
        // - data

        return lipsuri.length > 0 ? lipsuri : true;
      };
    };

    // --------------------
    AcţiuneProcedurală.există = function(identificator) {
      return Fragment.există(PREFIX_FRAGMENTE + identificator);
    };

    // --------------------
    return AcţiuneProcedurală;
  })(),

  // --------------------------------------------------

  AcţiuniProcedurale = (function() {
    var AcţiuniProcedurale = {
      $: $('#acţiuni-procedurale .itemi'),
      $opţiuni: $('#acţiuni-procedurale .opţiuni'),

      opţiuni: {
        '': ['intentare', 'intentare-cu-asigurare'],
        'intentare': ['continuare', 'încetare'],
        'intentare-cu-asigurare': ['continuare', 'încetare'],
        'continuare': ['încasare', ''],
        // TODO
        'încetare': [''],
        'încasare': ['']
      },

      // --------------------
      init: function() {
        this.înregistreazăFragmenteParţiale();
        this.$opţiuni.on('click', '.propunere', this.adaugă);
        this.efecte.init();

        this.propuneCorespunzătorAcţiunileUrmătoare();
      },

      înregistreazăFragmenteParţiale: function() {
        $('script[type="text/x-fragment"]').each(function() {
          Handlebars.registerPartial(this.id, this.innerText);
        });
      },

      efecte: {
        init: function() {
          AcţiuniProcedurale.$
            .on('înainte-de.adăugare-acţiune', this.ascunde)
            .on('după.adăugare-acţiune', this.afişează);
        },

        // --------------------
        ascunde: function(e, $element) {
          $element.hide();
        },

        // --------------------
        afişează: function(e, $element) {
          $element.slideDown();
        }
      },

      // --------------------
      propuneCorespunzătorAcţiunileUrmătoare: function() {
        var identificatori = this.opţiuni[this.ceaMaiRecentă()];

        identificatori.forEach(function(identificatorAcţiune) {
          var acţiune = new AcţiuneProcedurală(identificatorAcţiune);

          AcţiuniProcedurale.$opţiuni.append(acţiune.propunere());
        });
      },

      // --------------------
      eliminăOpţiuni: function() {
        AcţiuniProcedurale.$opţiuni.find('.propunere').remove();
      },

      // --------------------
      ceaMaiRecentă: function() {
        return this.$.find('[acţiune]:last').attr('acţiune') || '';
      },

      // --------------------
      adaugă: function() {
        var identificator = $(this).attr('identificator'),
            acţiune = new AcţiuneProcedurală(identificator);

        acţiune.adaugăLa(AcţiuniProcedurale.$);
        AcţiuniProcedurale.actualizeazăOpţiunile();
      },

      actualizeazăOpţiunile: function() {
        this.eliminăOpţiunileCurente();
        this.propuneCorespunzătorAcţiunileUrmătoare();
      },

      eliminăOpţiunileCurente: function() {
        this.$opţiuni.find('.propunere').remove();
      }

    };

    return AcţiuniProcedurale;
  })();

  // --------------------------------------------------

  $.extend(window, {
    Fragment: Fragment,
    Profil: Profil,
    FormularProcedură: FormularProcedură,
    ProceduriRecente: ProceduriRecente,
    Utilizator: Utilizator,
    Încheieri: Încheieri,
    Subsecţiuni: Subsecţiuni,
    DobîndaDeÎntîrziere: DobîndaDeÎntîrziere,
    Cheltuieli: Cheltuieli,
    FORMATUL_DATEI: FORMATUL_DATEI,
    UC: UC,
    Destinatari: Destinatari,
    Bănci: Bănci
  });

  if ('QUnit' in top) {
    $.extend(window, {
      Action: Action,
      Căutare: Căutare,
      Onorariu: Onorariu,
      Persoane: Persoane,
      HashController: HashController,
      TextareaElastice: TextareaElastice,
      SelecturiFoarteLate: SelecturiFoarteLate,
      SubsecţiuniDinamice: SubsecţiuniDinamice,
      AjaxBuffer: AjaxBuffer,
      StructuriDate: StructuriDate,
      AcţiuniProcedurale: AcţiuniProcedurale,
      AcţiuneProcedurală: AcţiuneProcedurală
    });
  }

  Action.init();

  if ('QUnit' in top) $(top.runQUnit);


})(window, document, moment);
