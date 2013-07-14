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


  test('#extrageDescriere()', function() {
    ok('extrageDescriere' in this.acţiune, 'definit');
    ok($.isFunction(this.acţiune.extrageDescriere), '…funcţie');
    equal(this.acţiune.extrageDescriere.length, 0, '…fără parametri');

    equal(this.acţiune.extrageDescriere(), 'intentarea procedurii de executare',
      '…extrage descrierea din fragment');
  });


  test('#adaugă()', function() {
    ok('adaugă' in this.acţiune, 'definit');
    ok($.isFunction(this.acţiune.adaugă), '…funcţie');
    equal(this.acţiune.adaugă.length, 0, '…fără parametri');

    var $Original = app.AcţiuniProcedurale.$;

    app.AcţiuniProcedurale.$ = app.$('<table/>');

    this.acţiune.adaugă();
    ok(app.AcţiuniProcedurale.$.find('[acţiune="intentare"]').există(),
      'adaugă acţiunea în lista');

    app.AcţiuniProcedurale.$ = $Original;
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
