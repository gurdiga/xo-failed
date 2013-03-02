// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
test('Încheiere privind aplicarea măsurilor de asigurare a acţiunii: butoane de adăugare cîmpuri', function () {
  'use strict';
  /*jshint maxlen:140 maxstatements:80*/

  var app = this.app,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi,
      obiect = 'aplicarea măsurilor de asigurare a acţiunii';

  app.$.fx.off = true;

  ok(app.FormularProcedură.$.is(':visible'), 'formularul de procedură e deschis');
  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val(obiect).change();
  equal($secţiune.find('#obiect').val(), obiect, 'setat obiectul corespunzător');

  var primaMăsură = 'aplicarea sechestrului pe bunurile sau pe sumele de bani ale debitorului, ' +
      'inclusiv pe cele care se află la alte persoane';

  ok($secţiune.find('#măsura-de-asigurare').există(), 'găsit măsura de asigurare');
  equal($secţiune.find('#măsura-de-asigurare').val(), primaMăsură, 'măsura implicită e “' + primaMăsură + '”');

  var $butonDeAdăugareValoareaAcţiunii = $secţiune.find('.adaugă-cîmp-personalizat.valoarea-acţiunii'),
      $butonDeAdăugareBunSechestrat = $secţiune.find('.adaugă-cîmp-personalizat.bun-sechestrat'),
      $butonDeAdăugareSumăSechestrată = $secţiune.find('.adaugă-cîmp-personalizat.sumă-sechestrată');

  ok($butonDeAdăugareValoareaAcţiunii.există(), 'avem buton pentru adăugare “Valoarea acţiunii”');
  equal($butonDeAdăugareValoareaAcţiunii.text(), '+valoarea acţiunii', '…cu textul “+valoarea acţiunii”');

  ok($butonDeAdăugareBunSechestrat.există(), 'avem buton pentru adăugare bunuri sechestrate');
  equal($butonDeAdăugareBunSechestrat.text(), '+bun sechestrat', '…cu textul “+bun sechestrat”');

  ok($butonDeAdăugareSumăSechestrată.există(), 'avem buton pentru adăugare sume sechestrate');
  equal($butonDeAdăugareSumăSechestrată.text(), '+sumă sechestrată', '…cu textul “+sumă sechestrată”');

  $butonDeAdăugareValoareaAcţiunii.click();

  var $valoareaAcţiunii = $secţiune.find('.personalizat.valoarea-acţiunii');

  ok($valoareaAcţiunii.există(), 'butonul “+valoarea acţiunii” adaugă cîmp corespunzător');
  equal($valoareaAcţiunii.find('.etichetă').val(), 'Valoarea acţiunii', '…eticheta are textul corespunzător');
  ok($valoareaAcţiunii.find('input').is(':focused'), '…focusează cîmpul (nu eticheta, pentru personalizare)');
  ok($butonDeAdăugareBunSechestrat.parent().is('.ascuns'), '…ascunde butonul “+bun sechestrat”');
  ok($butonDeAdăugareSumăSechestrată.parent().is('.ascuns'), '…ascunde butonul “+sumă sechestrată”');
  ok($butonDeAdăugareValoareaAcţiunii.parent().is('.ascuns'), '…ascunde butonul “+valoarea acţiunii”');

  var eliminatValoareaAcţiunii = false;

  app.FormularProcedură.$obiectulUrmăririi
    .one('eliminare', '.valoarea-acţiunii', function () { eliminatValoareaAcţiunii = true; });

  $valoareaAcţiunii
    .trigger('mousemove') // să aişăm butonul de eliminare
    .find('.elimină').click();

  ok(eliminatValoareaAcţiunii, 'la click pe butonul de eliminare a cîmpului valoarea acţiunii, el se elimină');
  ok($butonDeAdăugareBunSechestrat.parent().is(':not(.ascuns)'), '…reafişează butonul “+bun sechestrat”');
  ok($butonDeAdăugareSumăSechestrată.parent().is(':not(.ascuns)'), '…reafişează butonul “+sumă sechestrată”');
  ok($butonDeAdăugareValoareaAcţiunii.parent().is(':not(.ascuns)'), '…reafişează butonul “+valoarea acţiunii”');

  $butonDeAdăugareBunSechestrat.click();

  var $cîmpBun = $secţiune.find('.personalizat.bunul-sechestrat');

  ok($cîmpBun.există(), 'butonul “+bun sechestrat” adaugă cîmp corespunzător');
  equal($cîmpBun.find('.etichetă').val(), 'Descriere bun', '…eticheta are textul corespunzător');
  ok($cîmpBun.find('.etichetă').is(':focused'), '…focusează eticheta, pentru a introduce descrierea bunului');
  ok($butonDeAdăugareValoareaAcţiunii.parent().is('.ascuns'), '…ascunde butonul “+valoarea acţiunii”');
  ok($butonDeAdăugareBunSechestrat.parent().is(':not(.ascuns)'), 'butonul “+bun sechestrat” rămîne afişat');
  ok($butonDeAdăugareSumăSechestrată.parent().is(':not(.ascuns)'), 'butonul “+sumă sechestrată” rămîne afişat');

  var eliminatBunSechestrat = false;

  app.FormularProcedură.$obiectulUrmăririi
    .one('eliminare', '.bunul-sechestrat', function () { eliminatBunSechestrat = true; });

  $cîmpBun
    .trigger('mousemove') // să aişăm butonul de eliminare
    .find('.elimină').click();
  ok(eliminatBunSechestrat, 'la click pe butonul de eliminare a cîmpului bunului sechestrat adăugat, el se elimină');
  ok($butonDeAdăugareValoareaAcţiunii.parent().is(':not(.ascuns)'), '…butonul pentru “+valoarea acţiunii” se reafişează');
  ok($butonDeAdăugareBunSechestrat.parent().is(':not(.ascuns)'), '…butonul “+bun sechestrat” se reafişează');
  ok($butonDeAdăugareSumăSechestrată.parent().is(':not(.ascuns)'), '…butonul “+sumă sechestrată” se reafişează');

  $butonDeAdăugareSumăSechestrată.click();

  var $cîmpSumă = $secţiune.find('.personalizat.suma-sechestrată');

  ok($cîmpSumă.există(), 'butonul “+sumă sechestrată” adaugă cîmp corespunzător');
  equal($cîmpSumă.find('.etichetă').val(), 'Descriere sumă', '…eticheta are textul corespunzător');
  ok($cîmpSumă.find('.etichetă').is(':focused'), '…focusează eticheta, pentru a introduce descrierea bunului');
  ok($butonDeAdăugareValoareaAcţiunii.parent().is('.ascuns'), '…ascunde butonul “+valoarea acţiunii”');
  ok($butonDeAdăugareBunSechestrat.parent().is(':not(.ascuns)'), 'butonul “+bun sechestrat” rămîne afişat');
  ok($butonDeAdăugareSumăSechestrată.parent().is(':not(.ascuns)'), 'butonul “+sumă sechestrată” rămîne afişat');

  var eliminatSumăSechestrată = false;

  app.FormularProcedură.$obiectulUrmăririi
    .one('eliminare', '.suma-sechestrată', function () { eliminatSumăSechestrată = true; });

  $cîmpSumă
    .trigger('mousemove') // să aişăm butonul de eliminare
    .find('.elimină').click();
  ok(eliminatSumăSechestrată, 'la click pe butonul de eliminare a cîmpului bunului sechestrat adăugat, el se elimină');
  ok($butonDeAdăugareValoareaAcţiunii.parent().is(':not(.ascuns)'), '…butonul pentru “+valoarea acţiunii” se reafişează');
  ok($butonDeAdăugareBunSechestrat.parent().is(':not(.ascuns)'), '…butonul “+bun sechestrat” se reafişează');
  ok($butonDeAdăugareSumăSechestrată.parent().is(':not(.ascuns)'), '…butonul “+sumă sechestrată” se reafişează');

  // TODO: cîmpuri personalizate -- de asigurat o valoare (cea default?) pentru etichete personalizate
  // TODO: cîmpuri personalizate -- de incrementat cînd mai este altul cu acelaşi nume

  app.$.fx.off = false;
});

