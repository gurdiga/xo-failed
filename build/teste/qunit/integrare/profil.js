asyncTest('Profil', function () {
  'use strict';

  var app = window.frames['app'],
      buton = app.$('#bara-de-sus button.profil');

  ok(buton.există(), 'avem buton pentru profil');
  ok(buton.is(':visible'), 'butonul este visibil');

  buton.click();

  app.Profil.încarcăDate();
  app.Profil.$.one('încărcat', function () {
    // fade-in durează un pic
    setTimeout(function () {
      var dialog = buton.prev('.dialog');

      ok(dialog.există(), 'avem dialog');
      ok(dialog.is(':visible'), 'afişat dialogul');
      ok(dialog.find('legend label:contains("Profil")').există(), 'dialogul are titlu');

      ok(dialog.find('#nume-executor').există(), 'dialogul are cîmp pentru nume');
      equal(dialog.find('#nume-executor').val(), app.Profil.date.nume, '…completat corespunzător');
      ok(dialog.find('#adresa-executor').există(), 'dialogul are cîmp pentru adresă');
      equal(dialog.find('#adresa-executor').val(), app.Profil.date.adresa, '…completat corespunzător');
      ok(dialog.find('#număr-licenţă').există(), 'dialogul are cîmp pentru numărul licenţei');
      equal(dialog.find('#număr-licenţă').val(), app.Utilizator.login, '…completat corespunzător');
      ok(dialog.find('#număr-licenţă').is('[readonly]'), 'cîmpul pentru numărul licenţei nu este editabil');
      ok(dialog.find('#codul-fiscal').există(), 'dialogul are cîmp pentru codul fiscal');
      equal(dialog.find('#codul-fiscal').val(), app.Profil.date['codul-fiscal'], '…completat corespunzător');
      ok(dialog.find('#instanţa-teritorială').există(), 'dialogul are cîmp pentru instanţa teritorială');
      equal(dialog.find('#instanţa-teritorială').val(), app.Profil.date['instanţa-teritorială'],
          '…completat corespunzător');
      ok(dialog.find('#email').există(), 'dialogul are cîmp pentru email');
      equal(dialog.find('#email').val(), app.Profil.date.email, '…completat corespunzător');

      var subsecţiuneContCauţiune = dialog.find('.subsecţiune .titlu:contains("cont pentru cauţiuni, taxe şi speze")');

      ok(subsecţiuneContCauţiune.există(), 'are subsecţiune cont pentru cauţiuni, taxe şi speze');
      ok(subsecţiuneContCauţiune.find('#cont-taxe-speze'), '...cu cîmp pentru numărul contului');
      ok(subsecţiuneContCauţiune.find('#banca-taxe-speze'), '...cu cîmp pentru numărul băncii');

      var subsecţiuneContPentruOnorarii = dialog.find('.subsecţiune .titlu:contains("cont pentru onorarii")');

      ok(subsecţiuneContPentruOnorarii.există(), 'are subsecţiune cont pentru cauţiuni, taxe şi speze');
      ok(subsecţiuneContPentruOnorarii.find('#cont-onorarii'), '...cu cîmp pentru numărul contului');
      ok(subsecţiuneContPentruOnorarii.find('#banca-onorarii'), '...cu cîmp pentru numărul băncii');

      var butonDeSalvare = dialog.find('legend button.salvează.semiascuns'),
          butonDeÎnchidere = dialog.find('button.închide');

      ok(butonDeSalvare.există(), 'dialogul are buton de salvare');
      ok(butonDeÎnchidere.există(), 'dialogul are buton de închidere');

      app.Profil.$.one('salvat', function () {
        ok(true, 'salvat');

        setTimeout(function () {
          ok(dialog.is(':not(:visible)'), 'dialogul se închide după salvare');

          start();
        }, 200);
        butonDeÎnchidere.click();
      });
      butonDeSalvare.click();
    }, 200);
  });
});
