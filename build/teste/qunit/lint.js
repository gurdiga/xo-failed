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
    regexp: true,
    undef: true,
    unused: true,
    strict: true,
    trailing: true,
    maxparams: 3,
    maxdepth: 4,
    maxstatements: 20,
    maxcomplexity: 4,
    maxlen: 100
  };

  var JSHINT_GLOBALS = {
    module: false,
    test: false,
    equal: false,
    ok: false,
    jsHintTest: false,
    document: false
  };

  var skipLint = 'qunit-1.10.0.js jshint.js qhint.js'.split(' '),
      selector = 'script', i, l;

  for (i = 0, l = skipLint.length; i < l; i++) {
    selector += ':not([src="' + skipLint[i] + '"])';
  }

  var scripts = document.querySelectorAll(selector), script;

  module('Linting');

  for (i = 0, l = scripts.length; i < l; i ++) {
    script = scripts[i].getAttribute('src');
    jsHintTest(script, script, JSHINT_OPTIONS, JSHINT_GLOBALS);
  }

  module();
})();