// ------------------------------------------

asyncTest('Încheiere privind aplicarea măsurilor de asigurare a acţiunii: valoarea acţiunii', function () {
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi,
      $butonDeAdăugareValoareaAcţiunii = $secţiune.find('.adaugă-cîmp-personalizat.valoarea-acţiunii');

  $butonDeAdăugareValoareaAcţiunii.click();

  var $valoareaAcţiunii = $secţiune.find('.personalizat.valoarea-acţiunii'),
      $eticheta = $valoareaAcţiunii.find('.etichetă'), eticheta = 'Valoarea acţiunii',
      $suma = $valoareaAcţiunii.find('input'), suma = 1000,
      $valuta = $valoareaAcţiunii.find('.valuta'), valuta = 'MDL';

  ok($valoareaAcţiunii.există(), 'la click pe “+valoarea acţiunii” se adaugă cîmpul');
  equal($eticheta.val(), eticheta, '…are eticheta corespunzătoare');
  equal($suma.val(), '', '…suma lipseşte iniţial');
  equal($valuta.val(), 'MDL', '…valuta e MDL');

  $suma.val(suma);
  $valuta.val(valuta);

  var procedură = app.FormularProcedură.colectează(),
      item = procedură['obiectul-urmăririi']['valoarea-acţiunii'];

  ok(!procedură['obiectul-urmăririi'].sume, 'nu s-au colectat sumele');
  ok(item, 'colectat datele');
  equal(item.suma, suma, '…suma');
  equal(item.valuta, valuta, '…valuta');

  $formular.find('.bara-de-instrumente .salvează').click();
  $formular.one('salvat', function () {
    ok(true, 'salvat');
    $formular.one('închis', function () {
      app.ProceduriRecente.$.find('.item:first').click();
      $formular.one('populat', function () {
        ok(true, 'redeschis şi populat');

        var $secţiune = app.FormularProcedură.$obiectulUrmăririi,
            $valoareaAcţiunii = $secţiune.find('.personalizat.valoarea-acţiunii'),
            $descriere = $valoareaAcţiunii.find('.etichetă'),
            $valoare = $valoareaAcţiunii.find('.sumă'),
            $valuta = $valoareaAcţiunii.find('.valuta');

        equal($secţiune.find('.personalizat').length, 1, 'găsit numărul corespunzător de cîmpuri personalizate: 1');
        ok($valoareaAcţiunii.există(), 'la redeschidere s-a adăugat suma corespunzător');
        equal($descriere.val(), eticheta, '…cu descrierea corespunzătoare');
        equal($valoare.val(), item.suma, '…cu suma corespunzătoare');
        equal($valuta.val(), item.valuta, '…cu valuta corespunzătoare');

        // TODO: de testat formarea încheierii

        $valoareaAcţiunii
          .trigger('mousemove')
          .find('.elimină').focus().click();

        setTimeout(function () {
          ok(!$secţiune.find('.personalizat.valoarea-acţiunii').există(), 'eliminat cîmp valoarea acţiunii');

          start();
        }, 500);
      });
    });
    $formular.find('button.închide').click();
  });

});

