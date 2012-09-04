window.onload = function() {
  var nume = decodeURIComponent(location.pathname.match(/\/([^\/]+).html$/)[1]),
      pagina = decodeURIComponent(location.pathname),
      context = {
        procedură: opener.Formular.colectează(),
        executor: opener.Profil.date,
        moment: opener.moment,
        login: opener.Utilizator.login,
        $el: opener.Rapoarte[pagina].$el,
        nume: function(persoană) {
          return persoană['gen-persoană'] == 'fizică' ? persoană['nume'] : persoană['denumire'];
        },
        id: function(persoană) {
          return persoană['gen-persoană'] == 'fizică' ? ('IDNP ' + persoană['idnp']) : ('IDNO ' + persoană['idno']);
        }
      };

  if (window.init) window.init(context);

  opener.compile(context, this.document);
  opener.$(this.document.body).find('.editabil').attr('contenteditable', true);
  //history.replaceState(null, null, '/' + opener.Utilizator.login + context.procedură.număr + '/text-personalizabil-text-personalizabil');
};
