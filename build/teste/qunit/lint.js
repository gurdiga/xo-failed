(function () {
  'use strict';

  var JSHINT_OPTIONS = {
    bitwise: true,
    camelcase: true,
    eqeqeq: true,
    immed: true,
    indent: 2,
    latedef: true,
    noarg: true,
    noempty: true,
    nonew: true,
    quotmark: true,
    undef: true,
    unused: true,
    strict: true,
    trailing: true,
    maxparams: 3,
    maxdepth: 4,
    maxstatements: 30,
    maxcomplexity: 4,
    maxlen: 120,
    sub: true
  };

  var JSHINT_GLOBALS = {
    module: false,
    start: false,
    test: false,
    asyncTest: false,
    equal: false,
    ok: false,
    jsHintTest: false,
    document: false,
    window: false,
    location: true,
    $: false,
    setTimeout: false,
    setInterval: false,
    opener: false,
    history: false
  };

  var scripts = document.querySelectorAll('script:not(.dont-lint)'), script, i, l;

  module('Linting');

  for (i = 0, l = scripts.length; i < l; i ++) {
    script = scripts[i].getAttribute('src');
    jsHintTest(script, script, JSHINT_OPTIONS, JSHINT_GLOBALS);
  }

  module();
})();
