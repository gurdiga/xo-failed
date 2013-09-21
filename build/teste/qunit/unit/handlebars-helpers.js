(function() {
  'use strict';

  var app = window.frames['app'];

  module('Unit: HandlebarsHelpers');

  test('.include', function() {
    ok('include' in app.HandlebarsHelpers, 'definit');
    ok('include' in app.Handlebars.helpers, 'înregistrat');

    var identificator = 'test-handlebars-helpers-include';

    var $fragment = $(
      '<script id="' + identificator + '" type="text/x-fragment">' +
        '<div>{{ceva}}</div>' +
      '</script>'
    ).appendTo(app.document.body);

    var rezultat = app.HandlebarsHelpers.include(identificator, { hash: { ceva: 'date' } });

    ok(rezultat instanceof app.Handlebars.SafeString, 'rezultatul e SafeString');
    equal(rezultat.toString(), '<div>date</div>', 'compilează fragmentul respectiv cu datele transmise');

    $fragment.remove();
  });


  test('.include cu bloc', function() {
    var identificator = 'test-handlebars-helpers-include-with-block';

    var $fragment = $(
      '<script id="' + identificator + '" type="text/x-fragment">' +
        '<div>{{ceva}}<div>{{yield}}</div></div>' +
      '</script>'
    ).appendTo(app.document.body);

    var block = app.Handlebars.compile('the block content');

    var rezultat = app.HandlebarsHelpers.include(identificator, {
      hash: { ceva: 'date' },
      fn: block
    });

    ok(rezultat instanceof app.Handlebars.SafeString, 'rezultatul e SafeString');
    equal(rezultat.toString(), '<div>date<div>the block content</div></div>', 'compilează fragmentul respectiv cu datele transmise');

    $fragment.remove();
  });


  test('.include nested cu bloc', function() {
    var identificator = 'test-handlebars-helpers-nested-include-with-block';

    var $fragment = $(
      '<script id="' + identificator + '" type="text/x-fragment">' +
        '<div>{{{yield}}}</div>' +
      '</script>'
    ).appendTo(app.document.body);

    var $partial = $(
      '<script id="test-handlebars-nested-partial" type="text/x-fragment">' +
        '<div>fragment: {{date}}</div>' +
      '</script>'
    ).appendTo(app.document.body);

    var block = app.Handlebars.compile('the block content {{ include "test-handlebars-nested-partial" }}');

    var rezultat = app.HandlebarsHelpers.include(identificator, {
      hash: { date: 'top context' },
      fn: block
    });

    ok(rezultat instanceof app.Handlebars.SafeString, 'rezultatul e SafeString');
    equal(rezultat.toString(), '<div>the block content <div>fragment: top context</div></div>', 'datele se moştenesc de fragmentele incluse');

    $fragment.remove();
    $partial.remove();
  });

})();
