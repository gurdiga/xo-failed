(function() {
  'use strict';

  var app = window.frames['app'];

  module('Unit: AcţiuneProcedurală', {
    setup: function() {
      this.$script = app.$(
        '<script type="text/x-fragment" id="acţiune-procedurală-identificator-acţiune">' +
          '<tr acţiune="intentare">' +
            '<td>' +
              '<p class="descriere">intentarea procedurii de executare</p>' +
            '</td>' +
          '</tr>' +
        '</script>'
      ).appendTo(app.document.body);

      this.acţiune = new app.AcţiuneProcedurală('identificator-acţiune');
    },

    teardown: function() {
      this.$script.remove();
    }
  });


  test('#constructor()', function() {
    ok('AcţiuneProcedurală' in app, 'definit');
    ok($.isFunction(app.AcţiuneProcedurală), '…funcţie');
    equal(app.AcţiuneProcedurală.length, 1, '…necesită un parametru');
  });


  test('#propunere()', function() {
    ok('propunere' in this.acţiune, 'definit');
    ok($.isFunction(this.acţiune.propunere), '…funcţie');
    equal(this.acţiune.propunere.length, 0, '…fără parametri');

    var $propunere = app.$(this.acţiune.propunere());

    ok($propunere.is('.propunere'), '$rezultatul e .propunere');
    ok($propunere.is(':contains("intentarea procedurii de executare")'), '…şi conţine descrierea acţiunii');
    equal($propunere.data('identificator'), 'identificator-acţiune', '…şi data-identificator corespunde');
  });


  test('#adaugăLa()', function() {
    ok('adaugăLa' in this.acţiune, 'definit');
    ok($.isFunction(this.acţiune.adaugăLa), '…funcţie');
    equal(this.acţiune.adaugăLa.length, 1, '…cu un parametru');

    var $container = app.$('<div/>');

    var $script = app.$('<script type="text/x-fragment" id="acţiune-procedurală-identificator">' +
      '<div id="identificator"/>' +
    '</script>').appendTo(app.document.body);

    var acţiune = new app.AcţiuneProcedurală('identificator');

    acţiune.adaugăLa($container);
    ok($container.find('div#identificator').există(), '…adaugă HTML-ul acţiunii la containerul parametru');

    $script.remove();
  });


  test('.există()', function() {
    ok('există' in app.AcţiuneProcedurală, 'definit');
    ok($.isFunction(app.AcţiuneProcedurală.există), '…funcţie');
    equal(app.AcţiuneProcedurală.există.length, 1, '…necesită 1 parametru');

    var $script = app.$('<script type="text/x-fragment" id="acţiune-procedurală-identificator">…</script>');

    ok(!app.AcţiuneProcedurală.există('identificator'), 'dacă nu există întoarce false');
    $script.appendTo(app.document.body);
    ok(app.AcţiuneProcedurală.există('identificator'), 'dacă există întoarce true');

    $script.remove();
  });

})();
