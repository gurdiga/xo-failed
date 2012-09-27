var Raport = {
  init: function() {
    Raport.pagina = decodeURIComponent(location.pathname);
    setInterval(Raport.verificăDacăFormularulEDeschis, 100);

    Raport.$ = opener.$(document.body);

    if (!Raport.compilat()) Raport.compilează();
    Raport.iniţial = Raport.conţinut();
    Raport.butonDeÎnchidere.init();
    Raport.baraDeInstrumente.init();

    Raport.$.find('.editabil').attr('contenteditable', true);
  },

  verificăDacăFormularulEDeschis: function() {
    if (!opener || !opener.Rapoarte[Raport.pagina]) {
      window.close();
      return;
    }
  },

  compilează: function() {
    Raport.initContext();
    opener.compile(Raport.context, document);
  },

  initContext: function() {
    Raport.context = {
      procedură: opener.Formular.colectează(),
      executor: opener.Profil.date,
      moment: opener.moment,
      login: opener.Utilizator.login,
      $el: opener.Rapoarte[Raport.pagina].$el,
      nume: function(persoană) {
        return persoană['gen-persoană'] == 'fizică' ? persoană['nume'] : persoană['denumire'];
      },
      id: function(persoană) {
        return persoană['gen-persoană'] == 'fizică' ? ('IDNP ' + persoană['idnp']) : ('IDNO ' + persoană['idno']);
      }
    };

    // cod specific pentru fiecare raport
    if (window.init) window.init(Raport.context);
  },

  compilat: function() {
    return !Raport.$.find('>script').există();
  },

  conţinut: function() {
    return '<!doctype html>' +
      '<html>' +
        '<head>' + document.head.innerHTML
          .replace(/\n\s*<script id="init">(.|\n)*?<\/script>/m, '') +
        '</head>' +
        '<body>' +
          opener.$('<div>' + document.body.innerHTML + '</div>')
            .find('button.închide')
              .nextAll().remove().end()
            .remove().end()
          .html() +
        '</body>' +
      '</html>';
  },

  salvează: function() {
    if (!Raport.modificat()) return;

    var pagina = Raport.cale();

    opener.$.post(pagina, Raport.conţinut(), function() {
      opener.Rapoarte[pagina] = opener.Rapoarte[Raport.pagina];
      Raport.pagina = pagina;
      Raport.iniţial = Raport.conţinut();
      history.replaceState(null, null, pagina);

      Raport.marcheazăButonul();
      Raport.baraDeInstrumente.anunţăSalvarea();
    });
  },

  marcheazăButonul: function() {
    var buton = opener.Rapoarte[Raport.pagina].$el;

    if (!buton.is('.salvat')) {
       buton
        .addClass('salvat')
        .data('pagina', Raport.pagina)
        .attr('title', function(_, title) {return title + ' (salvat)'});
    }
  },

  cale: function() {
    var director = '/date/' + opener.Utilizator.login + '/rapoarte/',
        fişier = document.title.replace(/\s+/g, '-') + '-' + Raport.context.uid + '.html';

    return director + fişier;
  },

  imprimă: function() {
    Raport.salvează();
    window.print();
  },

  modificat: function() {
    return Raport.iniţial != Raport.conţinut();
  },

  butonDeÎnchidere: {
    init: function() {
      opener.Formular.$.find('button.închide').clone()
        .appendTo(Raport.$)
        .on('click', Raport.închide);
    }
  },

  baraDeInstrumente: {
    init: function() {
      opener.$şabloane.find('.bara-de-instrumente.pentru.raport').clone()
        .appendTo(Raport.$)
        .on('click', '.salvează', Raport.salvează)
        .on('click', '.imprimă', Raport.imprimă);
    },

    anunţăSalvarea: function() {
      var mesaj = Raport.$.find('.bara-de-instrumente .salvează+.mesaj');

      mesaj.addClass('afişat');
      setTimeout(function() {mesaj.removeClass('afişat')}, 1000);
      opener.Formular.salvează();
    }
  },

  închide: function() {
    opener.Rapoarte[Raport.pagina].tab.close();
  }
};

window.onload = Raport.init;
