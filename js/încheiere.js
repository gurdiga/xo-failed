(function (window, document, app) {
  'use strict';

  var $, Procedura, ButoanePentruÎncheieri, Utilizator, Profil;

  var Încheiere = {
    init: function () {
      Încheiere.pagina = decodeURIComponent(location.pathname);
      setInterval(Încheiere.verificăDacăFormularulEDeschis, 500);

      $ = app.$;
      Procedura = app.Procedura;
      ButoanePentruÎncheieri = app.ButoanePentruÎncheieri;
      Utilizator = app.Utilizator;
      Profil = app.Profil;

      Încheiere.$ = $(document.body);

      if (!Încheiere.compilată()) {
        Încheiere.compilează();
      } else {
        Încheiere.iniţial = Încheiere.conţinut();
      }

      ButonDeÎnchidere.init();
      BaraDeInstrumente.init();

      Încheiere.$.find('.editabil').attr('contenteditable', true);
      Opţiuni.init();
      app.$(app.document).trigger('iniţializat-încheiere');
    },

    verificăDacăFormularulEDeschis: function () {
      if (!opener || !ButoanePentruÎncheieri[Încheiere.pagina] || !Procedura.$.is(':visible')) {
        window.close();
        return;
      }
    },

    compilează: function () {
      app.compile(Încheiere.context(), document);
    },

    context: function () {
      var procedură = Procedura.colectează(),
          nume = function (persoană) {
            return persoană['gen-persoană'] === 'fizică' ? persoană['nume'] : persoană['denumire'];
          },
          id = function (persoană) {
            return persoană['gen-persoană'] === 'fizică' ? ('IDNP ' + persoană['idnp']) : ('IDNO ' + persoană['idno']);
          };

      var context = {
        opener: opener,
        procedură: procedură,
        executor: Profil.date,
        login: Utilizator.login,
        buton: ButoanePentruÎncheieri[Încheiere.pagina].buton,
        nume: nume,
        id: id,
        debitori: procedură.debitori.map(function (debitor) {
          return nume(debitor) + ' (' + id(debitor) + ')';
        })
      };

      // cod specific pentru fiecare încheiere
      if (window.init) window.init(context);

      return context;
    },

    compilată: function () {
      return !Încheiere.$.find('>script').există();
    },

    conţinut: function () {
      return '<!doctype html>' +
        '<html>' +
          '<head>' + document.head.innerHTML + '</head>' +
          '<body>' +
            $('<div>' + document.body.innerHTML + '</div>')
              .find('button.închide')
                .nextAll().remove().end()
              .remove().end()
            .html() +
          '</body>' +
        '</html>';
    },

    salvează: function () {
      if (!Încheiere.modificat()) {
        BaraDeInstrumente.anunţăSalvatDeja();
      } else {
        var pagina = Încheiere.cale();

        $.put(pagina, Încheiere.conţinut(), function () {
          if (pagina !== Încheiere.pagina) {
            ButoanePentruÎncheieri[pagina] = ButoanePentruÎncheieri[Încheiere.pagina];
            delete ButoanePentruÎncheieri[Încheiere.pagina];
            Încheiere.pagina = pagina;
          }

          Încheiere.iniţial = Încheiere.conţinut();
          history.replaceState(null, null, pagina);

          Încheiere.marcheazăButonul();
          BaraDeInstrumente.anunţăSalvarea();

          app.$(app.document).trigger('salvat-încheiere');
        });
      }
    },

    marcheazăButonul: function () {
      var buton = ButoanePentruÎncheieri[Încheiere.pagina].buton;

      if (buton.is(':not(.salvat)')) buton.addClass('salvat');

      buton.data('pagina', Încheiere.pagina);
    },

    cale: function () {
      var director = '/date/' + Utilizator.login + '/proceduri/' + Procedura.număr() + '/încheieri/',
          buton = ButoanePentruÎncheieri[Încheiere.pagina].buton,
          fişier = buton.data('formular') + '-' + app.moment().format('YYMMDDhhmmss') + '.html';

      return director + fişier;
    },

    imprimă: function () {
      Încheiere.salvează();
      app.$(app.document).one('salvat-încheiere', function () {
        window.print();
      });
    },

    regenerează: function () {
      ButoanePentruÎncheieri[Încheiere.pagina].buton
        .removeClass('salvat')
        .removeData('pagina')
        .click();
    },

    modificat: function () {
      return Încheiere.iniţial !== Încheiere.conţinut();
    },

    închide: function () {
      delete ButoanePentruÎncheieri[Încheiere.pagina];
      window.close();
    }
  },

  // --------------------------------------------------

  ButonDeÎnchidere = {
    init: function () {
      Procedura.$.find('button.închide').clone()
        .appendTo(Încheiere.$)
        .on('click', Încheiere.închide);
    }
  },

  BaraDeInstrumente = {
    init: function () {
      app.$şabloane.find('.bara-de-instrumente.pentru.încheiere').clone()
        .appendTo(Încheiere.$)
        .on('click', '.salvează', Încheiere.salvează)
        .on('click', '.imprimă', Încheiere.imprimă)
        .on('click', '.regenerează', Încheiere.regenerează);
    },

    anunţăSalvarea: function () {
      BaraDeInstrumente.afişeazăMesaj('salvat');
    },

    anunţăSalvatDeja: function () {
      BaraDeInstrumente.afişeazăMesaj('salvat-deja');
    },

    afişeazăMesaj: function (mesaj) {
      var $mesaj = Încheiere.$.find('.bara-de-instrumente .salvează~.mesaj.' + mesaj);

      $mesaj.addClass('afişat');

      setTimeout(function () {
        $mesaj.removeClass('afişat');
      }, 1000);
    }
  },

  // --------------------------------------------------

  Opţiuni = {
    init: function () {
      $(document.body)
        .on('mouseenter', '.cu-opţiuni', this.afişează)
        .on('mouseleave', '.cu-opţiuni', this.ascunde)
        .on('click', '.opţiuni li', this.inserează);
    },

    afişează: function () {
      var $cîmp = $(this),
          opţiuni = $cîmp.data('opţiuni'),
          $opţiuni = Încheiere.$.find('.opţiuni.' + opţiuni),
          position = $cîmp.offset();

      $opţiuni
        .appendTo($cîmp)
        .show();

      $cîmp.data('$opţiuni', $opţiuni);
    },

    ascunde: function () {
      var $cîmp = $(this);

      $cîmp.data('$opţiuni')
        .prependTo(document.body)
        .hide();
    },

    inserează: function () {
      var $opţiune = $(this),
          $cîmp = $opţiune.closest('.cu-opţiuni');

      $opţiune.parent()
        .prependTo(document.body)
        .hide();

      $cîmp.html($opţiune.html());
    }
  };

  window.Încheiere = Încheiere;

  // the check for opener is for qHint
  if (opener) window.onload = Încheiere.init;

})(window, document, window.opener);
