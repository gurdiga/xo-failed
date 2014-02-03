(function() {
  'use strict';

  describe('Data', function() {
    var Data, config, $q, $firebase, Firebase, Utilizator;

    beforeEach(function() {
      function MockFirebase() {
        this.on = function() {};
      }

      Data = new XO.Data(
        config     = XO.config,
        $q         = injector.get('$q'),
        $firebase  = injector.get('$firebase'),
        Firebase   = MockFirebase,
        Utilizator = injector.get('Utilizator')
      );
    });


    describe('.get', function() {
      var returnValue;

      beforeEach(function() {
        returnValue = Data.get('profile');
      });

/*

Data.get(type, id)
  .then(successCallback, failureCallback);

Have Data.getProfile(), and Data.getCases(), and Data.getCase(), etc.?

This would have to call a Executor.ensureLoggedIn().then(getData), so
we’re going to implemente that class first.

*/

      it('returns a promise', function() {
        expect(returnValue).to.have.a.property('then').that.is.a('function');
        // sinon.stub(global, "Firebase").returns({on: sinon.spy()});
      });

    });

  });
}());
