(function() {
  'use strict';

  var app = window.frames['app'];

  module('S.Incheiere');

  (function() {
    var Incheiere;

    test('.deschide', function() {
      Incheiere = app.App.module.S.Incheiere;

      ok('deschide' in Incheiere, 'există');
    });

  })();

})();
