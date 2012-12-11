(function () {
  'use strict';

  var SCRIPTS = [
    'jslint-config.js',
    'csslint-config.js',
    '/js/action.js',
    '/js/încheiere.js',
    '/js/indexer.js',
    'integrare/profil.js',
    'integrare/init.js',
    'integrare/general.js',
    'integrare/iniţializare-formular.js',
    'integrare/localizare-cîmpuri-şi-secţiuni.js',
    'integrare/verificare-valori-implicite.js',
    'integrare/verificare-cîmpuri-şi-onorariu.js',
    'integrare/salvare-procedură.js',
    'integrare/verifică-încheiere-de-intentare.js',
    'integrare/verifică-borderou-de-calcul.js',
    'integrare/căutare-procedură.js',
    '/formulare/borderou-de-calcul.părţi/script.js',
    '/formulare/încheiere-dobîndă-de-întîrziere.părţi/script.js',
    '/formulare/încheiere-de-intentare.părţi/script.js',
    '/formulare/anexă-dobîndă-de-întîrziere.părţi/script.js'
  ];

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
    QUnit: false,
    module: false,
    start: false,
    stop: false,
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
    clearTimeout: false,
    setInterval: false,
    opener: false,
    history: false
  };

  var script, i, l;

  module('JSHint');

  for (i = 0, l = SCRIPTS.length; i < l; i ++) {
    script = SCRIPTS[i];
    jsHintTest(script, script + '?' + (new Date()).getTime(), JSHINT_OPTIONS, JSHINT_GLOBALS);
  }

})();
