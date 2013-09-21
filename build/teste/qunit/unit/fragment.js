(function() {
  'use strict';

  var app = window.frames['app'];

  module('Unit: Fragment', {
    setup: function() {
      var identificator = 'test-fragment-constructor';

      this.tag = app.$(
        '<script type="text/x-fragment" id="' + identificator + '">' +
          '<div>{{descriere}}</div>' +
        '</script>'
      ).appendTo(app.document.body);

      this.fragment = new app.Fragment(identificator);
    },

    teardown: function() {
      this.tag.remove();
    }
  });


  test('#constructor', function() {
    ok('Fragment' in app, 'definit');
    ok($.isFunction(app.Fragment), '…funcţie');
    equal(app.Fragment.length, 1, '…acceptă un parametru');

    var mesaj = 'generează eroare dacă parametrul lipseşte';

    try {
      /*jshint nonew: false*/
      new app.Fragment();
      ok(false, mesaj);
    } catch(e) {
      ok(true, mesaj);
    }

    mesaj = 'generează eroare dacă nu găseşte fragmentul după ID';

    try {
      /*jshint nonew: false*/
      new app.Fragment('identificator-fragment-inexistent');
      ok(false, mesaj);
    } catch(e) {
      ok(true, mesaj);
    }
  });


  test('#html', function() {
    ok('html' in this.fragment, 'definit');
    equal(this.fragment.html, this.tag.html(), '…stochează HTML-ul fragmentului');
  });


  test('#compilează', function() {
    ok('compilează' in this.fragment, 'definit');
    ok($.isFunction(this.fragment.compilează), '…funcţie');
    equal(this.fragment.compilează.length, 1, '…cu un parametru: datele');
    equal(this.fragment.compilează({descriere: 'testare fragment'}), '<div>testare fragment</div>',
      'completează datele în fragment şi întoarce HTML-ul');


    var identificator = 'test-fragment-date-adăugătoare';

    var tag = app.$(
      '<script type="text/x-fragment" id="' + identificator + '">' +
        '<div data-adăugător="ceva date adăugătoare">{{adăugător}}</div>' +
      '</script>'
    ).appendTo(app.document.body);

    var fragment = new app.Fragment(identificator);

    equal(fragment.compilează({descriere: 'testare fragment'}), '<div data-adăugător="ceva date adăugătoare">ceva date adăugătoare</div>',
      '…ţine cont de datele adăugătoare de pe element');

    tag.remove();
  });


  test('.există', function() {
    ok('există' in app.Fragment, 'definit');
    ok($.isFunction(app.Fragment.există), '…funcţie');
    equal(app.Fragment.există.length, 1, '…necesită un parametru');

    var identificatorFragment = 'test-Fragment-există',
        $script = app.$('<script type="text/x-fragment" id="' + identificatorFragment + '"></script>');

    ok(!app.Fragment.există(identificatorFragment), 'întoarce false dacă nu există fragmentul cu ID-ul respectiv');
    $script.appendTo(app.document.body);
    ok(app.Fragment.există(identificatorFragment), 'întoarce true dacă există fragmentul cu ID-ul respectiv');

    $script.remove();
  });

})();
