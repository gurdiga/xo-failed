(function() {
  'use strict';

  var SCRIPTS = [
    'jshint-config.js',
    'csslint-config.js',
    'qunit-extensions.js',
    '/js/action.js',
    '/js/încheiere.js',
    '/js/indexer.js',
    '/js/lib/sinon-config.js',
    '/js/processors/encrypter.js',

    'unit/încheiere.js',
    'unit/handlebars-helpers.js',
    'unit/action-persoane.js',
    'unit/action-hash-controller.js',
    'unit/action-textarea-elastice.js',
    'unit/action-selecturi-foarte-late.js',
    'unit/storage-buffer.js',
    'unit/action-formular-procedură.js',
    'unit/acţiuni-procedurale.js',
    'unit/acţiune-procedurală.js',
    'unit/fragment.js',
    'unit/formular-procedură.js',
    'unit/encrypter.js',
    'unit/storage.js',

    'app/structuri-date.js',

    'app/procedura/controllers/procedura.js',
    'app/procedura/directives/adauga-suma.js',
    'app/procedura/directives/ajusteaza-textarea-elastic.js',
    'app/procedura/directives/focuseaza-la-adaugare.js',

    '/js/app/init.js',

    '/js/app/util/services/storage.js',
    '/js/app/util/directives/focus-on-check.js',

    '/js/app/utilizator/services/utilizator.js',
    '/js/app/utilizator/controllers/utilizator.js',

    '/js/app/procedura/routing.js',
    '/js/app/procedura/services/procedura.js',
    '/js/app/procedura/controllers/procedura.js',
    '/js/app/procedura/directives/adauga-suma.js',
    '/js/app/procedura/directives/ajusteaza-textarea-elastic.js',
    '/js/app/procedura/directives/focuseaza-la-adaugare.js',
    '/js/app/procedura/directives/persoana.js',
    '/js/app/procedura/directives/sectiune.js',
    '/js/app/procedura/directives/valute.js',

    '/js/app/procedura/actiuni/services/actiuni.js',
    '/js/app/procedura/actiuni/directives/actiune.js',
    '/js/app/procedura/actiuni/directives/propunere-actiune.js',

    '/js/app/handlebars-helpers.js',
    '/js/app/x-jquery.js',
    '/js/app/fragment.js',
    '/js/app/calendar.js',
    '/js/app/acţiune-procedurală.js',
    '/js/app/acţiuni-procedurale.js',
    '/js/app/processor.js',
    '/js/app/encrypter.js',
    '/js/app/ajax-buffer.js',
    '/js/app/storage.js',
    '/js/app/structuri-date.js',
    '/js/app/subsecţiuni-dinamice.js',
    '/js/app/selecturi-foarte-late.js',
    '/js/app/textarea-elastice.js',

    '/js/processors/encrypter.js',
    'unit/processors/encrypter.js',

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
    'integrare/lista-încheieri.js',
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
    'integrare/formulare-încheieri/încheiere-de-continuare.js',
    'integrare/formulare-încheieri/scrisoare-de-însoţire.js',
    'integrare/formulare-încheieri/încheiere-de-asigurare-a-executării-documentului-executoriu.js',
    'integrare/formulare-încheieri/somaţie-cu-privire-la-ieşirea-la-faţa-locului.js',
    'integrare/formulare-încheieri/încheiere-de-dare-în-căutare-a-mijlocului-de-transport.js',

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
    '/formulare-încheieri/încheiere-privind-aplicarea-măsurilor-de-asigurare-a-acţiunii.părţi/script.js',
    '/formulare-încheieri/încheiere-de-continuare.părţi/script.js',
    '/formulare-încheieri/scrisoare-de-însoţire.părţi/script.js',
    '/formulare-încheieri/scrisoare-de-însoţire-borderou.părţi/script.js',
    '/formulare-încheieri/încheiere-de-asigurare-a-executării-documentului-executoriu.părţi/script.js',
    '/formulare-încheieri/somaţie-cu-privire-la-ieşirea-la-faţa-locului.părţi/script.js',
    '/formulare-încheieri/încheiere-de-dare-în-căutare-a-mijlocului-de-transport.părţi/script.js'
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
    maxcomplexity: 4,
    white: false,
    sub: true
  };

  var JSHINT_GLOBALS = {
    self: false,
    sinon: false,
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
    _: false,
    S: false,
    angular: false,
    setTimeout: false,
    clearTimeout: false,
    setInterval: false,
    history: false
  };

  module('JSHint');
  asyncTest('JSHint', function() {
    stop(SCRIPTS.length - 1);

    SCRIPTS.forEach(function(script) {
      jsHintTest(script, script + '?' + Date.now(), JSHINT_OPTIONS, JSHINT_GLOBALS);
    });
  });

})();