// ------------------------------------------

asyncTest('Încheiere privind aplicarea măsurilor de asigurare a acţiunii: colectarea: bunuri sechestrate', function () {
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi,
      $butonDeAdăugareBunSechestrat = $secţiune.find('.adaugă-cîmp-personalizat.bun-sechestrat');

  $butonDeAdăugareBunSechestrat.click();

  var $cîmpBun = $secţiune.find('.personalizat.bunul-sechestrat'),
      $descriere = $cîmpBun.find('.etichetă'), descriere = 'Descriere bun',
      $valoare = $cîmpBun.find('.sumă'),
      $valuta = $cîmpBun.find('.valuta');

  ok($cîmpBun.există(), 'la clic pe “+bun sechestrat” se adaugă un cîmp corespunzător');
  equal($descriere.val(), descriere, 'descrierea implicit e “' + descriere + '”');
  equal($valoare.val(), '', 'valoarea implicit e necompletă');
  equal($valoare.attr('placeholder'), 'valoarea', 'cîmpul pentru valoare are şoapta “valoarea”');
  equal($valuta.val(), 'MDL', 'valuta implicit este “MDL”');

  var bun = {
    descrierea: 'Automobil Audi Q7',
    suma: 35000,
    valuta: 'EUR'
  };

  $descriere.val(bun.descrierea);
  $valoare.val(bun.suma);
  $valuta.val(bun.valuta);

  equal($valuta.val(), bun.valuta, 'valuta se setează corespunzător'); // verific pentru că e select

  var procedură = app.FormularProcedură.colectează(),
      bunuri = procedură['obiectul-urmăririi']['bunuri-sechestrate'];

  equal(bunuri.length, 1, 's-a colectat corespunzător un bun');
  equal(bunuri[0].descrierea, bun.descrierea, '…cu descrierea corespunzătoare');
  equal(bunuri[0].suma, bun.suma, '…cu suma corespunzătoare');
  equal(bunuri[0].valuta, bun.valuta, '…cu valuta corespunzătoare');

  $formular.find('.bara-de-instrumente .salvează').click();
  $formular.one('salvat', function () {
    ok(true, 'salvat');
    $formular.one('închis', function () {
      app.ProceduriRecente.$.find('.item:first').click();
      $formular.one('populat', function () {
        ok(true, 'redeschis şi populat');

        var $secţiune = app.FormularProcedură.$obiectulUrmăririi,
            $cîmpBun = $secţiune.find('.personalizat.bunul-sechestrat'),
            $descriere = $cîmpBun.find('.etichetă'),
            $valoare = $cîmpBun.find('.sumă'),
            $valuta = $cîmpBun.find('.valuta');

        equal($secţiune.find('.personalizat').length, 1, 'găsit numărul corespunzător de cîmpuri personalizate: 1');
        ok($cîmpBun.există(), 'la redeschidere s-a adăugat cîmpul corespunzător');
        equal($descriere.val(), bun.descrierea, '…cu descrierea corespunzătoare');
        equal($valoare.val(), bun.suma, '…cu suma corespunzătoare');
        equal($valuta.val(), bun.valuta, '…cu valuta corespunzătoare');

        // TODO: de testat formarea încheierii

        $cîmpBun
          .trigger('mousemove')
          .find('.elimină').focus().click();

        setTimeout(function () {
          ok(!$secţiune.find('.personalizat.bunul-sechestrat').există(), 'eliminat cîmp bun');

          start();
        }, 500);
      });
    });
    $formular.find('button.închide').click();
  });

});

