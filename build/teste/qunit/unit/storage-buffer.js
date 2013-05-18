(function () {
  'use strict';

  var app = window.frames['app'];


  module('Unit: AjaxBuffer');

  test('API', function () {
    var AjaxBuffer = app.AjaxBuffer,
        url = '/some/url',
        data = {some: 'object'};

    ok(typeof AjaxBuffer !== 'undefined', 'AjaxBuffer e definit');
    ok('put' in AjaxBuffer, 'avem AjaxBuffer.put');
    ok('get' in AjaxBuffer, 'avem AjaxBuffer.get');

    AjaxBuffer.put(url, data);
    equal(
        JSON.stringify(AjaxBuffer.get(url)),
        JSON.stringify(data),
        'AjaxBuffer.get îmi dă valoarea stocată cu AjaxBuffer.put'
    );

  });

})();
