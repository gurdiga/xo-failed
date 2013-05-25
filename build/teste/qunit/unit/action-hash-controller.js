(function() {
  'use strict';

  var app = window.frames['app'];


  test('HashController.init', function() {
    var executatHashControllerAcţionează = false;

    // stub
    app.HashController.acţioneazăOriginal = app.HashController.acţionează;
    app.HashController.acţionează = function() {
      executatHashControllerAcţionează = true;
    };

    app.HashController.init();
    app.$(app).trigger('hashchange');

    ok(executatHashControllerAcţionează, 'leagă HashController.acţionează la hashchange');

    // unstub
    app.$(app).off('hashchange', app.HashController.acţionează);
    app.HashController.acţionează = app.HashController.acţioneazăOriginal;
  });


  test('HashController.acţionează — utilizator neautentificat', function() {
    var location = {hash: 'ceva'},
        body = $('<body/>')[0];

    app.Utilizator.autentificat = false;
    app.HashController.acţionează(location, body);

    equal(location.hash, '', 'hash-ul se şterge');
    ok($(body).is(':not(.autentificat)'), 'nu se setează clasa autentificat pe body');

    app.Utilizator.autentificat = true;
  });


  test('HashController.acţionează — utilizator autentificat cu ceva aiurea în hash', function() {
    var location = {hash: 'ceva aiurea'},
        body = $('<body/>')[0];

    app.Utilizator.autentificat = true;
    app.HashController.acţionează(location, body);

    equal(location.hash, '', 'se şterge hash-ul');
  });


  test('HashController.acţionează — utilizator autentificat cu nimic în hash', function() {
    var location = {hash: ''},
        body = $('<body/>')[0];

    app.Utilizator.autentificat = true;
    app.HashController.acţionează(location, body);

    ok(app.$('#căutare input').is(':focus'), 'se focusează cîmpul de căutare');
  });


  test('HashController.hash', function() {
    equal(app.HashController.hash(''), '#index', 'pentru “” întoarce #index');
    equal(app.HashController.hash('#'), '#index', 'pentru # întoarce #index');
    equal(app.HashController.hash('#orice-altceva'), '#orice-altceva', 'pentru #orice-altceva întoarce #orice-altceva');
  });


  test('HashController.pagină', function() {
    // stub
    app.HashController.hashOriginal = app.HashController.hash;

    app.HashController.hash = function() { return '#prima-parte?a-doua-parte'; };
    equal(app.HashController.pagină(), '#prima-parte', 'bisectează hash după “?” şi întoarce prima parte');

    // unstub
    app.HashController.hash = app.HashController.hashOriginal;
  });


  test('HashController.date', function() {
    // stub
    app.HashController.hashOriginal = app.HashController.hash;

    app.HashController.hash = function() { return '#prima-parte?a-doua-parte'; };
    equal(app.HashController.date(), 'a-doua-parte', 'bisectează hash după “?” şi întoarce a doua parte');

    // unstub
    app.HashController.hash = app.HashController.hashOriginal;
  });

})();
