asyncTest('Init', function () {
  'use strict';

  $('#app').one('load', function () {
    var app = window.frames['app'];

    ok(app.$('#conţinut').există(), '#conţinut');
    equal(location.protocol, 'https:', 'HTTPS');

    start();
  }).attr('src', 'https://dev.executori.org/').show();
});
