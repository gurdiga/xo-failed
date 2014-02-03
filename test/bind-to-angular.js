(function() {
  'use strict';

  describe('Binding to Angular', function() {
    describe('application module', function() {
      beforeEach(function() {
        sinon.spy(angular, 'module');
      });

      afterEach(function() {
        angular.module.restore();
      });

      it('is created with the appropriate dependencies', function() {
        XO.bindToAngular(angular);

        expect(angular.module.calledWith('App', ['ngRoute', 'firebase']));
      });
    });


    describe('module binding', function() {
      var serviceModules = [
        'Data'
      ];

      var constants = [
        'config'
      ];

      var angularModule;

      beforeEach(function() {
        angularModule = {
          constant: sinon.spy(),
          service: sinon.spy()
        };

        sinon.stub(angular, 'module', function() {
          return angularModule;
        });
      });

      afterEach(function() {
        angular.module.restore();
      });


      describe('constants', function() {
        it('binds them', function() {
          XO.bindToAngular(angular);

          constants.forEach(function(constant) {
            expect(angularModule.constant).to.have.been.calledWith(constant, XO[constant]);
          });
        });
      });


      describe('services', function() {
        it('binds them', function() {
          XO.bindToAngular(angular);

          serviceModules.forEach(function(service) {
            expect(angularModule.service).to.have.been.calledWith(service, XO[service]);
          });
        });
      });

    });
  });
}());
