(function() {
  'use strict';

  var app = window.frames['app'];


  test('FocuseazăLaAdăugare', function() {
    var directiva = app.App.Directives.FocuseazăLaAdăugare;

    equal(directiva.restrict, 'A', 'se limitează la atribute');
  });


  test('FocuseazăLaAdăugare.link', function() {
    var scope = {
      $last: true,
      suma: {
        adăugare: true,
        alte: 'date'
      }
    };

    var element = app.$(
      '<li>' +
        '<textarea></textarea>' +
        '<input/>' +
      '</li>'
    );

    app.App.Directives.FocuseazăLaAdăugare.link(scope, element);
    ok(element.find(':input:first').is('.test-focusat'), 'focusat primul :input');
  });

})();

