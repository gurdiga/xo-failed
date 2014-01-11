(function() {
  'use strict';

  var app = window.frames['app'];

  module('AdaugaSuma');

  test('link', function() {
    var link = app.App.module.D.AdaugaSuma.module.link,
        sincronnizat = false;

    var scope = {
      lista: [],
      $apply: function() { sincronnizat = true; }
    };

    var el = app.$('<div/>');

    link(scope, el);
    el.trigger('click');

    equal(scope.lista.length, 1, 'adaugat un item in listă');
    ok(scope.lista[0].adaugare, 'flag de adăugare setat pe item');
    ok(sincronnizat, 'sincronizat');
  });

})();
