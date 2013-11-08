(function() {
  'use strict';

  var app = window.frames['app'];


  module('AjusteazaTextareaElastic');

  test('meta', function() {
    var directiva = app.App.module.D.AjusteazaTextareaElastic();

    equal(directiva.restrict, 'A', 'se limitează la atribute');
  });


  asyncTest('link', function() {
    var link = app.App.module.D.AjusteazaTextareaElastic.module.link,
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

    link(scope, app.angular.element(fragment.find('li:last')[0]));

    setTimeout(function() {
      equal(evenimenteVenite, evenimenteAşteptate, 'emite un eveniment input pe fiecare textarea.etichetă');
      start();
    }, 0);
  });

})();
