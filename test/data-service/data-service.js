(function() {
  'use strict';

  describe('XO.DataService module', function() {
    it('defines the getReference function', function() {
      expect(XO.DataService).to.have.property('getReference').that.is.a('function');
    });
  });

}());
