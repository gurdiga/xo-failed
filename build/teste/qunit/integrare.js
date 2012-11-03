$('#app').on('load', function () {
  'use strict';


  module('Integrare');

  var app = window.frames['app'];

  // --------------------------------------------------
  test('utilitare', function () {
    app.$.fn.clic = function () {
    };

    ok(app.$('#conţinut').length === 1, '#conţinut');
    equal(location.protocol, 'https:', 'trecut la HTTPS');
  });


  // --------------------------------------------------
  test('încărcat', function () {
    ok(app.$('#conţinut').length === 1, '#conţinut');
    equal(location.protocol, 'https:', 'trecut la HTTPS');
  });


  // --------------------------------------------------
  test('Interfaţa', function () {
    ok(app.$('#crează-procedură a').is(':visible'), 'avem file pentru proceduri noi');
  });


  // --------------------------------------------------
  asyncTest('Creare precedură', function () {
    var $filă = app.$('#crează-procedură li.g a');

    app.location.hash = $filă.attr('href');

    app.Procedura.$.on('finalizat-animaţie', function () {
      ok(app.Procedura.$.is(':visible'), 's-a afişat formularul');

      var $dataIntentării = app.Procedura.$.find('#data-intentării'),
          $calendar;

      $dataIntentării.focus().next('.ui-icon-calendar').click();
      $calendar = app.$('#ui-datepicker-div');
      ok($calendar.is(':visible'), 'data intentării: se afişează calendarul');

      $calendar.find('.ui-datepicker-today a').click();
      equal($dataIntentării.val(), app.moment().format(app.FORMATUL_DATEI),
        'la click pe data de azi în calendar, se completează cîmpul data intentării');

      var $creditor = app.Procedura.$.find('#creditor');

      equal($creditor.find('#gen-persoană').val(), 'juridică',
        'pentru procedura de orgin general creditorul e implicit persoană juridică');

      $creditor.find('#denumire').val('Executori.org');
      $creditor.find('#idno').val('77777777777');
      $creditor.find('#sediu').val('Moldova ON-LINE\nbd. Internetului 33\net. 55, of. 1');

      var $debitor = app.Procedura.$.find('.debitor');

      equal($debitor.find('#gen-persoană').val(), 'fizică',
        'pentru procedura de orgin general debitorul e implicit persoană fizică');

      $debitor.find('#nume').val('Ion IONESCU');
      $debitor.find('#idnp').val('0000000000001');
      $debitor.find('#data-naşterii').val('10.10.1970');
      // TODO

      start();
    });
  });


  // --------------------------------------------------
  /*test('Căutare', function () {
    var $secţiune = app.$('#căutare');

    $secţiune.find('input').val('vlad').trigger('input');
    ok($secţiune.find('#rezultate').length > 0, 'găsit rezultate');
  });*/

}).attr('src', 'http://dev.executori.org/').show();
