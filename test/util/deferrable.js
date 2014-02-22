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


    describe('.all()', function() {
      it('runs a series of deferrables and returns a promise resolved when all are resolved', function(done) {
        var d1 = XO.Deferrable.create();
        var d2 = XO.Deferrable.create();
        var d3 = XO.Deferrable.create();

        XO.Deferrable.all([d1.promise, d2.promise, d3.promise])
        .then(function(results) {
          expect(results).to.deep.equal([1, 2, 3]);
          done();
        });

        setTimeout(function() { d1.resolve(1); }, 10);
        setTimeout(function() { d2.resolve(2); }, 5);
        setTimeout(function() { d3.resolve(3); }, 40);
      });
    });

  });

}());
