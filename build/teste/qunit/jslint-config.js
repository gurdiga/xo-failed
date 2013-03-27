(function () {
  'use strict';

  var SCRIPTS = [
    'jslint-config.js',
    'csslint-config.js',
    '/js/action.js',
    '/js/încheiere.js',
    '/js/indexer.js',

    'unit/încheiere.js',
    'unit/action-persoane.js',
    'unit/action-hash-controller.js',
    'unit/action-textarea-elastice.js',
    'unit/action-selecturi-foarte-late.js',

    'integrare/calculator-dobînzi.js',
    'integrare/profil.js',
    'integrare/init.js',
    'integrare/general.js',
    'integrare/iniţializare-formular.js',
    'integrare/localizare-cîmpuri-şi-secţiuni.js',
    'integrare/verificare-valori-implicite.js',
    'integrare/verificare-cîmpuri-şi-onorariu.js',
    'integrare/verificare-obiectul-urmăririi.js',
    'integrare/cheltuieli.js',
    'integrare/cheltuieli-populare.js',
    'integrare/salvare-procedură.js',

    'integrare/formulare-încheieri/utilitare.js',
    'integrare/formulare-încheieri/încheiere-de-intentare.js',
    'integrare/formulare-încheieri/încheiere-de-intentare-şi-aplicarea-măsurilor-de-asigurare-a-acţiunii.js',
    'integrare/formulare-încheieri/borderou-de-calcul.js',
    'integrare/formulare-încheieri/încheierile-referitoare-la-obiectul-urmăririi.js',
    'integrare/formulare-încheieri/încheiere-de-evacuare.js',
    'integrare/formulare-încheieri/încheiere-de-instalare.js',
    'integrare/formulare-încheieri/încheiere-de-schimb-forţat.js',
    'integrare/formulare-încheieri/încheiere-de-stabilire-a-domiciliului-copilului.js',
    'integrare/formulare-încheieri/încheiere-de-efectuare-a-unor-acţiuni-nelegate-de-bunuri.js',
    'integrare/formulare-încheieri/încheiere-de-efectuare-a-unor-acţiuni-legate-de-bunuri-mobile.js',
    'integrare/formulare-încheieri/încheiere-de-efectuare-a-unor-acţiuni-legate-de-bunuri-imobile.js',
    'integrare/formulare-încheieri/încheiere-de-confiscare-a-bunurilor.js',
    'integrare/formulare-încheieri/încheiere-de-nimicire-a-bunurilor.js',
    'integrare/formulare-încheieri/încheiere-de-restabilire-la-locul-de-muncă.js',
    'integrare/formulare-încheieri/încheiere-privind-aplicarea-măsurilor-de-asigurare-a-acţiunii.js',

    'integrare/căutare-procedură.js',

    '/formulare-încheieri/borderou-de-calcul.părţi/script.js',
    '/formulare-încheieri/încheiere-dobîndă-de-întîrziere.părţi/script.js',
    '/formulare-încheieri/încheiere-de-intentare.părţi/script.js',
    '/formulare-încheieri/încheiere-de-intentare-şi-aplicarea-măsurilor-de-asigurare-a-acţiunii.părţi/script.js',
    '/formulare-încheieri/anexă-dobîndă-de-întîrziere.părţi/script.js',
    '/formulare-încheieri/încheiere-de-evacuare.părţi/script.js',
    '/formulare-încheieri/încheiere-de-instalare.părţi/script.js',
    '/formulare-încheieri/încheiere-de-schimb-forţat.părţi/script.js',
    '/formulare-încheieri/încheiere-de-stabilire-a-domiciliului-copilului.părţi/script.js',
    '/formulare-încheieri/încheiere-de-efectuare-a-unor-acţiuni-nelegate-de-bunuri.părţi/script.js',
    '/formulare-încheieri/încheiere-de-efectuare-a-unor-acţiuni-legate-de-bunuri-mobile.părţi/script.js',
    '/formulare-încheieri/încheiere-de-efectuare-a-unor-acţiuni-legate-de-bunuri-imobile.părţi/script.js',
    '/formulare-încheieri/încheiere-de-confiscare-a-bunurilor.părţi/script.js',
    '/formulare-încheieri/încheiere-de-nimicire-a-bunurilor.părţi/script.js',
    '/formulare-încheieri/încheiere-de-restabilire-la-locul-de-muncă.părţi/script.js',
    '/formulare-încheieri/încheiere-privind-aplicarea-măsurilor-de-asigurare-a-acţiunii.părţi/script.js'
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
    deepEqual: false,
    ok: false,
    jsHintTest: false,
    document: false,
    window: false,
    location: true,
    $: false,
    setTimeout: false,
    clearTimeout: false,
    setInterval: false,
    history: false
  };

  var script, i, l;

  module('JSHint');

  for (i = 0, l = SCRIPTS.length; i < l; i ++) {
    script = SCRIPTS[i];
    jsHintTest(script, script + '?' + (new Date()).getTime(), JSHINT_OPTIONS, JSHINT_GLOBALS);
  }

})();
