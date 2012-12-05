(function (window, document, app) {
  'use strict';

  var $, Procedura, Încheieri, Utilizator, Profil;

  var Încheiere = {
    formular: '',

    init: function () {
      setInterval(Încheiere.verificăDacăFormularulEDeschis, 500);

      $ = app.$;
      Procedura = app.Procedura;
      Încheieri = app.Încheieri;
      Utilizator = app.Utilizator;
      Profil = app.Profil;

      Încheiere.$ = $(document.body);
      Încheiere.pagina = decodeURIComponent(location.pathname);
      Încheiere.buton = Încheieri.deschise[Încheiere.pagina].buton;
      Încheiere.formular = Încheiere.buton.data('formular');

      if (!Încheiere.compilată()) {
        Încheiere.compilează();
      } else {
        Încheiere.conţinutIniţial = Încheiere.conţinut();
      }

      ButonDeÎnchidere.init();
      BaraDeInstrumente.init();

      Încheiere.$.find('.editabil').attr('contenteditable', true);
      Opţiuni.init();

      app.$(window).trigger('iniţializat');
    },

    verificăDacăFormularulEDeschis: function () {
      if (!opener || !Încheieri.deschise[Încheiere.pagina] || !Procedura.$.is(':visible')) {
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
        buton: Încheiere.buton,
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
            Încheieri.deschise[pagina] = Încheieri.deschise[Încheiere.pagina];
            delete Încheieri.deschise[Încheiere.pagina];
            Încheiere.pagina = pagina;
            history.replaceState(null, null, pagina);
          }

          Încheiere.conţinutIniţial = Încheiere.conţinut();
          Încheiere.marcheazăButonul();
          BaraDeInstrumente.anunţăSalvarea();

          app.$(window).trigger('salvat');
        });
      }
    },

    marcheazăButonul: function () {
      var buton = Încheiere.buton;

      if (buton.is(':not(.salvat)')) buton.addClass('salvat');

      buton.data('pagina', Încheiere.pagina);
    },

    cale: function () {
      var director = '/date/' + Utilizator.login + '/proceduri/' + Procedura.număr() + '/încheieri/',
          fişier = Încheiere.formular + '-' + app.moment().format('YYMMDDhhmmss') + '.html';

      return director + fişier;
    },

    imprimă: function () {
      Încheiere.salvează();
      app.$(Încheiere).one('salvat', function () {
        window.print();
      });
    },

    regenerează: function () {
      Încheiere.buton
        .removeClass('salvat')
        .removeData('pagina')
        .click();
    },

    modificat: function () {
      return Încheiere.conţinutIniţial !== Încheiere.conţinut();
    },

    închide: function () {
      delete Încheieri.deschise[Încheiere.pagina];
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
          $opţiuni = Încheiere.$.find('.opţiuni.' + opţiuni);

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
