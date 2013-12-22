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


    test('.defaults(actiune): verificarea parametrilor', function() {
      var defaults = app.App.module.S.Incheiere.defaults;

      throws(function() {
        defaults();
      }, /primul parametru trebuie să fie acţiunea/, 'acţiunea');
    });


    test('.defaults(actiune)', function() {
      var returnValue = app.App.module.S.Incheiere.defaults({});

      ok(app.js.isPlainObject(returnValue), 'întoarce PlainObject');
      ok('identificator' in returnValue, 'rezultatul conţine identificator');
    });

  })();

})();
