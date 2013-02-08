/*global top:false moment:false RateDeBază:false RateBNM:false*/

(function (window, document, moment) {
  'use strict';

  var UC = 20, // valoarea unităţii convenţionale în MDL
      RE_FORMATUL_DATEI = /(\d{2})\.(\d{2})\.(\d{4})/,
      FORMATUL_DATEI = 'DD.MM.YYYY',

  location = window.location,
  $şabloane = $('#şabloane'),

  Action = {
    init: function () {
      Utilizator.init();

      if (!Utilizator.autentificat) return;

      BNM.init();
      HashController.init();
      Valute.populeazăListe();
      SubsecţiuniDinamice.init();
      CîmpuriTextarea.autodimensionează();
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
      ButoanePentruÎncheieri.init();
      Secţiuni.init();
      ListeMeniu.init();
      ButoaneProceduri.init();
      BaraDeSus.init();
      Căutare.init();

      $(window).trigger('hashchange');
    },

    '#index': function () {
      $('#căutare input').focus();
    }
  },

  // --------------------------------------------------

  BNM = {
    init: function () {
      $.get('/date/bnm/current.js');
      $.get('/date/bnm/rata_de_bază.js');
    }
  },

  // --------------------------------------------------

  Valute = {
    populeazăListe: function () {
      var şablon = $şabloane.find('.valute').html();

      $('ul .valuta').html(şablon);
    }
  },

  // --------------------------------------------------

  Persoane = {
    init: function () {
      FormularProcedură.$.on('click', 'button.adaugă.persoană', this.adaugă);
    },

    adaugă: function () {
      var buton = $(this),
          fieldset = buton.prev();

      fieldset.clone()
        .addClass('eliminabil de tot')
        .removeAttr('id') // #creditor
        .find('.conţinut').removeAttr('style').end()
        .find('input,textarea').val('').end()
        .find('legend label').text(function (i, text) {
          if (buton.find('.legend.label').există()) {
            $(this).closest('fieldset').addClass('persoană-terţă');

            return buton.find('.legend.label').text();
          } else {
            return text;
          }
        }).end()
        .hide()
        .insertAfter(fieldset)
        .show('blind', function () {
          buton.siblings('fieldset:not(#creditor)').addClass('dispensabilă');
        })
        .find('#gen-persoană').trigger('change');
    }
  },

  // --------------------------------------------------

  HashController = {
    init: function () {
      $(window)
        .on('hashchange', function () {
          if (location.hash && !(/^#formular(\?[SP]?(\-\d+)?)?$/).test(location.hash)) location.hash = '';
          if (!Utilizator.autentificat) {
            location.hash = '';
            return;
          }

          $(document.body).addClass('autentificat');

          var pagina = HashController.pagină();

          if (Action[pagina]) Action[pagina]();
        });
    },

    hash: function () {
      var hash = location.hash;

      if (hash === '' || hash === '#') hash = '#index';

      return hash;
    },

    pagină: function () {
      return this.hash().split('?')[0];
    },

    date: function () {
      return this.hash().split('?')[1] || '';
    }
  },

  // --------------------------------------------------

  CîmpuriTextarea = {
    evenimente: 'keydown keyup input focus mouseup',

    autodimensionează: function () {
      FormularProcedură.$
        .attr('spellcheck', 'false')
        .on(this.evenimente, 'textarea', function () {
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
  },

  // --------------------------------------------------

  SelecturiFoarteLate = {
    init: function () {
      FormularProcedură.$
        .on('change', 'select.foarte.lat', this.afişeazăŞoaptă)
        .find('select.foarte.lat').trigger('change').end()
        .on('change', 'select.care.schimbă.formularul', this.afişeazăŞoaptePentruSelecturileUrmătoare);
    },

    afişeazăŞoaptă: function () {
      var select = $(this);

      select.next('.şoaptă').remove();

      if (select.find('option:selected').is('.scurtă')) return;

      $('<p>')
        .insertAfter(select)
        .text(select.find('option:selected').text())
        .addClass('şoaptă');
    },

    afişeazăŞoaptePentruSelecturileUrmătoare: function () {
      $(this).closest('li')
        .nextAll().find('select.foarte.lat')
          .not(function () {return $(this).next().is('.şoaptă'); })
          .trigger('change');
    }
  },

  // --------------------------------------------------

  SubsecţiuniDinamice = {
    selector: 'select.care.schimbă.formularul',

    init: function () {
      FormularProcedură.$
        .on('change', this.selector, this.inserează);
    },

    inserează: function () {
      var $select = $(this),
          selectorŞablon = '.' + $select.attr('id') + '.conţinut[title="' + $select.val() + '"]',
          şablon = SubsecţiuniDinamice.parseazăIncluderile($şabloane.find(selectorŞablon).html()),
          item = $select.closest('li'),
          $subformular;

      item.nextAll().remove();
      item.after(şablon);

      $subformular = item.nextAll();
      $subformular.find(SubsecţiuniDinamice.selector).trigger('change');

      if (FormularProcedură.sePopulează || FormularProcedură.seIniţializează) return;

      $subformular
        .find(':input:not(' + SubsecţiuniDinamice.selector + ')').first().focus().end().end()
        .find('.adaugă-cîmp-personalizat.implicit').click();

      $select.trigger('inserat-subsecţiune');
    },

    parseazăIncluderile: function (html) {
      if (!html) return html;

      return html.replace(/<!-- include (.*?) -->/g, function (match, selector) {
        return $şabloane.find(selector).html();
      });
    }
  },

  // --------------------------------------------------

  Cheltuieli = {
    $: $('#cheltuieli'),
    adăugate: $('#cheltuieli .adăugate'),

    init: function () {
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

      init: function () {
        this.$
          .on('mouseenter', '.listă', this.marcheazăItemiAdăugaţiDeja)
          .on('click', '.listă .item', this.adaugăItem);
      },

      marcheazăItemiAdăugaţiDeja: function () {
        var itemiUniciAdăugaţiDeja = Cheltuieli.adăugate.children('.item.unic'),
            itemi = $(this).find('.listă ol').children();

        itemi
          .removeClass('dezactivat')
          .removeAttr('title');

        if (itemiUniciAdăugaţiDeja.există()) {
          var selector = itemiUniciAdăugaţiDeja.map(function () {
            return '#' + this.id;
          }).get().join(',');

          itemi.filter(selector)
            .addClass('dezactivat')
            .attr('title', 'Adăugat deja');
        }
      },

      adaugăItem: function () {
        if ($(this).is('.dezactivat')) return;

        var item = $(this).clone(),
            subformular = item.attr('data-şablon-subformular');

        if (subformular) {
          $şabloane.find('.subformular[title="' + subformular + '"]').clone()
            .removeAttr('title')
            .appendTo(item);
        }

        var bifăAchitare = $şabloane.find('.achitare').clone(),
            random = 'achitat' + (new Date()).getTime();

        bifăAchitare
          .find(':checkbox').attr('id', random).end()
          .find('label').attr('for', random);

        item
          .append(bifăAchitare)
          .addClass('eliminabil de tot')
          .hide()
          .appendTo(Cheltuieli.adăugate)
          .show('blind');

        if (!FormularProcedură.sePopulează) item.find('textarea').focus();

        Cheltuieli.adăugate.trigger('recalculare');

        $(this).closest('.itemi').fadeOut();

        TotalCheltuieli.calculează();
      }
    },

    subformulare: {
      init: function () {
        Cheltuieli.adăugate.on('click', 'button.adaugă', this.adaugă);
      },

      adaugă: function () {
        var numeŞablon = $(this).closest('.item').attr('data-şablon-subformular'),
            şablon = $şabloane.find('.subformular[title="' + numeŞablon + '"] .document').first(),
            $subformular = şablon.clone();

        $subformular
          .hide()
          .insertBefore($(this).parent())
          .show('blind');

        if (!FormularProcedură.sePopulează) $subformular.find('textarea,input').first().focus();

        TotalCheltuieli.calculează();
      }
    },

    destinatariDocumenteAdresabile: {
      init: function () {
        Cheltuieli.adăugate
          .on('click', '.destinatari-adăugaţi', this.ascundeSauAfişează)
          .on('eliminare', '.destinatari-adăugaţi .eliminabil', this.ascundeListaDacăNuMaiSunt)
          .on('eliminare', '.destinatari-adăugaţi .eliminabil', TotalCheltuieli.calculează)
          .on('keydown focusout', '.destinatari-adăugaţi .persoană.terţă input', this.ascundeLaEnterSauEsc);
      },

      ascundeLaEnterSauEsc: function (e) {
        if (e.keyCode === 13 || e.keyCode === 27 || e.type === 'focusout') {
          e.preventDefault();
          e.stopPropagation();
          Destinatari.adăugaţiDeja.click();
        }
      },

      ascundeSauAfişează: function (e) {
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

      ascundeListaDacăNuMaiSunt: function () {
        var destinatar = $(this);

        if (!destinatar.siblings().există()) destinatar.parent().click();
      }
    },

    achitare: {
      init: function () {
        Cheltuieli.adăugate.on('click', '.subformular.achitare :checkbox', this.setează);
      },

      setează: function () {
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
    $: $şabloane.find('#destinatari'),
    adăugaţiDeja: $(),

    init: function () {
      this.categorii.init();
      this.butonDeAdăugare.init();
    },

    butonDeAdăugare: {
      init: function () {
        Cheltuieli.adăugate
          .on('mouseenter', '.adaugă-destinatar', this.afişeazăCategoriile);
      },

      afişeazăCategoriile: function () {
        Destinatari.adăugaţiDeja = $(this).prev('.destinatari-adăugaţi');
        Destinatari.$.appendTo(this).afişează();
      }
    },

    categorii: {
      init: function () {
        Destinatari.$
          .on('click', '.listă .titlu .adaugă-toate', this.adaugăToate)
          .on('click', '.listă>.itemi>li', Destinatari.adaugă)
          .on('mouseenter', '.listă', this.marcheazăItemiAdăugaţiDeja);
      },

      marcheazăItemiAdăugaţiDeja: function () {
        var destinatari = $(this).find('.itemi').children(),
            destinatariAdăugaţiDeja = Destinatari.adăugaţiDeja.children(':not(.persoană.terţă)');

        if (destinatariAdăugaţiDeja.există()) {
          var selector = destinatariAdăugaţiDeja.map(function () {
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

      adaugăToate: function (e) {
        e.stopPropagation();

        var destinatari = $(this).parent().next('.itemi'),
            adăugaţiDeja = Destinatari.adăugaţiDeja.children().map(function () {
              return ':contains("' + $(this).text() + '")';
            }).get().join(',');

        destinatari.children('li').not(adăugaţiDeja).trigger('click');
      }
    },

    adaugă: function (e) {
      e.stopPropagation();

      var destinatar = $(this).clone();

      destinatar
        .addClass('eliminabil de tot')
        .appendTo(Destinatari.adăugaţiDeja);

      $(this).addClass('dezactivat').hide().show();

      if (destinatar.is('.persoană.terţă')) {
        Destinatari.adăugaţiDeja.click();
        destinatar.append('<input/>');

        if (!FormularProcedură.sePopulează && !FormularProcedură.seIniţializează) {
          destinatar.find('input').focus();
          Destinatari.$.hide();
        }
      }

      TotalCheltuieli.calculează();
    }
  },

  // --------------------------------------------------

  ButonDeEliminare = {
    $: $şabloane.find('.elimină'),
    eliminabilPrecedent: $(),

    init: function () {
      FormularProcedură.$
        .on('click', '.elimină', this.acţionează)
        .on('mousemove', '.eliminabil', this.afişează)
        .on('mouseleave', '.eliminabil', this.ascunde);
    },

    afişează: function (e) {
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

    ascunde: function () {
      ButonDeEliminare.$
        .removeClass('afişat')
        .parent().removeClass('spre-eliminare').end()
        .stop(true, true)
        .appendTo(document.body);
    },

    acţionează: function () {
      var eliminabil = ButonDeEliminare.$.parent();

      ButonDeEliminare.ascunde();

      if (eliminabil.is('.eliminabil.de.tot') || eliminabil.siblings('.eliminabil').există()) {
        eliminabil
          .trigger('eliminare')
          .slideUp(function () {
            eliminabil.remove();
            TotalCheltuieli.calculează();
          });
      } else {
        eliminabil
          .find('.eliminabil.de.tot').slideUp(function () {
            eliminabil
              .find('.valoare, .sumă').val(0).trigger('change').end()
              .find('textarea').val('').trigger('change').end()
              .trigger('eliminare');

            $(this).remove();
            TotalCheltuieli.calculează();
          });
      }
    }
  },

  // --------------------------------------------------

  Utilizator = {
    login: '',
    autentificat: false,

    init: function () {
      Utilizator.verificăSessiuneaHttp();

      Utilizator.login = $.cookie('login');
      Utilizator.autentificat = !!$.trim(Utilizator.login);

      $('#autentificare').toggle(!Utilizator.autentificat);
      $('body').toggleClass('autentificat', Utilizator.autentificat);
      $('#număr-licenţă').val(Utilizator.login);
    },

    verificăSessiuneaHttp: function () {
      $(document).ajaxError(function (event, response) {
        if (response.status === 401 || response.status === 403) {
          $.cookie('login', null);
          location.reload();
        }
      });
    },

    logout: function () {
      $.get('/bin/logout_pas1.php', function (data) {
        $.cookie('login', null);
        $.ajax({
          url: '/bin/logout_pas2.php',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + data);
          },
          error: function () {
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

    init: function () {
      this.$
        .on('keyup', function (e) { if (e.keyCode === 27) FormularProcedură.închide(); })
        .on('click', 'button.închide', this.închide)
        .on('click', 'button.salvează', this.salveazăSauCrează)
        .on('închidere', this.resetează)
        .on('populat iniţializat', this.calculează)
        .on('populat iniţializat', this.eliminăAmendaDupăCaz)
        .on('populat', this.actualizeazăDataUltimeiModificări)
        .on('salvat', this.actualizeazăDataUltimeiModificări);

      this.baraDeInstrumente.init();

      $(window).on('hashchange', function () {
        if (/^#formular/.test(location.hash)) FormularProcedură.deschide();
        else if (FormularProcedură.$.is(':visible')) FormularProcedură.închide();
      });

      this.$obiectulUrmăririi.on('adăugat-cîmp-personalizabil', function (e, li) {
        $(li).find('input').focus();
      });
    },

    tip: function () {
      return HashController.date().match(/^[SP]?/)[0];
    },

    baraDeInstrumente: {
      init: function () {
        FormularProcedură.$.find('.bara-de-instrumente')
          .on('click', '.spre-secţiuni', FormularProcedură.focusează)
          .on('click', '.spre-secţiuni+.opţiuni li', FormularProcedură.focuseazăSecţiunea);

        FormularProcedură.$.on('salvat', this.anunţăSalvarea);
        FormularProcedură.$.on('salvat-deja', this.anunţăSalvatDeja);
      },

      anunţăSalvarea: function () {
        FormularProcedură.baraDeInstrumente.afişeazăMesaj('salvat');
      },

      anunţăSalvatDeja: function () {
        FormularProcedură.baraDeInstrumente.afişeazăMesaj('salvat-deja');
      },

      afişeazăMesaj: function (mesaj) {
        var $mesaj = FormularProcedură.$.find('.bara-de-instrumente .salvează~.mesaj.' + mesaj);

        $mesaj.addClass('afişat');

        setTimeout(function () {
          $mesaj.removeClass('afişat');
        }, 1000);
      }
    },

    focuseazăSecţiunea: function () {
      var secţiune = $(this).text().substr(2),
          $titluSecţiune = FormularProcedură.$.find('legend label:contains("' + secţiune + '")'),
          $opţiuni = $(this).closest('.opţiuni'),
          top = $titluSecţiune.offset().top;

      if ($(document).scrollTop() === top) {
        $('html,body')
          .animate({scrollTop: $(document).scrollTop() + 25}, 50)
          .animate({scrollTop: $(document).scrollTop() - 25}, 50);
      }

      $('html,body').animate({scrollTop: top}, 750);
      $opţiuni.css('height', 0);
      setTimeout(function () { $opţiuni.removeAttr('style'); }, 800);
      $titluSecţiune.closest('fieldset').find('.conţinut :input:not([readonly]):first').focus();
    },

    eliminăAmendaDupăCaz: function () {
      if (FormularProcedură.deOrdingGeneral()) {
        FormularProcedură.$obiectulUrmăririi.find('li:has(#amendă)').remove();
      }
    },

    actualizeazăDataUltimeiModificări: function (e, procedură) {
      FormularProcedură.$.find('#data-ultimei-modificări span')
        .text(procedură['data-ultimei-modificări'])
        .parent().show();
    },

    calculează: function () {
      FormularProcedură.deschis = true;

      $.fx.off = true;

      TotalCheltuieli.calculează();
      Onorariu.calculează();
      FormularProcedură.seteazăTitlu();

      $.fx.off = false;

      FormularProcedură.focusează();
    },

    focusează: function () {
      $('html,body').animate({scrollTop: 0}, 500, function () {
        FormularProcedură.$titlu
          .attr('tabindex', 1)
          .focus()
          .removeAttr('tabindex');
      });
    },

    deOrdingGeneral: function () {
      return (/^(\d+)?$/).test(HashController.date());
    },

    pensieDeÎntreţinere: function () {
      return HashController.date().substr(0, 1) === 'P';
    },

    seCreazăProcedurăNouă: function () {
      return HashController.pagină() === '#formular' && /^[SP]?$/.test(HashController.date());
    },

    seDeschideProcedurăSalvată: function () {
      return HashController.pagină() === '#formular' && /^[SP]?-\d+$/.test(HashController.date());
    },

    seteazăTitlu: function () {
      var literă = FormularProcedură.tip(),
          href = '#formular' + (literă ? '?' + literă : ''),
          descriereProcedură = $('#crează-procedură').find('li[data-href="' + href + '"]').text(),
          număr = FormularProcedură.seCreazăProcedurăNouă() ? '' : Utilizator.login + HashController.date();

      FormularProcedură.$
        .find('#descriere').text(descriereProcedură).end()
        .find('#număr').text(număr).end();
    },

    colectează: function () {
      function colectează(secţiune) {
        var $secţiune = $(secţiune),
            date = {};

        var cîmpuri = [
          'ul:not(.subsecţiune) label+:input:not(.calculat):last-child',
          'ul:not(.subsecţiune) label+select.foarte.lat',
          'ul:not(.subsecţiune) label+.dată',
          'ul:not(.subsecţiune) label+input#salariu-recuperat',
          'ul:not(.subsecţiune) label+input#valoarea-acţiunii',
          'ul:not(.subsecţiune) .etichetă+:input'
        ].join(',');

        $secţiune.find(cîmpuri).each(function () {
          /*jshint maxcomplexity:5 */
          var $input = $(this),
              $label = $input.prev();

          if ($label.is('.etichetă')) {
            if (!$label.val() && !$input.val()) return;
            if (!date.subformular) date.subformular = {};

            date.subformular[$label.val()] = $input.is('.sumă') ? $input.suma() : $input.val();
          } else {
            if ($input.is('.dată.amînare')) return; // avem colecteazăAmînări() special pentru asta

            date[$input.attr('id')] = $input.val1();
          }
        });

        return date;
      }

      // ------------------------------------------
      function colecteazăObiectulUrmăririi() {
        var $secţiune = FormularProcedură.$obiectulUrmăririi,
            obiectulUrmăririi = colectează($secţiune);

        if (FormularProcedură.pensieDeÎntreţinere()) {
          obiectulUrmăririi = {'încasări': colecteazăÎncasări($secţiune)};
        }

        if (obiectulUrmăririi.caracter === 'pecuniar') {
          obiectulUrmăririi['sume'] = colecteazăSumeÎnValută($secţiune);
          obiectulUrmăririi['întîrzieri'] = colecteazăÎntîrzieri($secţiune);
          obiectulUrmăririi['sechestrări-bunuri'] = colecteazăSechestrăriBunuri($secţiune);
        } else {
          obiectulUrmăririi['amînări'] = colecteazăAmînări($secţiune); // pot fi amînări de evacuare sau instalare
        }

        return obiectulUrmăririi;
      }

      // ------------------------------------------
      function colecteazăÎntîrzieri($secţiune) {
        return $secţiune.find('.subsecţiune.întîrziere').map(function () {
          var $întîrziere = $(this);

          return {
            începutPerioadă: $întîrziere.find('.început.perioadă').val(),
            sfîrşitPerioadă: $întîrziere.find('.sfîrşit.perioadă').val(),
            rata: $întîrziere.find(':radio:checked').val(),
            suma: $întîrziere.find('.sumă.întîrziată').val(),
            dobînda: $întîrziere.find('.sumă.dobîndă').val(),
            încheiere: $întîrziere.find('.buton[data-formular="încheiere-dobîndă-de-întîrziere"]').attr('data-pagina'),
            anexa: $întîrziere.find('.buton[data-formular="anexă-dobîndă-de-întîrziere"]').attr('data-pagina')
          };
        }).get();
      }

      // ------------------------------------------
      function colecteazăSechestrăriBunuri($secţiune) {
        return $secţiune.find('.subsecţiune.sechestrare-bunuri').map(function () {
          var $sechestrare = $(this);

          return {
            data: $sechestrare.find('.dată').val(),
            bunuri: $sechestrare.find('.personalizat').map(function () {
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
      function colecteazăAmînări($secţiune) {
        return $secţiune.find('.dată.amînare').map(function () {
          var $input = $(this),
              $label = $input.prev(),
              amînăre = {};

          amînăre[$label.val()] = $input.val();

          return amînăre;
        }).get();
      }

      // ------------------------------------------
      function colecteazăÎncasări($secţiune) {
        return $secţiune.find('.subsecţiune.încasare').map(function () {
          var date = {};

          $(this).find(':input:not([readonly])').each(function () {
            date[this.id] = $.trim($(this).val());
          });

          return date;
        }).get();
      }

      // ------------------------------------------
      function colecteazăSumeÎnValută($secţiune) {
        var sume = {};

        $secţiune.find('ul:not(.subsecţiune) .sumă+.valuta').each(function () {
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

        Cheltuieli.adăugate.find('>.item').each(function () {
          var $item = $(this),
              item = {};

          item['achitat'] = $item.find('.achitare :checkbox').is(':checked');
          item['data-achitării'] = $item.find('.achitare .dată').val();

          var $subformular = $item.find('.subformular:not(.achitare)');

          if ($subformular.există()) {
            var titluri = $subformular.find('li:first label').map(function () {
              return $(this).text();
            });

            if (titluri.length > 0) { // subformular cu itemi eliminabili
              item.subformular = $subformular.find('>.eliminabil').map(function () {
                var $item = $(this),
                    item = {},
                    cîmpuriCuValori = 0;

                if ($item.find('.destinatari-adăugaţi').există()) { // documente adresate
                  item = {
                    'document': $.trim($item.find('.denumire').val()),
                    'destinatari': $item.find('.destinatari-adăugaţi li:not(:has(input))').map(function () {
                      return $.trim($(this).text());
                    }).get(),
                    'destinatari-persoane-terţe': $item.find('.destinatari-adăugaţi li:has(input)').map(function () {
                      return $.trim($(this).find('input').val());
                    }).get()
                  };
                } else { // listă itemi
                  $item.find(':input').each(function (i) {
                    item[titluri[i]] = $(this).val();
                  });
                }

                cîmpuriCuValori = $.map(item, function (v) { return !!v; })
                  .filter(function (areValoare) { return areValoare; })
                  .length;

                if (cîmpuriCuValori > 0) return item;
              }).filter(function () { return !!this; }).get();
            } else { // subformular nestructurat
              item.subformular = {};

              $subformular.find(':input').each(function () {
                item.subformular[this.id] = $(this).val1();
              });
            }
          }

          itemi[$item.attr('id')] = item;
        });


        var cheltuieli = {
          'onorariu': $secţiune.find('#onorariu').val1(),
          'părţile-au-ajuns-la-conciliere': $secţiune.find('#părţile-au-ajuns-la-conciliere').val1(),
          'itemi': itemi
        };

        var $încheiere = $secţiune.find('.buton[data-formular="borderou-de-calcul"]');

        if ($încheiere.is('.salvat')) cheltuieli['încheiere'] = $încheiere.attr('data-pagina');

        return cheltuieli;
      }

      // ------------------------------------------
      function colecteazăPersoaneTerţe() {
        return FormularProcedură.$.find('.persoană-terţă').map(function () {
          return colectează(this);
        }).get();
      }

      // ------------------------------------------
      function colecteazăDebitori() {
        return FormularProcedură.$.find('.debitor').map(function () {
          return colectează(this);
        }).get();
      }

      // ==========================================

      var butonÎncheiere = FormularProcedură.$.find('#container-data-intentării .buton[data-formular]'),
          încheiere;

      if (butonÎncheiere.is('.salvat')) încheiere = butonÎncheiere.attr('data-pagina');

      return {
        'data-intentării': FormularProcedură.$.find('#data-intentării').val(),
        'document-executoriu': colectează('#document-executoriu'),
        'obiectul-urmăririi': colecteazăObiectulUrmăririi(),
        'cheltuieli': colecteazăCheltuieli(),
        'creditor': colectează('#creditor'),
        'persoane-terţe': colecteazăPersoaneTerţe(),
        'debitori': colecteazăDebitori(),
        'tip': FormularProcedură.tip(),
        'data-ultimei-modificări': moment().format('DD.MM.YYYY HH:mm'),
        'încheiere': încheiere
      };
    },

    număr: function () {
      var re = /^#formular\?([SP]?-\d+)/;

      if (re.test(location.hash)) {
        return location.hash.match(re)[1];
      }
    },

    salveazăSauCrează: function () {
      var număr = FormularProcedură.număr();

      if (număr) {
        număr = număr.match(/[SP]?-\d+/)[0];
        FormularProcedură.salvează(număr);
      } else {
        FormularProcedură.crează();
      }
    },

    salvează: function (număr) {
      if (FormularProcedură.seTrimite) return;

      var procedură = FormularProcedură.colectează(),
          cale = '/date/' + Utilizator.login + '/proceduri/' + număr + '/date.json';

      if (!FormularProcedură.saSchimbat(procedură, număr)) {
        FormularProcedură.$.trigger('salvat-deja', [procedură]);
        return;
      }

      FormularProcedură.seTrimite = true;

      $.put(cale, JSON.stringify(procedură), function (_, status) {
        FormularProcedură.seTrimite = false;

        if (status === 'notmodified') {
          FormularProcedură.$.trigger('salvat-deja', [procedură]);
          return;
        }

        FormularProcedură.$.trigger('salvat', [procedură, număr]);
        FormularProcedură.puneÎnCache(procedură, număr);
        Căutare.încarcăIndexFărăCache();
      });
    },

    crează: function () {
      if (FormularProcedură.seTrimite) return;

      var procedură = FormularProcedură.colectează(),
          cale = '/date/' + Utilizator.login + '/proceduri/';

      FormularProcedură.seTrimite = true;

      $.put(cale, JSON.stringify(procedură), function (cale) {
        FormularProcedură.seTrimite = false;

        var număr = cale.match(/([SP]?-\d+)\/date.json$/)[1],
            adresaNouă = location.href + '?' + număr;

        history.replaceState(null, null, adresaNouă);

        FormularProcedură.seteazăTitlu();
        FormularProcedură.$.trigger('salvat', [procedură, număr]);
        FormularProcedură.puneÎnCache(procedură, număr);
        Căutare.încarcăIndexFărăCache();
      });
    },

    puneÎnCache: function (procedură, număr) {
      var copieProcedură = $.extend(true, {}, procedură);

      delete copieProcedură['data-ultimei-modificări'];
      FormularProcedură.cache[număr] = JSON.stringify(copieProcedură);
    },

    saSchimbat: function (procedură, număr) {
      var copieProcedură = $.extend(true, {}, procedură);

      delete copieProcedură['data-ultimei-modificări'];
      return FormularProcedură.cache[număr] !== JSON.stringify(copieProcedură);
    },

    încarcă: function () {
      var număr = HashController.date();

      $.getJSON('/date/' + Utilizator.login + '/proceduri/' + număr + '/date.json')
        .success(function (procedură) {
          ProceduriRecente.notează(număr);
          FormularProcedură.populează(procedură);
          FormularProcedură.puneÎnCache(procedură, număr);
        })
        .error(FormularProcedură.închide);

    },

    populează: function (procedură) {
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
        var $secţiune = FormularProcedură.$obiectulUrmăririi,
            secţiune = procedură['obiectul-urmăririi'];

        populeazăSecţiune($secţiune, secţiune);
        populeazăPensieÎntreţinere($secţiune, secţiune['încasări']);
        populeazăSume($secţiune, secţiune['sume']);
        populeazăÎntîrzieri($secţiune, secţiune['întîrzieri']);
        populeazăSechestrăriBunuri($secţiune, secţiune['sechestrări-bunuri']);
        populeazăAmînări($secţiune, secţiune['amînări']);
      }

      // ------------------------------------------
      function populeazăPensieÎntreţinere($secţiune, încasări) {
        /*jshint maxcomplexity:5*/
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

          $întîrziere.find('.buton[data-formular="încheiere-dobîndă-de-întîrziere"]')
            .attr('data-pagina', întîrziere['încheiere'])
            .toggleClass('salvat', !!întîrziere['încheiere']);

          $întîrziere.find('.buton[data-formular="anexă-dobîndă-de-întîrziere"]')
            .attr('data-pagina', întîrziere['anexa'])
            .toggleClass('salvat', !!întîrziere['anexa']);
        }
      }

      // ------------------------------------------
      function populeazăSechestrăriBunuri($secţiune, sechestrări) {
        /*jshint maxcomplexity:6*/
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
      function populeazăAmînări($secţiune, amînări) {
        /*jshint maxcomplexity:5*/
        if (!amînări || amînări.length === 0) return;

        var $butonDeAdăugare = $secţiune.find('button.adaugă-cîmp-personalizat.amînare');

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
      }

      // ------------------------------------------
      function populeazăSume($secţiune, sume) {
        if (!sume) return;

        $secţiune = $secţiune.find('ul:first');

        var cîmp, $cîmp, buton = $secţiune.find('.adaugă-cîmp-personalizat');

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
        /*jshint maxcomplexity:6, loopfunc:true */

        var $secţiune = Cheltuieli.$,
            $lista = Cheltuieli.$.find('#categorii-taxe-şi-speze'),
            încheiere = procedură.cheltuieli['încheiere'];

        $.each(['onorariu', 'părţile-au-ajuns-la-conciliere'], function (i, cîmp) {
          $secţiune.find('#' + cîmp).val1(procedură.cheltuieli[cîmp]);
        });

        if (încheiere) {
          $secţiune.find('.buton[data-formular="borderou-de-calcul"]')
            .addClass('salvat')
            .attr('data-pagina', încheiere);
        }

        for (var id in procedură.cheltuieli.itemi) {
          $lista.find('#' + id).click();

          var item = procedură.cheltuieli.itemi[id],
              $item = Cheltuieli.adăugate.find('#' + id),
              $subformular = $item.find('.subformular'),
              $adaugă = $subformular.find('button.adaugă'),
              titluri = {};

          $subformular.find('li:first label').each(function (i) {
            titluri[$(this).text()] = i;
          });

          if (item.achitat === true) {
            $item.find('.subformular.achitare :checkbox').attr('checked', true).trigger('change');
            $item.addClass('achitat');
          }

          $item.find('.subformular.achitare .la .dată').val(item['data-achitării']);

          if (item.subformular) {
            var prima = true, $cîmp, $itemSubformular;

            $.each(item.subformular, function (nume, valoare) {
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
                  $.each(this.destinatari, function () {
                    Destinatari.$.find('li:not(.listă):contains("' + this + '")').click();
                  });
                }

                if (this['destinatari-persoane-terţe']) {
                  $.each(this['destinatari-persoane-terţe'], function () {
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
                  $.each(this, function (nume, valoare) {
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
        var $adaugă = FormularProcedură.$.find('#creditor+button.adaugă'), $secţiune;

        if (procedură['persoane-terţe']) {
          $.each(procedură['persoane-terţe'], function () {
            $adaugă.click();

            $secţiune = FormularProcedură.$.find('.persoană-terţă:last');
            populeazăSecţiune($secţiune, this);
          });
        }
      }

      // ------------------------------------------
      function populeazăDebitori() {
        var $secţiune,
            prima = true,
            $adaugă = FormularProcedură.$.find('.debitor+button.adaugă');

        $.each(procedură['debitori'], function () {
          if (prima) {
            prima = false;
          } else {
            $adaugă.click();
          }

          $secţiune = FormularProcedură.$.find('.debitor:last');
          populeazăSecţiune($secţiune, this);
        });
      }


      // ------------------------------------------
      $.fx.off = true;
      FormularProcedură.sePopulează = true;

      FormularProcedură.$.find('#data-intentării').val(procedură['data-intentării']);

      if (procedură['încheiere']) {
        FormularProcedură.$.find('#container-data-intentării .buton[data-formular]')
          .attr('data-pagina', procedură['încheiere'])
          .addClass('salvat');
      }

      FormularProcedură.$.find('.buton[data-formular]').removeAttr('dezactivat');

      populeazăSecţiune('#document-executoriu', procedură['document-executoriu']);
      populeazăObiectulUrmăririi();
      populeazăCheltuieli();
      populeazăSecţiune('#creditor', procedură['creditor']);
      populeazăPersoaneleTerţe();
      populeazăDebitori();

      $.fx.off = false;
      FormularProcedură.sePopulează = false;
      FormularProcedură.$.trigger('populat', [procedură]);
    },

    resetează: function () {
      FormularProcedură.$
        .find('#data-intentării').val('').end()
        .find('#document-executoriu')
          .find(':input').val('').end()
          .find('select').val(function () { return $(this).find('option:first').val(); }).end()
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

        .find('.buton[data-formular]')
          .removeClass('salvat')
          .attr('dezactivat', 'da')
        .end()

        .find('#categorii-taxe-şi-speze')
          .find('.dezactivat').removeClass('dezactivat').end()
        .end();
    },

    închide: function () {
      FormularProcedură.$.trigger('înainte-de-închidere');

      location.hash = '';

      FormularProcedură.focusează();
      FormularProcedură.$
        .stop(true, true)
        .find('.bara-de-instrumente').fadeOut().end()
        .animate({'top': $(window).height()}, function () {
          $(this).hide();
        })
        .trigger('închidere');
    },

    deschide: function () {
      $.fx.off = true;
      FormularProcedură.$.trigger('înainte-de-deschidere');
      $.fx.off = false;

      FormularProcedură.$
        .stop(true, true)
        .find('.bara-de-instrumente').fadeIn('slow').end()
        .css('top', $(window).height())
        .show()
        .animate({'top': '40px'}, 'fast');

      if (FormularProcedură.seDeschideProcedurăSalvată()) {
        FormularProcedură.încarcă();
      } else {
        FormularProcedură.resetează();
        FormularProcedură.iniţializează();
        FormularProcedură.$.trigger('iniţializat');
      }
    },

    iniţializează: function () {
      $.fx.off = true;
      FormularProcedură.seIniţializează = true;

      FormularProcedură.$
        .find('#data-ultimei-modificări').hide().end()
        .find('#creditor #gen-persoană, .debitor #gen-persoană').trigger('change');

      if (FormularProcedură.seCreazăProcedurăNouă()) {
        Cheltuieli.$.find('#taxaA1').click();

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

      $.fx.off = false;
      FormularProcedură.seIniţializează = false;
    }
  },

  // --------------------------------------------------

  ProceduriRecente = {
    încărcat: false,
    lista: [],

    $: $('#proceduri-recente').find('.listă-proceduri'),

    init: function () {
    },

    url: function () {
      return '/date/' + Utilizator.login + '/proceduri/recente.json';
    },

    încarcă: function () {
      if (ProceduriRecente.încărcat || !Căutare.index) return;

      $.getJSON(ProceduriRecente.url(), ProceduriRecente.afişează);
    },

    încarcăFărăCache: function () {
      $.getJSON(ProceduriRecente.url() + '?' + (new Date()).getTime(), ProceduriRecente.afişează);
    },

    afişează: function (proceduri) {
      if (proceduri.length === 0 || !Căutare.index) return;

      var lista = {};

      ProceduriRecente.lista = [];

      $.each(proceduri, function () {
        var număr = Utilizator.login + this.toString();

        lista[număr] = Căutare.index[''][număr];
        ProceduriRecente.lista.push(număr.replace(Utilizator.login, ''));
      });

      ProceduriRecente.$.html(ListăProceduri.formatează(lista));

      ProceduriRecente.încărcat = true;
      $(document).trigger('încărcat-proceduri-recente');
    },

    notează: function (număr) {
      if (ProceduriRecente.numărulUltimei() === număr) return;

      $.put(ProceduriRecente.url(), număr, ProceduriRecente.afişează);
    },

    numărulUltimei: function () {
      return ProceduriRecente.lista[0];
    }
  },

  // --------------------------------------------------

  Căutare = {
    $: $('#căutare'),
    pauză: 200,

    init: function () {
      Căutare.$.find('input')
        .on('input', Căutare.găseşte)
        .bind('keydown', 'down', Căutare.rezultate.selectează)
        .bind('keydown', 'up', Căutare.rezultate.selectează)
        .bind('keydown', 'return', Căutare.rezultate.deschide)
        .bind('keyup', 'esc', function () { $(this).val('').trigger('input'); });

      Căutare.$
        .on('mouseenter', '.item', function () { $(this).addClass('selectat'); })
        .on('mouseleave', '.item', function () { $(this).removeClass('selectat'); });

      Căutare.adresăIndex = '/date/' + Utilizator.login + '/proceduri/index.json';
      Căutare.încarcăIndex();
    },

    rezultate: {
      $: $('#rezultate'),
      $găsite: $('#găsite'),
      $nimic: $('#nimic'),

      afişează: function (proceduri, text) {
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

      selectează: function (e) {
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

      deschide: function () {
        Căutare.rezultate.$.find('.selectat').first().click();
      }
    },

    găseşte: function () {
      if (Căutare.înAşteptare && !Căutare.seÎndeplineşte) {
        clearTimeout(Căutare.înAşteptare);
      }

      var text = $.reEscape($.trim(this.value));

      if (!text.length) {
        Căutare.anulează();
        return;
      }

      Căutare.înAşteptare = setTimeout(function () {
        /*jshint maxcomplexity:6*/
        Căutare.seÎndeplineşte = true;

        var rezultate = {
          laÎnceputDeRînd: [],
          laÎnceputDeCuvînt: [],
          oriunde: [],
          unificate: function () {
            var unice = {},
                index = Căutare.index,
                date = index[''],
                toate = this.laÎnceputDeRînd
                  .concat(this.laÎnceputDeCuvînt)
                  .concat(this.oriunde);

            toate.forEach(function (i) {
              $.each(index[i], colectează);
            });

            function colectează(_, număr) {
              if (!unice[număr]) unice[număr] = date[număr];
            }

            return unice;
          }
        };

        var laÎnceputDeRînd = new RegExp('^' + text, 'gi'),
            laÎnceputDeCuvînt = new RegExp('\\b' + text, 'gi'),
            oriunde = new RegExp(text, 'gi');

        var index = Căutare.index, item;

        for (item in index) {
          if (laÎnceputDeRînd.test(item)) rezultate.laÎnceputDeRînd.push(item);
          else if (laÎnceputDeCuvînt.test(item)) rezultate.laÎnceputDeCuvînt.push(item);
          else if (oriunde.test(item)) rezultate.oriunde.push(item);
        }

        Căutare.anulează();
        Căutare.rezultate.afişează(rezultate.unificate(), text);
        Căutare.seÎndeplineşte = false;
      }, Căutare.pauză);
    },

    anulează: function () {
      Căutare.rezultate.$.html('');
      Căutare.rezultate.$nimic.hide();
      Căutare.rezultate.$găsite.hide();
      ProceduriRecente.$.parent().show();
    },

    încarcăIndexFărăCache: function () {
      ProceduriRecente.încarcăForţat = true;
      $.get(Căutare.adresăIndex + '?' + (new Date()).getTime(), Căutare.seteazăIndex);
    },

    încarcăIndex: function () {
      $.getJSON(Căutare.adresăIndex, Căutare.seteazăIndex);
    },

    seteazăIndex: function (data) {
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

  ListăProceduri = {
    formatează: function (proceduri, text) {
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

      for (var număr in proceduri) {
        var procedură = evidenţiază(proceduri[număr]),
            creditor = persoană(procedură['creditor']),
            persoaneTerţe = $.map(procedură['persoane-terţe'], persoană).join(''),
            debitori = $.map(procedură['debitori'], persoană).join(''),
            href = '#formular?' + număr.replace(Utilizator.login, '');

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

    init: function () {
      this.$
        .on('click', '.dialog+button', this.afişeazăDialog)
        .on('ascundere', '.dialog', this.deselecteazăButonul)
        .on('afişare', '.dialog', this.selecteazăButonul)
        .on('afişare', '.dialog', this.focuseazăPrimulCîmp)
        .on('click', '.dialog button.închide', this.închideDialog)
        .on('keyup', '.dialog :input', function (e) {
          if (e.keyCode === 27) $(this).closest('.dialog').ascunde();
        });

      FormularProcedură.$
        .on('iniţializat populat', this.semiascundeInstrumente)
        .on('închidere', this.semiaratăInstrumente);

      Profil.init();
      CalculatorDobîndaÎntîrziere.init();
    },

    semiascundeInstrumente: function () {
      BaraDeSus.$.addClass('semiascuns');
    },

    semiaratăInstrumente: function () {
      BaraDeSus.$.removeClass('semiascuns');
    },

    afişeazăDialog: function () {
      var buton = $(this),
          dialog = buton.prev('.dialog');

      if (dialog.is(':visible')) {
        dialog.ascunde();
      } else {
        BaraDeSus.$.find('.dialog:visible').not(this).ascunde();
        dialog.afişează();
      }
    },

    focuseazăPrimulCîmp: function () {
      $(this).find('input:not([readonly]):first').focus();
    },

    închideDialog: function () {
      $(this).closest('.dialog').ascunde();
    },

    selecteazăButonul: function () {
      $(this).next('button').addClass('selectat');
    },

    deselecteazăButonul: function () {
      $(this).next('button').removeClass('selectat');
    }
  },

  // --------------------------------------------------

  Profil = {
    $: $('#profil'),

    cîmpNecompletat: '[lipseşte în profil]',

    init: function () {
      Bănci.încarcă(function () {
        Profil.url = '/date/' + Utilizator.login + '/profil.json';
        Profil.încarcăDate();
        Profil.$
          .on('click', 'button.salvează', Profil.salvează)
          .on('ascundere', Profil.reseteazăDialog);
      });
    },

    încarcăDate: function () {
      $.getJSON(Profil.url, function (date) {
        Profil.date = date;
        Profil.reseteazăDialog();
        Profil.$.trigger('încărcat');
      });
    },

    salvează: function () {
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

      $.put(Profil.url, JSON.stringify(Profil.date), function () {
        Profil.$
          .find('button.închide').click().end()
          .trigger('salvat');
      });
    },

    reseteazăDialog: function () {
      function cîmp(selector, valoare) { Profil.$.find(selector).val(valoare); }

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

    încarcă: function (callback) {
      if ($.isEmptyObject(this.lista)) {
        $.get('/date/bnm/bănci.js', function () {
          Bănci.initCîmpuri();

          callback();
        });
      }
    },

    initCîmpuri: function () {
      $(document)
        .on('input', 'input.sufix-cod-bancă', Bănci.listeazăDupăSufix)
        .on('click', '.şoaptă-cod-bancă', function () { $(this).next().focus().select(); });
    },

    listeazăDupăSufix: function () {
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
        .on('mouseenter', '.item', function () { $(this).addClass('selectat').siblings().removeClass('selectat'); })
        .on('mouseleave', '.item', function () { $(this).removeClass('selectat'); })
        .on('click', '.item', alegeItem);

      cîmp
        .bind('keydown', 'down', evidenţiazăItem)
        .bind('keydown', 'up', evidenţiazăItem)
        .bind('keyup', 'esc', ascundeRezultate)
        .bind('keydown', 'return', alegeItem);
    },

    cautăDupăSufix: function (sufix) {
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

    setează: function (sufix, cîmp) {
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

    init: function () {
      this.$
        .on('input change', ':input:not(.dobîndă)', this.calculeazăDobînda)
        .on('afişare', this.resetează);
    },

    resetează: function () {
      CalculatorDobîndaÎntîrziere.$
        .find('input:text').val('').end()
        .find('#art619-1').removeAttr('checked').end()
        .find('#art619-2').attr('checked', 'checked').end()
        .find('#sume .item:not(.prima)').remove();
    },

    calculeazăDobînda: function () {
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
      onSelect: function () { Calendar.închide(this); },
      beforeShow: function () { Calendar.veziDacăMaiECeva(this); }
    },

    închide: function (el) {
      el = $(el);

      if (el.attr('data-id')) el.attr('id', el.attr('data-id'));

      el.datepicker('destroy').focus().trigger('input');

      if (el.attr('data-ceva')) el.val(el.val() + el.attr('data-ceva'));
    },

    // dacă în cîmpul pentru dată mai este ceva, de exemplu ora, memorizează
    // pentru a repopula după ce se selectează ceva din calendar
    veziDacăMaiECeva: function (input) {
      var valoarea = input.value;

      if (valoarea.length === 10) return; // este introdusă doar data

      $(input).attr('data-ceva', valoarea.substr(10));
    },

    init: function () {
      this.insereazăButon();

      $(document)
        .on('click', '.dată+.ui-icon-calendar', this.afişează);
    },

    insereazăButon: function () {
      $('<span>')
        .addClass('ui-icon ui-icon-calendar semiascuns')
        .attr('title', 'Calendar')
        .insertAfter('.dată');
    },

    afişează: function () {
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

  EticheteEditabile = {
    init: function () {
      FormularProcedură.$
        .on('click', 'button.adaugă-cîmp-personalizat', this.adaugă)
        .on('focus', '.etichetă', function (e) {
          $(this).parent().addClass('focusat');
        })
        .on('blur', '.etichetă', function (e) {
          $(this).parent().removeClass('focusat');
        })
        .on('keydown', '.etichetă', function (e) {
          if (e.keyCode === 13 || e.keyCode === 27) {
            $(this).next().focus();
            e.stopPropagation();
          }
        })
        .on('eliminare', '.personalizat', function () {
          $(this).find('input').val(0).trigger('input');
        });
    },

    adaugă: function () {
      var buton = $(this),
          li = buton.closest('li'),
          şablon = $şabloane.find('.' + buton.attr('data-şablon')).html();

      li
        .before(şablon)
        .prev()
          .find('.etichetă')
            .val(buton.attr('data-etichetă'))
            .trigger('input')
          .end()
          .show('blind', function () {
            if (FormularProcedură.sePopulează || FormularProcedură.seIniţializează) return;

            $(this).find('.etichetă')
              .focus()
              .select();

            li.closest('fieldset').trigger('adăugat-cîmp-personalizabil', [this]);
          });
    }
  },

  // --------------------------------------------------

  ÎncasarePensie = {
    $: $(),
    $cota: $(),

    init: function () {
      FormularProcedură.$
        .on('înainte-de-deschidere', this.inserează)
        .on('înainte-de-închidere', this.elimină);

      FormularProcedură.$obiectulUrmăririi
        .on('input', '.încasare input', this.caluleazăOnorariulŞiPensia);
    },

    evalueazăCota: function (cota) {
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

    caluleazăOnorariulŞiPensia: function () {
      var $încasare = $(this).closest('.încasare'),
          genulÎncasării = $încasare.find('#genul-încasării').val(),
          modulDeCuantificare = $încasare.find('#modul-de-cuantificare-' + genulÎncasării).val();

      ÎncasarePensie.calculare[genulÎncasării + ' ' + modulDeCuantificare]($încasare);
    },

    calculare: {
      'periodică cotă': function ($încasare) {
        var cota = ÎncasarePensie.evalueazăCota($încasare.find('#cota-din-venit').val()),
            venitul = $încasare.find('#venitul').suma(),
            pensia = venitul * cota;

        if (isNaN(pensia)) return;

        $încasare.find('#pensie-cotă').val(pensia.toFixed(2));
        $încasare.find('#onorariul-calculat').val(Onorariu.pecuniar(pensia).toFixed(2));
      },

      'periodică sumă fixă': function ($încasare) {
        var pensia = $încasare.find('#pensia-lunară-suma-fixă').suma();

        if (isNaN(pensia)) return;

        $încasare.find('#onorariul-calculat').val(Onorariu.pecuniar(pensia).toFixed(2));
      },

      'periodică mixtă': function ($încasare) {
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

      'restantă cotă': function ($încasare) {
        var cota = ÎncasarePensie.evalueazăCota($încasare.find('#cota-din-venit').val()),
            totalVenit = $încasare.find('#total-venit-pe-perioadă').suma(),
            totalPensieCotă = cota * totalVenit;

        if (isNaN(totalPensieCotă)) return;

        $încasare.find('#total-pensie-cotă').val(totalPensieCotă.toFixed(2));
        $încasare.find('#onorariul-calculat').val(Onorariu.pecuniar(totalPensieCotă).toFixed(2));
      },

      'restantă sumă fixă': function ($încasare) {
        var numărulDeLuni = ÎncasarePensie.numărulDeLuni($încasare),
            pensiaLunară = $încasare.find('#pensia-lunară-suma-fixă').suma(),
            totalPensie = pensiaLunară * numărulDeLuni;

        if (isNaN(totalPensie)) return;

        $încasare.find('#total-pensie-sumă-fixă').val(totalPensie.toFixed(2));
        $încasare.find('#onorariul-calculat').val(Onorariu.pecuniar(totalPensie).toFixed(2));
      },

      'restantă mixtă': function ($încasare) {
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

    numărulDeLuni: function ($încasare) {
      var începutPerioadă = $încasare.find('#început-perioadă').val(),
          sfîrşitPerioadă = $încasare.find('#sfîrşit-perioadă').val();

      if (!RE_FORMATUL_DATEI.test(începutPerioadă) || !RE_FORMATUL_DATEI.test(sfîrşitPerioadă)) return 0;

      începutPerioadă = moment(începutPerioadă, FORMATUL_DATEI);
      sfîrşitPerioadă = moment(sfîrşitPerioadă, FORMATUL_DATEI);

      return sfîrşitPerioadă.diff(începutPerioadă, 'months', true);
    },

    inserează: function () {
      if (!FormularProcedură.pensieDeÎntreţinere()) return;

      var $secţiune = FormularProcedură.$obiectulUrmăririi.find('.conţinut');

      $secţiune
        .attr('data-conţinut-iniţial', $secţiune.find('ul:first').remove())
        .find('#adaugă-subsecţiune .încasare').click().end()
        .find('.subsecţiune.încasare #genul-încasării').trigger('change');

      ÎncasarePensie.$ = $secţiune;
      FormularProcedură.focusează();
    },

    elimină: function () {
      if (!FormularProcedură.pensieDeÎntreţinere()) return;

      var secţiune = FormularProcedură.$obiectulUrmăririi.find('.conţinut');

      secţiune.prepend(secţiune.attr('data-conţinut-iniţial'));
      secţiune.removeData('conţinut-iniţial');
    }
  },

  // --------------------------------------------------

  DobîndaDeÎntîrziere = {
    // test: '04.09.2009', '14.06.2012', 9, 363761.50 === 162227.68
    calculează: function (întîrziere) {
      /*jshint maxstatements:32 maxcomplexity:11*/

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

    init: function () {
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

    calculează: function () {
      if (FormularProcedură.seIniţializează || FormularProcedură.sePopulează) return;
      if (Onorariu.timerCalculare) return;

      Onorariu.timerCalculare = setTimeout(function () {
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

    pecuniar: function (suma) {
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
      'efectuarea de către debitor a unor acte obligatorii, nelegate de remiterea unor sume sau bunuri': {
        fizică: 200 * UC,
        juridică: 200 * UC
      },
      'efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri mobile': {
        fizică: function () { return 100 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); },
        juridică: function () { return 200 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); }
      },
      'efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri imobile': {
        fizică: function () { return 100 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); },
        juridică: function () { return 200 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); }
      },
      'confiscarea bunurilor': {
        fizică: function () { return 100 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); },
        juridică: function () { return 100 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); }
      },
      'nimicirea unor bunuri': {
        fizică: function () { return 100 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); },
        juridică: function () { return 100 * UC + 0.01 * FormularProcedură.$obiectulUrmăririi.find('.sumă').suma(); }
      },
      'restabilirea la locul de muncă': {fizică: 200 * UC, juridică: 200 * UC},
      'aplicarea măsurilor de asigurare a acţiunii': {
        fizică: function () {
          return $('.bunuri-supuse-înregistrării-sau-bani').is(':checked') ? 100 * UC : 120 * UC;
        },
        juridică: function () {
          return $('.bunuri-supuse-înregistrării-sau-bani').is(':checked') ? 100 * UC : 120 * UC;
        }
      }
    }
  },

  // --------------------------------------------------

  TotalCheltuieli = {
    init: function () {
      var cîmpuriRelevante = [
        'input.cost',
        'input.valoare',
        'input.sumă',
        'input.cantitate',
        'input#din-arhivă',
        '#taxaB5 .licitaţie.repetată',
        '#taxaB6 .licitaţie.repetată'
      ].join(',');

      var evenimente = 'keyup update paste mouseup click';

      Cheltuieli.adăugate.on(evenimente, cîmpuriRelevante, this.calculează);
    },

    calculează: function () {
      var total = 0,
          lista = Cheltuieli.adăugate;

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

      var documenteExpediate = lista.find('#taxaB1 .document');

      documenteExpediate.each(function () {
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
    init: function () {
      $(document).on('input keyup', 'input.sumă', this.înlocuieşteVirgulaCuPunct);
    },

    înlocuieşteVirgulaCuPunct: function () {
      if (!/,/.test(this.value)) return;

      var poziţieCursor = this.selectionStart;

      this.value = this.value.replace(/,/g, '.');
      this.selectionStart = poziţieCursor;
      this.selectionEnd = poziţieCursor;
    }
  },

  // --------------------------------------------------

  Subsecţiuni = {
    init: function () {
      FormularProcedură.$
        .on('înainte-de-deschidere', this.ajusteazăVizibilitateOpţiuni)
        .on('închidere', this.eliminăSubsecţiuni);

      FormularProcedură.$obiectulUrmăririi
        .on('mouseenter', '#adaugă-subsecţiune', this.ajusteazăVizibilitateOpţiuni)
        .on('change', '#caracter', this.ajusteazăVizibilitateOpţiuni)
        .on('eliminare', '.subsecţiune', function () {
          $(this).find('.sumă').val(0).trigger('input');
        });

      this.încasări.init();
      this.întîrzieri.init();
      this.bunuriSechestrate.init();
    },

    ajusteazăVizibilitateOpţiuni: function () {
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

    eliminăSubsecţiuni: function () {
      FormularProcedură.$obiectulUrmăririi.find('.subsecţiune').remove();
    },

    încasări: {
      init: function () {
        FormularProcedură.$obiectulUrmăririi
          .on('click', '#adaugă-subsecţiune .încasare', this.adaugăSubsecţiune);
      },

      adaugăSubsecţiune: function () {
        var $încasare = $($şabloane.find('#subsecţiune-încasare').html());

        $încasare
          .hide()
          .insertBefore($(this).closest('#adaugă-subsecţiune'))
          .show('blind');

        $.fx.off = true;
        $încasare.find('#genul-încasării').trigger('change');
        $.fx.off = false;

        if (!FormularProcedură.sePopulează) $încasare.find('input').first().focus();

        $(this).siblings().show();
      }
    },

    întîrzieri: {
      init: function () {
        FormularProcedură.$obiectulUrmăririi
          .on('input change', '.subsecţiune.întîrziere :input:not(.dobîndă)', this.calculeazăDobînda)
          .on('click', '#adaugă-subsecţiune li.întîrziere', this.adaugăSubsecţiune);
      },

      adaugăSubsecţiune: function () {
        var $secţiune = $(this).closest('.conţinut'), $subsecţiune;

        $subsecţiune = $şabloane.find('.subsecţiune.întîrziere').clone()
          .find(':radio').attr('name', function (i, name) {
            return name + $secţiune.find('.subsecţiune.întîrziere').length;
          }).end()
          .hide()
          .insertBefore($(this).closest('#adaugă-subsecţiune'))
          .show('blind');

        if (!FormularProcedură.seIniţializează && !FormularProcedură.sePopulează) {
          $subsecţiune.find('.început.perioadă').focus();
        }
      },

      calculeazăDobînda: function () {
        if (FormularProcedură.sePopulează || FormularProcedură.seIniţializează) return;

        var $întîrziere = $(this).closest('.subsecţiune.întîrziere'),
            întîrziere = Subsecţiuni.întîrzieri.colectează($întîrziere),
            dobînda = DobîndaDeÎntîrziere.calculează(întîrziere).dobînda;

        $întîrziere.find('.sumă.dobîndă').val(dobînda);
        Onorariu.calculează();
      },

      colectează: function ($întîrziere) {
        return {
          începutPerioadă: $întîrziere.find('.început.perioadă').val(),
          sfîrşitPerioadă: $întîrziere.find('.sfîrşit.perioadă').val(),
          rata: $întîrziere.find(':radio:checked').val(),
          suma: $întîrziere.find('.sumă.întîrziată').val()
        };
      },

      titluÎncheiere: function ($subsecţiune) {
        var începutPerioadă = $subsecţiune.find('.început.perioadă').val(),
            sfîrşitPerioadă = $subsecţiune.find('.sfîrşit.perioadă').val();

        return 'cu-privire-la-calcularea-dobînzilor-de-întîrziere-' +
            începutPerioadă + '-' + sfîrşitPerioadă;
      },

      titluAnexă: function ($subsecţiune) {
        var începutPerioadă = $subsecţiune.find('.început.perioadă').val(),
            sfîrşitPerioadă = $subsecţiune.find('.sfîrşit.perioadă').val();

        return 'anexă-cu-privire-la-calcularea-dobînzilor-de-întîrziere-' +
            începutPerioadă + '-' + sfîrşitPerioadă;
      }
    },

    bunuriSechestrate: {
      init: function () {
        FormularProcedură.$obiectulUrmăririi
          .on('click', '#adaugă-subsecţiune .sechestrare-bunuri', this.adaugăSubsecţiune)
          .on('click', '.subsecţiune.sechestrare-bunuri .adaugă-cîmp-personalizat', this.scoateClasaDeTot)
          .on('eliminare', '.personalizat', this.calculeazăTotal)
          .on('input change', ':input:not(.etichetă)', this.calculeazăTotal);
      },

      adaugăSubsecţiune: function () {
        $şabloane.find('.subsecţiune.sechestrare-bunuri').clone()
          .hide()
          .insertBefore($(this).closest('#adaugă-subsecţiune'))
          // ajustează dimensiunea etichetei personalizate
          .show().find('textarea.etichetă').trigger('input').end().hide()
          .show('blind', function () {
            $(this).find('textarea.etichetă').select();
          });
      },

      scoateClasaDeTot: function () {
        var subsecţiune = $(this).parent().parent();

        setTimeout(function () {
          subsecţiune.find('.personalizat.eliminabil.de.tot').removeClass('de tot');
        }, 100);
      },

      calculeazăTotal: function () {
        var subsecţiune = $(this).closest('.subsecţiune'),
            total = subsecţiune.find('.total');

        total.val(subsecţiune.find('.sumă').not(total).suma());
      }
    }
  },

  // --------------------------------------------------

  Încheieri = {
    deschise: {},

    închide: function () {
      var nume, încheiere;

      for (nume in Încheieri.deschise) {
        încheiere = Încheieri.deschise[nume];

        if (încheiere && încheiere.tab) încheiere.tab.close();
      }
    }
  },

  // --------------------------------------------------

  ButoanePentruÎncheieri = {
    init: function () {
      $(document)
        .on('click', '.buton[data-formular]', this.deschide)
        .on('mouseenter', '.buton[data-formular]', this.seteazăŞoaptă);

      FormularProcedură.$
        .on('închidere', this.închide)
        .on('salvat', this.activează);

      FormularProcedură.$.on('change', '#obiect', this.ajustează);
    },

    activează: function () {
      FormularProcedură.$.find('.buton[data-formular]').removeAttr('dezactivat');
    },

    seteazăŞoaptă: function () {
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

    ajustează: function () {
      var $opţiune = $(this).find('option:selected'),
          $buton = $(this).siblings('.ui-icon-document.buton');

      $buton
        .attr('data-formular', $opţiune.attr('data-formular-încheiere'))
        .attr('title', $opţiune.attr('data-şoaptă-buton'));
    },

    formular: function (buton) {
      var formular = buton.attr('data-formular');

      if (FormularProcedură.$.is(':visible')) {
        var caracter = FormularProcedură.$obiectulUrmăririi.find('#caracter').val(),
            sufix = FormularProcedură.tip() + caracter;

        return '/formulare-încheieri/' + formular + '-' + sufix + '.html';
      } else {
        return '/formulare-încheieri/' + formular + '.html';
      }
    },

    deschide: function () {
      var buton = $(this),
          formular = buton.attr('data-formular'),
          dinamic = buton.attr('data-dinamic'),
          pagina;

      if (buton.is('[dezactivat]')) return;
      if (!dinamic && buton.is('.salvat')) {
        pagina = buton.attr('data-pagina');
      } else {
        pagina = ButoanePentruÎncheieri.formular(buton);
      }

      Încheieri.deschise[pagina] = {
        tab: window.open(pagina, formular, '', true),
        buton: buton
      };

      $(Încheieri.deschise[pagina].tab).on('salvat', FormularProcedură.salveazăSauCrează);
    }
  },

  // --------------------------------------------------

  Secţiuni = {
    init: function () {
      FormularProcedură.$.on('click', 'fieldset button.desfăşoară', this.desfăşoară);
    },

    desfăşoară: function () {
      var fieldset = $(this).closest('fieldset'),
          set;

      if (fieldset.is('#creditor') || fieldset.is('.debitor') || fieldset.is('.persoană-terţă')) {
        set = FormularProcedură.$.find('#creditor, .debitor, .persoană-terţă');
      } else if (fieldset.is('#document-executoriu') || fieldset.is('#obiectul-urmăririi')) {
        set = FormularProcedură.$.find('#document-executoriu, #obiectul-urmăririi');
      } else {
        set = fieldset;
      }

      set.find('.conţinut').toggle('blind', function () {
        var conţinut = $(this),
            titlu = conţinut.is(':visible') ? 'Colapsează' : 'Desfăşoară';

        conţinut.closest('fieldset').find('button.desfăşoară').attr('title', titlu);
      });
    }
  },

  // --------------------------------------------------

  ListeMeniu = {
    init: function () {
      FormularProcedură.$
        .on('mouseenter', '.listă', this.afişează)
        .on('mouseleave', '.listă', this.ascunde);
    },

    afişează: function () {
      $(this).children('.itemi').afişează();
    },

    ascunde: function () {
      $(this).children('.itemi').ascunde();
    }
  },

  // --------------------------------------------------

  ButoaneProceduri = {
    init: function () {
      $(document).on('click', 'li[data-href]', this.deschide);
    },

    deschide: function () {
      location.hash = $(this).attr('data-href');
    }
  };

  // --------------------------------------------------

  $.fn.există = function () {
    return this.length > 0;
  };

  // --------------------------------------------------

  $.fn.ascunde = function () {
    return this.stop(true, true).fadeOut(function () {
      $(this).trigger('ascundere');
    });
  };

  // --------------------------------------------------

  $.fn.afişează = function () {
    return this.delay(200).fadeIn(function () {
      $(this).trigger('afişare');
    });
  };

  // --------------------------------------------------

  $.fn.val1 = function (value) {
    if (typeof value !== 'undefined') {
      if (this.is(':checkbox')) {
        return this.attr('checked', value === 'true' || value === true);
      } else {
        return this.val(value);
      }
    }

    return this.is(':checkbox') ? this.is(':checked') : this.val();
  };

  // --------------------------------------------------

  $.reEscape = function (re) {
    return re.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  };

  // --------------------------------------------------

  $.put = function (url, data, successCallback) {
    return $.ajax({
      type: 'PUT',
      url: url,
      data: data,
      success: successCallback
    });
  };

  // --------------------------------------------------

  $.fn.suma = function () {
    var suma = 0;

    this.filter('input').each(function () {
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
  };

  // --------------------------------------------------

  if (!('QUnit' in window)) Action.init();

  window.Profil = Profil;
  window.FormularProcedură = FormularProcedură;
  window.ProceduriRecente = ProceduriRecente;
  window.Utilizator = Utilizator;
  window.ButoanePentruÎncheieri = ButoanePentruÎncheieri;
  window.Încheieri = Încheieri;
  window.Subsecţiuni = Subsecţiuni;
  window.DobîndaDeÎntîrziere = DobîndaDeÎntîrziere;
  window.$şabloane = $şabloane;
  window.Cheltuieli = Cheltuieli;
  window.FORMATUL_DATEI = FORMATUL_DATEI;
  window.UC = UC;
  window.Bănci = Bănci;

  if (top.location.pathname === '/build/teste/qunit/') {
    window.Căutare = Căutare;
    window.Onorariu = Onorariu;
  }

})(window, document, moment);
