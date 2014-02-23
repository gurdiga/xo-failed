(function() {
  'use strict';

  chai.Assertion.addMethod('implement', function(expectedInterface) {
    var module = this._obj;

    Object.keys(expectedInterface).forEach(function(functionName) {
      new chai.Assertion(module).to.have.property(functionName).that.is.a('function');
      new chai.Assertion(module[functionName].length).to.equal(expectedInterface[functionName].length,
        functionName + '’s argument count corresponds');
    });
  });

}());
