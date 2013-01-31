asyncTest('Profil', function () {
  /*jshint maxlen:126 */
  'use strict';

  var profil = {
    'nume': 'Executorescu George',
    'adresă':
      'Chişinău\n' +
      'str. Executorilor 78\n' +
      'of.33',
    'telefon': '0123456789',
    'cod-fiscal': '4453456335',
    'instanţă-teritorială': 'Centru',
    'email': 'executorescu.george@executori.org',
    'cont-taxe-speze': '222098456',
    'bancă-taxe-speze': '442',
    'cont-onorarii': '222098457',
    'bancă-onorarii': '443'
  };

  var app = window.frames['app'],
      $butonProfil = app.$('#bara-de-sus button.profil'),
      $dialog = $butonProfil.prev('.dialog');

  ok($butonProfil.există(), 'avem buton pentru profil');
  ok($butonProfil.is(':visible'), 'butonul este visibil');

  $butonProfil.click();

  $dialog.one('afişare', function () {
    ok($dialog.există(), 'avem dialog');
    ok($dialog.is(':visible'), 'afişat dialogul');
    ok($dialog.find('legend label:contains("Profil")').există(), 'dialogul are titlu');

    verificăPrezenţaCîmpurilor();
    populeazăCîmpuri();

    var $butonDeSalvare = $dialog.find('legend button.salvează.semiascuns'),
        $butonDeÎnchidere = $dialog.find('button.închide');

    ok($butonDeSalvare.există(), 'dialogul are buton de salvare');
    ok($butonDeÎnchidere.există(), 'dialogul are buton de închidere');

    $butonDeSalvare.click();

    app.Profil.$.one('salvat', function () {
      ok(true, 'trimis datele pe server');

      app.Profil.$.one('ascundere', function () {
        ok($dialog.is(':not(:visible)'), 'închis dialogul la salvare');

        $butonProfil.click();

        $dialog.one('afişare', function () {
          ok(true, 'redeschis dialogul');
          equal(JSON.stringify(app.Profil.date), JSON.stringify(profil), 'datele încărcate corespund');

          verificăRepopulareaDialogului();
          $butonDeÎnchidere.click();

          $dialog.one('ascundere', function () {
            ok($dialog.is(':not(:visible)'), 'închis dialogul cu butonul de închidere');

            start();
          });
        });
      });
    });
  });


  // ------------------------
  function verificăPrezenţaCîmpurilor() {
    ok($dialog.find('#nume').există(), 'dialogul are cîmp pentru nume');
    ok($dialog.find('#adresă').există(), 'dialogul are cîmp pentru adresă');
    ok($dialog.find('#telefon').există(), 'dialogul are cîmp pentru numărul de telefon');
    ok($dialog.find('#număr-licenţă').există(), 'dialogul are cîmp pentru numărul licenţei');
    ok($dialog.find('#număr-licenţă').is('[readonly]'), 'cîmpul pentru numărul licenţei nu este editabil');
    ok($dialog.find('#cod-fiscal').există(), 'dialogul are cîmp pentru codul fiscal');
    ok($dialog.find('#instanţă-teritorială').există(), 'dialogul are cîmp pentru instanţa teritorială');
    ok($dialog.find('#email').există(), 'dialogul are cîmp pentru email');

    var subsecţiuneContCauţiune = $dialog.find('.subsecţiune .titlu:contains("cont pentru cauţiuni, taxe şi speze")');

    ok(subsecţiuneContCauţiune.există(), 'are subsecţiune cont pentru cauţiuni, taxe şi speze');
    ok(subsecţiuneContCauţiune.find('#cont-taxe-speze'), '...cu cîmp pentru numărul contului');
    ok(subsecţiuneContCauţiune.find('#bancă-taxe-speze'), '...cu cîmp pentru numărul băncii');

    var subsecţiuneContPentruOnorarii = $dialog.find('.subsecţiune .titlu:contains("cont pentru onorarii")');

    ok(subsecţiuneContPentruOnorarii.există(), 'are subsecţiune cont pentru cauţiuni, taxe şi speze');
    ok(subsecţiuneContPentruOnorarii.find('#cont-onorarii'), '...cu cîmp pentru numărul contului');
    ok(subsecţiuneContPentruOnorarii.find('#bancă-onorarii'), '...cu cîmp pentru numărul băncii');
  }


  // ------------------------
  function populeazăCîmpuri() {
    for (var cîmp in profil) {
      $dialog.find('#' + cîmp).val(profil[cîmp]);
    }
  }


  // ------------------------
  function verificăRepopulareaDialogului() {
    for (var cîmp in profil) {
      equal($dialog.find('#' + cîmp).val(), profil[cîmp], cîmp + ' e completat corespunzător');
    }
  }

});