// ------------------------------------------

asyncTest('Încheiere privind aplicarea măsurilor de asigurare a acţiunii: sume sechestrate', function () {
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi,
      $butonDeAdăugareSumăSechestrată = $secţiune.find('.adaugă-cîmp-personalizat.sumă-sechestrată');

  $butonDeAdăugareSumăSechestrată.click();

  var $cîmpSumă = $secţiune.find('.personalizat.suma-sechestrată'),
      $descriere = $cîmpSumă.find('.etichetă'), descriere = 'Descriere sumă',
      $valoare = $cîmpSumă.find('.sumă'),
      $valuta = $cîmpSumă.find('.valuta');

  ok($cîmpSumă.există(), 'la clic pe “+sumă sechestrat” se adaugă un cîmp corespunzător');
  equal($descriere.val(), descriere, 'descrierea implicit e “' + descriere + '”');
  equal($valoare.val(), '', 'valoarea implicit e necompletă');
  equal($valoare.attr('placeholder'), 'suma', 'cîmpul pentru valoare are şoapta “suma”');
  equal($valuta.val(), 'MDL', 'valuta implicit este “MDL”');

  var sumă = {
    descrierea: 'Depozit BCR',
    suma: 5000,
    valuta: 'USD'
  };

  $descriere.val(sumă.descrierea);
  $valoare.val(sumă.suma);
  $valuta.val(sumă.valuta);

  equal($valuta.val(), sumă.valuta, 'valuta se setează corespunzător'); // verific pentru că e select

  var procedură = app.FormularProcedură.colectează(),
      sume = procedură['obiectul-urmăririi']['sume-sechestrate'];

  equal(sume.length, 1, 's-a colectat corespunzător un sumă');
  equal(sume[0].descrierea, sumă.descrierea, '…cu descrierea corespunzătoare');
  equal(sume[0].suma, sumă.suma, '…cu suma corespunzătoare');
  equal(sume[0].valuta, sumă.valuta, '…cu valuta corespunzătoare');

  $formular.find('.bara-de-instrumente .salvează').click();
  $formular.one('salvat', function () {
    $formular.one('închis', function () {
      app.ProceduriRecente.$.find('.item:first').click();
      $formular.one('populat', function () {
        var $secţiune = app.FormularProcedură.$obiectulUrmăririi,
            $cîmpSumă = $secţiune.find('.personalizat.suma-sechestrată'),
            $descriere = $cîmpSumă.find('.etichetă'),
            $valoare = $cîmpSumă.find('.sumă'),
            $valuta = $cîmpSumă.find('.valuta');

        equal($secţiune.find('.personalizat').length, 1, 'găsit numărul corespunzător de cîmpuri personalizate: 1');
        ok($cîmpSumă.există(), 'la redeschidere s-a adăugat suma corespunzător');
        equal($descriere.val(), sume[0].descrierea, '…cu descrierea corespunzătoare');
        equal($valoare.val(), sume[0].suma, '…cu suma corespunzătoare');
        equal($valuta.val(), sume[0].valuta, '…cu valuta corespunzătoare');

        // TODO: de testat formarea încheierii

        $cîmpSumă
          .trigger('mousemove')
          .find('.elimină').focus().click();

        setTimeout(function () {
          ok(!$secţiune.find('.personalizat.bunul-sechestrat').există(), 'eliminat cîmp bun');

          start();
        }, 500);
      });
    });
    $formular.find('button.închide').click();
  });

});
