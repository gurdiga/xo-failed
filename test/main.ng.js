(function() {
  'use strict';

  describe('Main partition: Angular app module', function() {
    var XO;

    beforeEach(function() {
      XO = angular.module('XO');
    });


    it('is defined with name “XO”', function() {
      expect(XO).to.have.property('name').that.equals('XO');
    });

    it('includes ngRoute', function() {
      expect(function() {
        XO.config(function($routeProvider) {
          /*jshint unused:false */
        });
      }).not.to.throw();
    });

  });

}());
