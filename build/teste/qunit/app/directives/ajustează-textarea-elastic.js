(function() {
  'use strict';

  var app = window.frames['app'];


  test('AjusteazăTextareaElastic', function() {
    var directiva = app.App.Directives.AjusteazăTextareaElastic;

    equal(directiva.restrict, 'A', 'se limitează la atribute');
  });


  asyncTest('AjusteazăTextareaElastic.link', function() {
    var directiva = app.App.Directives.AjusteazăTextareaElastic,
        scope = {$last: true},
        evenimenteAşteptate = 3,
        evenimenteVenite = 0;

    var fragment = app.$(
      '<ul>' +
        '<li ng-repeat="ceva">' +
          '<textarea class="etichetă"></textarea>' +
        '</li>' +
        '<li ng-repeat="ceva">' +
          '<textarea class="etichetă"></textarea>' +
        '</li>' +
        '<li ng-repeat="ceva">' +
          '<textarea class="etichetă"></textarea>' +
        '</li>' +
      '</ul>'
    );

    fragment.on('input', 'textarea.etichetă', function() {
      evenimenteVenite += 1;
    });

    directiva.link(scope, app.angular.element(fragment.find('li:last')[0]));

    setTimeout(function() {
      equal(evenimenteVenite, evenimenteAşteptate, 'emite un eveniment input pe fiecare textarea.etichetă');
      start();
    }, 0);
  });

})();
