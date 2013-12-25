(function() {
  'use strict';

  var app = window.frames['app'];

  module('D.Incheiere', {

    setup: function() {
      this.$injector = app.angular.injector(['App']);
      this.$compile = this.$injector.get('$compile');

      this.$scope = this.$injector.get('$rootScope');

      this.Incheiere = this.$injector.get('Incheiere');
      sinon.stub(this.Incheiere, 'deschide');

      this.el = app.angular.element(
        '<incheiere procedura="procedura" actiune="actiune" date="date">' +
          '<span class="document"></span>' +
        '</incheiere>'
      );

      this.scopeData = {
        procedura: {},
        actiune: {},
        date: {}
      };

      app.js.extend(this.$scope, this.scopeData);
    },


    teardown: function() {
      this.Incheiere.deschide.restore();
    }

  });


  test('click .document', function() {
    this.$compile(this.el)(this.$scope);
    this.$scope.$digest();

    var $document = app.$(this.el).find('.document');

    $document.click();
    ok(this.Incheiere.deschide.called, 'la click pe .document se deschide incheierea');
    deepEqual(
      Object.keys(this.Incheiere.deschide.getCall(0).args[0]),
      Object.keys(this.scopeData),
      '…şi se transmit datele de pe $scope'
    );
  });


  test('atribute .document: pentru o procedură salvată', function() {
    this.$scope.procedura['numărul'] = '1';

    this.$compile(this.el)(this.$scope);
    this.$scope.$digest();

    var $document = app.$(this.el).find('.document');

    ok($document.attr('formular'), 'setează atributul “formular” pe .document');
    ok($document.attr('href'), 'setează atributul “href” pe .document');
  });


  test('atribute .document: pentru o procedură nouă', function() {
    delete this.$scope.procedura['numărul'];

    this.$compile(this.el)(this.$scope);
    this.$scope.$digest();

    var $document = app.$(this.el).find('.document');

    ok($document.attr('formular'), 'setează atributul “formular” pe .document');
    ok(!$document.attr('href'), 'NU setează atributul “href” pe .document');
  });

})();
