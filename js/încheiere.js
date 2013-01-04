(function (window, document, app) {
  'use strict';

  var $, Procedura, Încheieri, Utilizator, Profil;

  var Încheiere = {
    formular: '',

    init: function () {
      $ = app.$;
      Procedura = app.Procedura;
      Încheieri = app.Încheieri;
      Utilizator = app.Utilizator;
      Profil = app.Profil;

      Încheiere.$ = $(document.body);
      Încheiere.pagina = decodeURIComponent(location.pathname);
      Încheiere.buton = Încheieri.deschise[Încheiere.pagina].buton;
      Încheiere.formular = Încheiere.buton.data('formular');

      // nu s-a deschis din calculatorul de dobînzi de întîrziere din bara de sus
      if (Încheiere.buton.parents('#formular').există()) {
        setInterval(Încheiere.verificăDacăFormularulEDeschis, 500);
      }

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
      app.$(Încheieri.deschise[Încheiere.pagina]).trigger('iniţializat');
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
        executor: JSON.parse(JSON.stringify(Profil.date)),
        login: Utilizator.login,
        buton: Încheiere.buton,
        nume: nume,
        id: id,
        debitori: procedură.debitori.map(function (debitor) {
          return nume(debitor) + ' (' + id(debitor) + ')';
        })
      };

      // cod specific pentru fiecare încheiere
      if ($.isFunction(window.init)) window.init(context);

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

    trimite: function () {
      var pagina = Încheiere.cale();

      $.put(pagina, Încheiere.conţinut(), function () {
        if (location.pathname.substr(0, 11) === '/formulare/') { // e o încheiere nouă încă nesalvată
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
    },

    salvează: function () {
      if (Încheiere.buton.data('dinamic')) {
        var $mesaj = Încheiere.$.find('.salvează').next('.mesaj.dinamicitate');

        $mesaj.addClass('afişat');

        setTimeout(function () {
          $mesaj.removeClass('afişat');
        }, 1000);

        return;
      }

      if (Încheiere.modificat()) {
        var salvareaIniţialăAProcedurii = !Procedura.număr();

        if (salvareaIniţialăAProcedurii) {
          Procedura.crează();
          Procedura.$.one('salvat', Încheiere.trimite);
        } else {
          Încheiere.trimite();
          $(window).one('salvat', Procedura.salveazăSauCrează);
        }
      } else {
        BaraDeInstrumente.anunţăSalvatDeja();
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
      var imprimă = window.print; // pentru mockabilitate

      if (Încheiere.buton.data('dinamic') || !Încheiere.modificat()) {
        imprimă();
        app.$(window).trigger('imprimat');
      } else {
        Încheiere.salvează();

        app.$(window).one('salvat', function () {
          imprimă();
          app.$(window).trigger('imprimat');
        });
      }
    },

    regenerează: function () {
      if (Încheiere.buton.data('dinamic')) {
        var $mesaj = Încheiere.$.find('.regenerează').next('.mesaj.dinamicitate');

        $mesaj.addClass('afişat');

        setTimeout(function () {
          $mesaj.removeClass('afişat');
        }, 1000);

        return;
      }

      delete Încheieri.deschise[Încheiere.pagina];
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
