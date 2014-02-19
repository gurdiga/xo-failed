(function() {
  'use strict';

  describe('Angular.main()', function() {
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

    it('includes firebase', function() {
      expect(function() {
        XO.run(function($firebase) {
          /*jshint unused:false */
        });
      }).not.to.throw();
    });

  });

}());
