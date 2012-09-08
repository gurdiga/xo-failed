var Raport = {
  init: function() {
    Raport.$ = opener.$(document.body);
    Raport.pagina = decodeURIComponent(location.pathname);

    Raport.compilează();
    Raport.butonDeÎnchidere.init();
    Raport.baraDeInstrumente.init();

    Raport.$.find('.editabil').attr('contenteditable', true);

    //var originalLocation = location.href;
    //history.replaceState(null, null, '/' + opener.Utilizator.login + context.procedură.număr + '/text-personalizabil-text-personalizabil');
  },

  compilează: function() {
    var context = {
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

    if (window.init) window.init(context);

    opener.compile(context, document);
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
    console.log('TODO: post');
  },

  imprimă: function() {
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
