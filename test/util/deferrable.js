(function() {
  'use strict';

  describe('XO.Deferrable', function() {
    describe('.create()', function() {
      it('returns a deferrable object', function() {
        var deferred = XO.Deferrable.create();

        expect(deferred.resolve).to.be.a('function');
        expect(deferred.reject ).to.be.a('function');
        expect(deferred.promise).to.be.an('object');

        var promise = deferred.promise;

        expect(promise.then).to.be.a('function');
        expect(promise.catch).to.be.a('function');
        expect(promise.finally).to.be.a('function');
      });
    });
  });

}());
