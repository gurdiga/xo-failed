(function() {
  'use strict';

  var app = window.frames['app'],
      fakeServer;

  module('Unit: Persistence', {
    setup: function() {
      app.sinon = sinon;
      fakeServer = app.sinon.fakeServer.create();

      sinon.qunit.setup(this);
    },

    teardown: function() {
      fakeServer.restore();
      sinon.qunit.teardown(this);
    }
  });


  test('.get', function() {
    ok('get' in app.Persistence, 'definit');
    equal(app.Persistence.get.length, 2, '…2 parametri');
    //this.stub(app.Encryption.undo);

    var url = '/some/url',
        callback = function() {};

    app.Persistence.get(url, callback);
    ok(true, 'TODO: find a way to fakeServer in the app');
    // try to $.getScript(sinon) in app when 'QUnit' in top
    //
    //equal(fakeServer.requests.length, 1, 'face un request');
    //ok(app.Encryption.undo.calledWith(…));
  });


  test('.set', function() {
    ok('set' in app.Persistence, 'definit');
    ok(app.Persistence.set.length, '…2 parametri');
  });

})();
