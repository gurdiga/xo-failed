var Încheiere = {
  init: function() {
    Încheiere.pagina = decodeURIComponent(location.pathname);
    setInterval(Încheiere.verificăDacăFormularulEDeschis, 100);

    Încheiere.$ = opener.$(document.body);

    Încheiere.initContext();
    if (!Încheiere.compilat()) Încheiere.compilează();
    Încheiere.iniţial = Încheiere.conţinut();
    Încheiere.butonDeÎnchidere.init();
    Încheiere.baraDeInstrumente.init();

    Încheiere.$.find('.editabil').attr('contenteditable', true);
  },

  verificăDacăFormularulEDeschis: function() {
    if (!opener || !opener.Încheieri[Încheiere.pagina]) {
      window.close();
      return;
    }
  },

  compilează: function() {
    opener.compile(Încheiere.context, document);
  },

  initContext: function() {
    var procedură = opener.Procedura.colectează(),
        nume = function(persoană) {
          return persoană['gen-persoană'] == 'fizică' ? persoană['nume'] : persoană['denumire'];
        },
        id = function(persoană) {
          return persoană['gen-persoană'] == 'fizică' ? ('IDNP ' + persoană['idnp']) : ('IDNO ' + persoană['idno']);
        };

    Încheiere.context = {
      procedură: procedură,
      executor: opener.Profil.date,
      moment: opener.moment,
      login: opener.Utilizator.login,
      buton: opener.Încheieri[Încheiere.pagina].buton,
      nume: nume,
      id: id,
      debitori: procedură.debitori.map(function(debitor) {
        return nume(debitor) + ' (' + id(debitor) + ')';
      })
    };

    // cod specific pentru fiecare încheiere
    if (window.init) window.init(Încheiere.context);
  },

  compilat: function() {
    return !Încheiere.$.find('>script').există();
  },

  conţinut: function() {
    return '<!doctype html>' +
      '<html>' +
        '<head>' + document.head.innerHTML + '</head>' +
        '<body>' +
          opener.$('<div>' + document.body.innerHTML + '</div>')
            .find('button.închide')
              .nextAll().remove().end()
            .remove().end()
          .html() +
        '</body>' +
      '</html>';
  },

  salvează: function(callback) {
    if (!Încheiere.modificat()) {
      if (opener.$.isFunction(callback)) callback();
      return;
    }

    var pagina = Încheiere.cale();

    opener.$.post(pagina, Încheiere.conţinut(), function() {
      opener.Încheieri[pagina] = opener.Încheieri[Încheiere.pagina];
      Încheiere.pagina = pagina;
      Încheiere.iniţial = Încheiere.conţinut();
      history.replaceState(null, null, pagina);

      Încheiere.marcheazăButonul();
      Încheiere.baraDeInstrumente.anunţăSalvarea();

      if (opener.$.isFunction(callback)) callback();
    });
  },

  marcheazăButonul: function() {
    var buton = opener.Încheieri[Încheiere.pagina].buton;

    if (!buton.is('.salvat')) {
       buton
        .addClass('salvat')
        .data('pagina', Încheiere.pagina)
        .attr('title', function(_, title) {return title + ' (salvat)'});
    }
  },

  cale: function() {
    var director = '/date/' + opener.Utilizator.login + '/încheieri/',
        buton = opener.Încheieri[Încheiere.pagina].buton,
        fişier = buton.data('încheiere') + '-' + Încheiere.context.uid + '.html';

    return director + fişier;
  },

  imprimă: function() {
    Încheiere.salvează(window.print);
  },

  regenerează: function() {
    opener.Încheieri[Încheiere.pagina].buton
      .removeClass('salvat')
      .removeData('pagina')
      .click();
  },

  modificat: function() {
    return Încheiere.iniţial != Încheiere.conţinut();
  },

  butonDeÎnchidere: {
    init: function() {
      opener.Procedura.$.find('button.închide').clone()
        .appendTo(Încheiere.$)
        .on('click', Încheiere.închide);
    }
  },

  baraDeInstrumente: {
    init: function() {
      opener.$şabloane.find('.bara-de-instrumente.pentru.încheiere').clone()
        .appendTo(Încheiere.$)
        .on('click', '.salvează', Încheiere.salvează)
        .on('click', '.imprimă', Încheiere.imprimă)
        .on('click', '.regenerează', Încheiere.regenerează);
    },

    anunţăSalvarea: function() {
      var mesaj = Încheiere.$.find('.bara-de-instrumente .salvează+.mesaj');

      mesaj.addClass('afişat');
      setTimeout(function() {mesaj.removeClass('afişat')}, 1000);
      opener.Procedura.salvează();
    }
  },

  închide: function() {
    opener.Încheieri[Încheiere.pagina].tab.close();
  }
};

window.onload = Încheiere.init;
