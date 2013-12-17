(function() {
  'use strict';

  var app = window.frames['app'];

  module('D.Incheiere', {
    setup: function() {
      this.$injector = app.angular.injector(['App']);
    }
  });


  test('.controller', function() {
    var controller = app.App.module.D.Incheiere.controller,
        Storage = this.$injector.get('Storage'),
        $element = app.angular.element();

    var $scope = {
      date: {},
      procedura: {},
      actiune: {},
      $watch: sinon.spy()
    };

    controller($scope, $element, Storage);
    ok(app.js.isFunction($scope.date.href), 'defineşte href()');
    ok(app.js.isFunction($scope.date.formular), 'defineşte href()');

    ok($scope.$watch.called, 'urmareste schimbarile flagului de achitare');
    equal($scope.$watch.getCall(0).args[0], 'date.achitat', 'da');
  });


  test('.href(Storage, procedura, actiune, document): verificarea parametrilor', function() {
    var href = app.App.module.D.Incheiere.href;

    throws(function() {
      href();
    }, /primul parametru trebuie să fie S.Storage/, 'Storage');

    throws(function() {
      href({});
    }, /al doilea parametru trebuie să fie procedura/, 'procedura');

    throws(function() {
      href({}, {});
    }, /al treilea parametru trebuie să fie acţiunea/, 'actiune');

    throws(function() {
      href({}, {}, {});
    }, /al patrulea parametru trebuie să fie documentul/, 'document');
  });


  test('.href(Storage, procedura, actiune, document)', function() {
    var Storage = this.$injector.get('Storage'),
        procedura = {'numărul': 33},
        actiune = {'identificator': 'intentare'},
        document = {'denumire': 'încheiere'};

    var href = app.App.module.D.Incheiere.href(Storage, procedura, actiune, document),
        expected = Storage.PREFIX + 'proceduri/' + procedura['numărul'] + '/actiuni/' + actiune.identificator + '/' + document.denumire + '.html';

    ok(app.js.isFunction(href), 'e funcţie ca să nu se persiste');
    equal(href(), expected, 'întoarce valoarea corectă');

    delete procedura['numărul'];
    equal(href(), '', 'pentru procedurile noi nu se generează href');
  });


  test('.formular(actiune): verificarea parametrilor', function() {
    var formular = app.App.module.D.Incheiere.formular;

    throws(function() {
      formular();
    }, /primul parametru trebuie să fie acţiunea/, 'actiunea');
  });


  test('.formular(actiune)', function() {
    var actiune = {identificator: 'intentare'},
        formular = app.App.module.D.Incheiere.formular(actiune);

    ok(app.js.isFunction(formular), 'e funcţie ca să nu se persiste');
    //ok(app._.contains(formular(), actiune.identificator), 'include identificatorul actiunii');
    ok(app._.contains(formular(), '/incheiere.html'), 'include identificatorul actiunii');
  });


  test('.defaults(actiune): verificarea parametrilor', function() {
    var defaults = app.App.module.D.Incheiere.defaults;

    throws(function() {
      defaults();
    }, /primul parametru trebuie să fie acţiunea/, 'acţiunea');
  });


  test('.defaults(actiune)', function() {
    var returnValue = app.App.module.D.Incheiere.defaults({});

    ok(app.js.isPlainObject(returnValue), 'întoarce PlainObject');
    ok('taxa' in returnValue, 'rezultatul conţine taxa');
  });

})();
