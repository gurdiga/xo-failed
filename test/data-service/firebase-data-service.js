(function() {
  'use strict';

  XO.FirebaseDataService = {
    getReference: function(entityType, id) {
      return id;
    }
  };

  describe('XO.FirebaseDataService', function() {
    var FirebaseDataService;

    beforeEach(function() {
      FirebaseDataService = XO.FirebaseDataService;
    });

    describe('API', function() {
      it('implements XO.DataService', function() {
        Object.keys(XO.DataService).forEach(function(functionName) {
          expect(FirebaseDataService).to.have.property(functionName).that.is.a('function');
          expect(FirebaseDataService[functionName].length).to.equal(XO.DataService[functionName].length,
            functionName + '’s argument count corresponds');
        });
      });
    });


    describe('.get()', function() {
      it('calls things', function() {
        FirebaseDataService.getReference('profil', 'test@executori.org');
        // Regarding the 3-way data binding and creating new thigs: what if the required path doesn’t yet exist?
      });
    });
  });

}());
