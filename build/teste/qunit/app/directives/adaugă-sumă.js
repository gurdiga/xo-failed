(function() {
  'use strict';

  var app = window.frames['app'];


  test('AdaugăSumă.link', function() {
    var scope = {
      lista: [],
      $apply: function() {
        sincronizatScop = true;
      }
    };

    var el = app.$('<div/>'),
        l = scope.lista.length,
        sincronizatScop = false;

    app.App.Directives.AdaugăSumă.link(scope, el);
    el.click();

    equal(scope.lista.length, l + 1, 'adăugat 1 item lista colecţie');
    ok(sincronizatScop, 'sincronizat scop');

    var item = app._.last(scope.lista);

    equal(item.adăugare, true, 'flagul de adăugare ete prezent');
  });

})();
