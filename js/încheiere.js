(function (window, document, app) {
  'use strict';

  var $, FormularProcedură, Încheieri, Utilizator, Profil;

  var Încheiere = {
    formular: '',

    init: function () {
      $ = app.$;
      FormularProcedură = app.FormularProcedură;
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
      if (!app || !Încheieri.deschise[Încheiere.pagina] || !FormularProcedură.$.is(':visible')) {
        window.close();
        return;
      }
    },

    compilează: function () {
      app.compile(Încheiere.context(), document);
    },

    context: function () {
      var procedură = FormularProcedură.colectează(),
          nume = function (persoană) {
            return persoană['gen-persoană'] === 'fizică' ? persoană['nume'] : persoană['denumire'];
          },
          id = function (persoană) {
            return persoană['gen-persoană'] === 'fizică' ? ('IDNP ' + persoană['idnp']) : ('IDNO ' + persoană['idno']);
          };

      var context = {
        app: app,
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

      Încheiere.utilitare.init(context);

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
        if (decodeURI(location.pathname).substr(0, 21) === '/formulare-încheieri/') {
          // e o încheiere nouă încă nesalvată
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
        var salvareaIniţialăAProcedurii = !FormularProcedură.număr();

        if (salvareaIniţialăAProcedurii) {
          FormularProcedură.crează();
          FormularProcedură.$.one('salvat', Încheiere.trimite);
        } else {
          Încheiere.trimite();
          $(window).one('salvat', FormularProcedură.salveazăSauCrează);
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
      var director = '/date/' + Utilizator.login + '/proceduri/' + FormularProcedură.număr() + '/încheieri/',
          fişier = Încheiere.formular + '-' + (new Date()).getTime() + '.html';

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
    },

    utilitare: {
      init: function (context) {
        context._DEBITOR = this._DEBITOR(context);
        context._DEBITORULUI = this._DEBITORULUI(context);
      },

      _DEBITOR: function (context) {
        if (!context.debitori) return 'DEBITOR';
        if (context.debitori.length === 1) return 'DEBITOR';

        return 'DEBITORI';
      },

      _DEBITORULUI: function (context) {
        if (!context.debitori) return 'DEBITORULUI';
        if (context.debitori.length === 1) return 'DEBITORULUI';

        return 'DEBITORILOR';
      }
    }
  },

  // --------------------------------------------------

  ButonDeÎnchidere = {
    init: function () {
      FormularProcedură.$.find('button.închide').clone()
        .appendTo(Încheiere.$)
        .on('click', Încheiere.închide);
    }
  },

  // --------------------------------------------------

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

  // --------------------------------------------------

  window.Încheiere = Încheiere;

  // the check for opener is for qHint
  if (app) window.onload = Încheiere.init;

})(window, document, window.opener);
