test('General', function() {
  'use strict';

  var app = this.app;

  ok(app.$('#conţinut').există(), '#conţinut');
  equal(app.location.protocol, 'https:', 'HTTPS');

  var file = app.$('#crează-procedură li[data-href]');

  ok(file.is(':visible'), 'visibile');
  equal(file.length, 3, 'găsit 3 file pentru proceduri noi');
});
