(function() {
  'use strict';

  var app = window.frames['app'];

  module('FocuseazaLaAdaugare');


  test('meta', function() {
    var directiva = app.App.module.D.FocuseazaLaAdaugare();

    equal(directiva.restrict, 'A', 'se limitează la atribute');
  });


  test('link', function() {
    var link = app.App.module.D.FocuseazaLaAdaugare.module.link;

    var scope = {
      $last: true,
      suma: {
        adaugare: true,
        alte: 'date'
      }
    };

    var element = app.$(
      '<li>' +
        '<textarea></textarea>' +
        '<input/>' +
      '</li>'
    );

    link(scope, element);
    ok(element.find(':input:first').is('.test-focusat'), 'focusat primul :input');
  });

})();

