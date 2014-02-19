(function() {
  'use strict';

  describe('XO.DataService module', function() {
    it('defines the getProfile function', function() {
      expect(XO.DataService).to.have.property('getProfile').that.is.a('function');
      expect(XO.DataService.getProfile.length).to.equal(1);
    });
  });

}());
