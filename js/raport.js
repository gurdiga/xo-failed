var Raport = {
  init: function() {
    Raport.pagina = decodeURIComponent(location.pathname);

    if (!opener || !opener.Rapoarte[Raport.pagina]) {
      window.close();
      return;
    }

    Raport.$ = opener.$(document.body);

    Raport.compilează();
    Raport.butonDeÎnchidere.init();
    Raport.baraDeInstrumente.init();

    Raport.$.find('.editabil').attr('contenteditable', true);

    //var originalLocation = location.href;
    //history.replaceState(null, null, '/' + opener.Utilizator.login + context.procedură.număr + '/text-personalizabil-text-personalizabil');
  },

  compilează: function() {
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

    if (window.init) window.init(Raport.context);

    opener.compile(Raport.context, document);
  },

  baraDeInstrumente: {
    init: function() {
      opener.$şabloane.find('.bara-de-instrumente.pentru.raport').clone()
        .appendTo(Raport.$)
        .on('click', '.salvează', Raport.salvează)
        .on('click', '.imprimă', Raport.imprimă)
    }
  },

  salvează: function() {
    var cale = '/date/' + opener.Utilizator.login + '/rapoarte/',
        fişier = document.title + '.html',// TODO + Raport.context.întîrziere,
        conţinut = '';

    conţinut = '<!doctype html>' +
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

    opener.$.post(cale + fişier, conţinut, function() {
      var mesaj = Raport.$.find('.bara-de-instrumente .salvează+.mesaj');

      mesaj.addClass('afişat');

      setTimeout(function() {
        mesaj.removeClass('afişat');
      }, 1000);
    });
  },

  imprimă: function() {
    Raport.salvează();
    window.print();
  },

  butonDeÎnchidere: {
    init: function() {
      opener.Formular.$.find('button.închide').clone()
        .appendTo(Raport.$)
        .on('click', Raport.închide);
    }
  },

  închide: function() {
    opener.Rapoarte[Raport.pagina].tab.close();
  }
};

window.onload = Raport.init;
