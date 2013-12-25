(function() {
  'use strict';

  var app = window.frames['app'];

  module('S.Incheiere', {
    setup: function() {
      this.$injector = app.angular.injector(['App']);
      this.Incheiere = this.$injector.get('Incheiere');
    }
  });


  test('.deschide', function() {
    ok('deschide' in this.Incheiere, 'există');
  });


  test('.defaults(actiune): verificarea parametrilor', function() {
    var defaults = this.Incheiere.defaults;

    throws(function() {
      defaults();
    }, /primul parametru trebuie să fie acţiunea/, 'acţiunea');
  });


  test('.defaults(actiune)', function() {
    var returnValue = this.Incheiere.defaults({});

    ok(app.js.isPlainObject(returnValue), 'întoarce PlainObject');
    ok('identificator' in returnValue, 'rezultatul conţine identificator');
  });


  test('.href(procedura, actiune, document)', function() {
    var Storage = this.$injector.get('Storage'),
        procedura = {'numărul': 33},
        actiune = {'identificator': 'intentare'},
        document = {'denumire': 'încheiere'};

    var href = this.Incheiere.href(procedura, actiune, document),
        expected = Storage.PREFIX + 'proceduri/' + procedura['numărul'] + '/actiuni/' + actiune.identificator + '/' + document.denumire + '.html';

    equal(href, expected, 'are valoarea corectă');

    delete procedura['numărul'];
    href = this.Incheiere.href(procedura, actiune, document);
    equal(href, '', 'procedurile noi nu au href');
  });


  test('.formular(actiune): verificarea parametrilor', function() {
    var formular = this.Incheiere.formular;

    throws(function() {
      formular();
    }, /primul parametru trebuie să fie acţiunea/, 'actiunea');
  });


  test('.formular(actiune)', function() {
    var actiune = {identificator: 'intentare'},
        formular = this.Incheiere.formular(actiune);

    //ok(app._.contains(formular(), actiune.identificator), 'include identificatorul actiunii');
    ok(app._.contains(formular, '/incheiere.html'), 'include identificatorul actiunii');
  });


  test('.sincronizeazaCimpulPentruData', function() {
    var sincronizeazaCimpulPentruData = this.Incheiere.sincronizeazaCimpulPentruData,
        date = {},
        isChecked = true;

    var dataCurenta = app.moment().format(app.FORMATUL_DATEI);

    sincronizeazaCimpulPentruData(date, isChecked);
    equal(date['data-achitării'], dataCurenta, 'setează date["data-achitării"] = data curentă');

    isChecked = false;
    date = {};
    sincronizeazaCimpulPentruData(date, isChecked);
    ok(!('data-achitării' in date), 'nu setează date["data-achitării"]');
  });

})();
