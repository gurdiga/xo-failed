(function() {
  'use strict';

  describe('XO.Logger', function() {
    it('is an alias for Angular’s $log service', function() {
      expect(XO.Logger).to.have.property('debug').that.is.a('function');
      expect(XO.Logger).to.have.property('error').that.is.a('function');
      expect(XO.Logger).to.have.property('info').that.is.a('function');
      expect(XO.Logger).to.have.property('log').that.is.a('function');
    });
  });

}());
