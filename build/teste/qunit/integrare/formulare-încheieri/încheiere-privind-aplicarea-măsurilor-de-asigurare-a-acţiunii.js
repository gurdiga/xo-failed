// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
/*global UtilitareÎncheiere*/
(function() {
  'use strict';

  var primaMăsură = 'aplicarea sechestrului pe bunurile sau pe sumele de bani ale debitorului, inclusiv pe cele care se află la alte persoane';


  test('Încheiere privind aplicarea măsurilor de asigurare a acţiunii: butoane de adăugare cîmpuri', function() {
    var app = this.app,
        $secţiune = app.FormularProcedură.$obiectulUrmăririi,
        obiect = 'aplicarea măsurilor de asigurare a acţiunii';

    app.$.fx.off = true;

    ok(app.FormularProcedură.$.is(':visible'), 'formularul de procedură e deschis');
    $secţiune.find('#caracter').val('nonpecuniar').change();
    $secţiune.find('#obiect').val(obiect).change();
    equal($secţiune.find('#obiect').val(), obiect, 'setat obiectul corespunzător');

    ok($secţiune.find('#măsura-de-asigurare').există(), 'găsit măsura de asigurare');
    equal($secţiune.find('#măsura-de-asigurare').val(), primaMăsură, 'măsura implicită e “' + primaMăsură + '”');

    var $butonDeAdăugareValoareaAcţiunii = $secţiune.find('.adaugă-cîmp-personalizat.valoarea-acţiunii'),
        $butonDeAdăugareBunSechestrat = $secţiune.find('.adaugă-cîmp-personalizat.pentru-bunuri-sechestrate'),
        $butonDeAdăugareSumăSechestrată = $secţiune.find('.adaugă-cîmp-personalizat.pentru-sume-sechestrate');

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
      .one('eliminare', '.valoarea-acţiunii', function() { eliminatValoareaAcţiunii = true; });

    $valoareaAcţiunii
      .trigger('mousemove') // să aişăm butonul de eliminare
      .find('.elimină').click();

    ok(eliminatValoareaAcţiunii, 'la click pe butonul de eliminare a cîmpului valoarea acţiunii, el se elimină');
    ok($butonDeAdăugareBunSechestrat.parent().is(':not(.ascuns)'), '…reafişează butonul “+bun sechestrat”');
    ok($butonDeAdăugareSumăSechestrată.parent().is(':not(.ascuns)'), '…reafişează butonul “+sumă sechestrată”');
    ok($butonDeAdăugareValoareaAcţiunii.parent().is(':not(.ascuns)'), '…reafişează butonul “+valoarea acţiunii”');

    $butonDeAdăugareBunSechestrat.click();

    var $cîmpBun = $secţiune.find('.personalizat.bunuri-sechestrate');

    ok($cîmpBun.există(), 'butonul “+bun sechestrat” adaugă cîmp corespunzător');
    equal($cîmpBun.find('.etichetă').val(), 'Descriere bun', '…eticheta are textul corespunzător');
    ok($cîmpBun.find('.etichetă').is(':focused'), '…focusează eticheta, pentru a introduce descrierea bunului');
    ok($butonDeAdăugareValoareaAcţiunii.parent().is('.ascuns'), '…ascunde butonul “+valoarea acţiunii”');
    ok($butonDeAdăugareBunSechestrat.parent().is(':not(.ascuns)'), 'butonul “+bun sechestrat” rămîne afişat');
    ok($butonDeAdăugareSumăSechestrată.parent().is(':not(.ascuns)'), 'butonul “+sumă sechestrată” rămîne afişat');

    var eliminatBunSechestrat = false;

    app.FormularProcedură.$obiectulUrmăririi
      .one('eliminare', '.bunuri-sechestrate', function() { eliminatBunSechestrat = true; });

    $cîmpBun
      .trigger('mousemove') // să aişăm butonul de eliminare
      .find('.elimină').click();
    ok(eliminatBunSechestrat, 'la click pe butonul de eliminare a cîmpului bunului sechestrat adăugat, el se elimină');
    ok($butonDeAdăugareValoareaAcţiunii.parent().is(':not(.ascuns)'), '…butonul pentru “+valoarea acţiunii” se reafişează');
    ok($butonDeAdăugareBunSechestrat.parent().is(':not(.ascuns)'), '…butonul “+bun sechestrat” se reafişează');
    ok($butonDeAdăugareSumăSechestrată.parent().is(':not(.ascuns)'), '…butonul “+sumă sechestrată” se reafişează');

    $butonDeAdăugareSumăSechestrată.click();

    var $cîmpSumă = $secţiune.find('.personalizat.sume-sechestrate');

    ok($cîmpSumă.există(), 'butonul “+sumă sechestrată” adaugă cîmp corespunzător');
    equal($cîmpSumă.find('.etichetă').val(), 'Descriere sumă', '…eticheta are textul corespunzător');
    ok($cîmpSumă.find('.etichetă').is(':focused'), '…focusează eticheta, pentru a introduce descrierea bunului');
    ok($butonDeAdăugareValoareaAcţiunii.parent().is('.ascuns'), '…ascunde butonul “+valoarea acţiunii”');
    ok($butonDeAdăugareBunSechestrat.parent().is(':not(.ascuns)'), 'butonul “+bun sechestrat” rămîne afişat');
    ok($butonDeAdăugareSumăSechestrată.parent().is(':not(.ascuns)'), 'butonul “+sumă sechestrată” rămîne afişat');

    var eliminatSumăSechestrată = false;

    app.FormularProcedură.$obiectulUrmăririi
      .one('eliminare', '.sume-sechestrate', function() { eliminatSumăSechestrată = true; });

    $cîmpSumă
      .trigger('mousemove') // să afişăm butonul de eliminare
      .find('.elimină').click();
    ok(eliminatSumăSechestrată, 'la click pe butonul de eliminare a cîmpului bunului sechestrat adăugat, el se elimină');
    ok($butonDeAdăugareValoareaAcţiunii.parent().is(':not(.ascuns)'), '…butonul pentru “+valoarea acţiunii” se reafişează');
    ok($butonDeAdăugareBunSechestrat.parent().is(':not(.ascuns)'), '…butonul “+bun sechestrat” se reafişează');
    ok($butonDeAdăugareSumăSechestrată.parent().is(':not(.ascuns)'), '…butonul “+sumă sechestrată” se reafişează');

    app.$.fx.off = false;
  });

  // ------------------------------------------

  asyncTest('Încheiere privind aplicarea măsurilor de asigurare a acţiunii: valoarea acţiunii', function() {
    var app = this.app,
        $formular = app.FormularProcedură.$,
        $secţiune = app.FormularProcedură.$obiectulUrmăririi,
        obiect = 'aplicarea măsurilor de asigurare a acţiunii';

    app.$.fx.off = true;
    ok(app.FormularProcedură.$.is(':visible'), 'formularul de procedură e deschis');

    if (app.FormularProcedură.$.is(':not(:visible)')) {
      start();
      return;
    }

    $secţiune.find('#caracter').val('nonpecuniar').change();
    $secţiune.find('#obiect').val(obiect).change();
    equal($secţiune.find('#obiect').val(), obiect, 'setat obiectul corespunzător');

    var $butonDeAdăugareValoareaAcţiunii = $secţiune.find('.adaugă-cîmp-personalizat.valoarea-acţiunii');

    ok($butonDeAdăugareValoareaAcţiunii.există(), 'găsit buton de adăugare a cîmpului pentru valoarea acţiunii');
    $butonDeAdăugareValoareaAcţiunii.click();

    var $valoareaAcţiunii = $secţiune.find('.personalizat.valoarea-acţiunii'),
        $eticheta = $valoareaAcţiunii.find('.etichetă'), eticheta = 'Valoarea acţiunii',
        $suma = $valoareaAcţiunii.find('input'), suma = 1000,
        $valuta = $valoareaAcţiunii.find('.valuta'), valuta = 'MDL';

    ok($valoareaAcţiunii.există(), 'găsit cîmp personalizat valoarea acţiunii');
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
    $formular.one('salvat', function() {
      ok(true, 'salvat');
      $formular.one('închis', function() {
        app.ProceduriRecente.$.find('.item:first').click();
        $formular.one('populat', function() {
          ok(true, 'redeschis şi populat');

          var $valoareaAcţiunii = $secţiune.find('.personalizat.valoarea-acţiunii'),
              $descriere = $valoareaAcţiunii.find('.etichetă'),
              $valoare = $valoareaAcţiunii.find('.sumă'),
              $valuta = $valoareaAcţiunii.find('.valuta');

          equal($secţiune.find('#măsura-de-asigurare').val(), primaMăsură, 'găsit măsura-de-asigurare corespunzătoare');
          equal($secţiune.find('.personalizat').length, 1, 'găsit numărul corespunzător de cîmpuri personalizate: 1');
          ok($valoareaAcţiunii.există(), 'la redeschidere s-a adăugat suma corespunzător');
          equal($descriere.val(), eticheta, '…cu descrierea corespunzătoare');
          equal($valoare.val(), item.suma, '…cu suma corespunzătoare');
          equal($valuta.val(), item.valuta, '…cu valuta corespunzătoare');

          var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

          ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
          $butonPentruÎncheiere.click();

          var formular = app.Încheieri.formular($butonPentruÎncheiere),
              meta = app.Încheieri.deschise[formular];

          app.$(meta).one('iniţializat', function() {
            var $încheiere = app.$(this.tab.document),
                date = this.tab.Încheiere.date,
                subtitlu = 'de intentare a procedurii de executare privind aplicarea măsurilor de asigurare a acţiunii';

            equal(date.variaţie, 'aplicarea sechestrului', 'context: variaţie == “aplicarea sechestrului”');
            equal(date.cuSpecificare, false, 'context: cuSpecificare == false');
            equal(date.fărăSpecificare, true, 'context: fărăSpecificare == true');
            ok(!date.bunuriSechestrate, 'context: nu avem bunuriSechestrate');
            ok(!date.sumeSechestrate, 'context: nu avem sumeSechestrate');
            ok($.isPlainObject(date.valoareaAcţiunii), 'context: valoareaAcţiuniii e obiect');
            equal(date.valoareaAcţiunii.suma, item.suma, 'context: valoareaAcţiunii.suma are valoarea corespunzătoare');
            equal(date.valoareaAcţiunii.valuta, item.valuta, 'context: valoareaAcţiunii.valuta are valoarea corespunzătoare');

            UtilitareÎncheiere.verificăŞoaptăButon($încheiere, $butonPentruÎncheiere);
            UtilitareÎncheiere.verificăSubtitlu($încheiere, subtitlu);
            UtilitareÎncheiere.verificăSecţiuni($încheiere,
              ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia',  'Executorul']);

            var $secţiuneaChectiunea = $încheiere.find('section header:contains("Chestiunea")+.conţinut.editabil'),
                $secţiuneaDispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut.editabil'),
                text = item.suma + ' ' + item.valuta;

            ok($secţiuneaChectiunea.find('p:contains("' + text + '")').există(),
              'valoarea acţiunii (' + text + ') este menţionată în secţiunea “Chestiunea”');
            equal($secţiuneaDispoziţia.find('li').length, 10, 'în secţiunea “Dispoziţia” sunt enumerate 10 puncte');

            $încheiere.find('.închide').click();

            var $valoareaAcţiunii = app.FormularProcedură.$obiectulUrmăririi.find('.personalizat.valoarea-acţiunii');

            $valoareaAcţiunii
              .trigger('mousemove')
              .find('.elimină').focus().click();

            setTimeout(function() { // slideUp?
              ok(!$secţiune.find('.personalizat.valoarea-acţiunii').există(), 'eliminat cîmp valoarea acţiunii');

              app.$.fx.off = false;
              start();
            }, 550);
          }); // one iniţializat
        }); // one populat
      }); // one închis

      $formular.find('button.închide').click();
    }); // one salvat

  });

  // ------------------------------------------

  asyncTest('Încheiere privind aplicarea măsurilor de asigurare a acţiunii: colectarea: bunuri sechestrate', function() {
    var app = this.app,
        $formular = app.FormularProcedură.$,
        $secţiune = app.FormularProcedură.$obiectulUrmăririi,
        $butonDeAdăugareBunSechestrat = $secţiune.find('.adaugă-cîmp-personalizat.pentru-bunuri-sechestrate');

    $butonDeAdăugareBunSechestrat.click();

    var $cîmpBun = $secţiune.find('.personalizat.bunuri-sechestrate'),
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
    $formular.one('salvat', function() {
      ok(true, 'salvat');
      $formular.one('închis', function() {
        app.ProceduriRecente.$.find('.item:first').click();
        $formular.one('populat', function() {
          ok(true, 'redeschis şi populat');

          var $cîmpBun = $secţiune.find('.personalizat.bunuri-sechestrate'),
              $descriere = $cîmpBun.find('.etichetă'),
              $valoare = $cîmpBun.find('.sumă'),
              $valuta = $cîmpBun.find('.valuta');

          equal($secţiune.find('#măsura-de-asigurare').val(), primaMăsură, 'găsit măsura-de-asigurare corespunzătoare');
          equal($secţiune.find('.personalizat').length, 1, 'găsit numărul corespunzător de cîmpuri personalizate: 1');
          ok($cîmpBun.există(), 'la redeschidere s-a adăugat cîmpul corespunzător');
          equal($descriere.val(), bun.descrierea, '…cu descrierea corespunzătoare');
          equal($valoare.val(), bun.suma, '…cu suma corespunzătoare');
          equal($valuta.val(), bun.valuta, '…cu valuta corespunzătoare');

          var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

          ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
          $butonPentruÎncheiere.click();

          var formular = app.Încheieri.formular($butonPentruÎncheiere),
              meta = app.Încheieri.deschise[formular];

          app.$(meta).one('iniţializat', function() {
            var $încheiere = app.$(this.tab.document),
                date = this.tab.Încheiere.date;

            equal(date.variaţie, 'aplicarea sechestrului', 'context: variaţie == “aplicarea sechestrului”');
            ok(date.cuSpecificare, 'context: cuSpecificare == true');
            ok(!date.fărăSpecificare, 'context: fărăSpecificare == false');
            equal(date.sumeSechestrate.length, 0, 'context: avem 0 sumeSechestrate');
            equal(date.bunuriSechestrate.length, 1, 'context: avem un număr corespunzător de bunuriSechestrate');
            ok($.isArray(date.bunuriSechestrate), 'context: bunuriSechestrate e array');
            equal(date.bunuriSechestrate[0].descrierea, bun.descrierea, 'context: bunul are descrierea corespunzătoare');
            equal(date.bunuriSechestrate[0].suma, bun.suma, 'context: bunul are suma corespunzătoare');
            equal(date.bunuriSechestrate[0].valuta, bun.valuta, 'context: bunul are valuta corespunzătoare');

            UtilitareÎncheiere.verificăŞoaptăButon($încheiere, $butonPentruÎncheiere);
            UtilitareÎncheiere.verificăSecţiuni($încheiere,
              ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia',  'Executorul']);

            var $secţiuneaChectiunea = $încheiere.find('section header:contains("Chestiunea")+.conţinut.editabil'),
                $secţiuneaDispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut.editabil'),
                text = bun.descrierea + ' — ' + bun.suma + ' ' + bun.valuta;

            ok($secţiuneaChectiunea.find('p:contains("' + text + '")').există(),
              'bunul (' + text + ') este menţionat în secţiunea “Chestiunea”');
            equal($secţiuneaDispoziţia.find('li').length, 4, 'în secţiunea “Dispoziţia” sunt enumerate 4 puncte');

            $încheiere.find('.închide').click();

            $cîmpBun.trigger('mousemove');

            var butonDeEliminare = $cîmpBun.find('.elimină');

            ok(butonDeEliminare.există(), 'avem butonaş pentru eliminare bun');
            butonDeEliminare.focus().click();

            setTimeout(function() { // slideUp?
              ok(!$secţiune.find('.personalizat.bunuri-sechestrate').există(), 'eliminat cîmp pentru bunul sechestrat');

              start();
            }, 550);
          }); // one iniţializat
        }); // one populat
      }); // one închis

      $formular.find('button.închide').click();
    }); // one salvat

  });

  // ------------------------------------------

  asyncTest('Încheiere privind aplicarea măsurilor de asigurare a acţiunii: sume sechestrate', function() {
    var app = this.app,
        $formular = app.FormularProcedură.$,
        $secţiune = app.FormularProcedură.$obiectulUrmăririi,
        $butonDeAdăugareSumăSechestrată = $secţiune.find('.adaugă-cîmp-personalizat.pentru-sume-sechestrate');

    $butonDeAdăugareSumăSechestrată.click();

    var $cîmpSumă = $secţiune.find('.personalizat.sume-sechestrate'),
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
    $formular.one('salvat', function() {
      $formular.one('închis', function() {
        app.ProceduriRecente.$.find('.item:first').click();
        $formular.one('populat', function() {
          var $cîmpSumă = $secţiune.find('.personalizat.sume-sechestrate'),
              $descriere = $cîmpSumă.find('.etichetă'),
              $valoare = $cîmpSumă.find('.sumă'),
              $valuta = $cîmpSumă.find('.valuta');

          equal($secţiune.find('#măsura-de-asigurare').val(), primaMăsură, 'găsit măsura-de-asigurare corespunzătoare');
          equal($secţiune.find('.personalizat').length, 1, 'găsit numărul corespunzător de cîmpuri personalizate: 1');
          ok($cîmpSumă.există(), 'la redeschidere s-a adăugat suma corespunzător');
          equal($descriere.val(), sume[0].descrierea, '…cu descrierea corespunzătoare');
          equal($valoare.val(), sume[0].suma, '…cu suma corespunzătoare');
          equal($valuta.val(), sume[0].valuta, '…cu valuta corespunzătoare');

          var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

          ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
          $butonPentruÎncheiere.click();

          var formular = app.Încheieri.formular($butonPentruÎncheiere),
              meta = app.Încheieri.deschise[formular];

          app.$(meta).one('iniţializat', function() {
            var $încheiere = app.$(this.tab.document),
                date = this.tab.Încheiere.date;

            equal(date.variaţie, 'aplicarea sechestrului', 'context: variaţie == “aplicarea sechestrului”');
            ok(date.cuSpecificare, 'context: cuSpecificare == true');
            ok(!date.fărăSpecificare, 'context: fărăSpecificare == false');
            equal(date.sumeSechestrate.length, 1, 'context: avem 0 sumeSechestrate');
            equal(date.bunuriSechestrate.length, 0, 'context: avem un număr corespunzător de sumeSechestrate');
            ok($.isArray(date.sumeSechestrate), 'context: sumeSechestrate e array');
            equal(date.sumeSechestrate[0].descrierea, sumă.descrierea, 'context: suma are descrierea corespunzătoare');
            equal(date.sumeSechestrate[0].suma, sumă.suma, 'context: suma are suma corespunzătoare');
            equal(date.sumeSechestrate[0].valuta, sumă.valuta, 'context: suma are valuta corespunzătoare');

            UtilitareÎncheiere.verificăŞoaptăButon($încheiere, $butonPentruÎncheiere);
            UtilitareÎncheiere.verificăSecţiuni($încheiere,
              ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia',  'Executorul']);

            var $secţiuneaChectiunea = $încheiere.find('section header:contains("Chestiunea")+.conţinut.editabil'),
                $secţiuneaDispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut.editabil'),
                text = sumă.descrierea + ' — ' + sumă.suma + ' ' + sumă.valuta;

            ok($secţiuneaChectiunea.find('p:contains("' + text + '")').există(),
              'bunul (' + text + ') este menţionat în secţiunea “Chestiunea”');
            equal($secţiuneaDispoziţia.find('li').length, 7, 'în secţiunea “Dispoziţia” sunt enumerate 7 puncte');

            $încheiere.find('.închide').click();

            $cîmpSumă.trigger('mousemove');

            var butonDeEliminare = $cîmpSumă.find('.elimină');

            ok(butonDeEliminare.există(), 'avem butonaş de eliminare sumă');
            butonDeEliminare.focus().click();

            setTimeout(function() { // slideUp?
              ok(!$secţiune.find('.personalizat.sume-sechestrate').există(), 'eliminat cîmp pentru suma sechestrată');

              start();
            }, 550);
          }); // one iniţializat
        });
      });
      $formular.find('button.închide').click();
    });

  });

  // ------------------------------------------

  asyncTest('Încheiere privind aplicarea măsurilor de asigurare a acţiunii: interzicerea debitorului de a săvîrşi anumite acţiuni', function() {
    var app = this.app,
        $formular = app.FormularProcedură.$,
        $secţiune = app.FormularProcedură.$obiectulUrmăririi,
        obiectulUrmăririi = 'aplicarea măsurilor de asigurare a acţiunii',
        măsuraDeAsigurare = 'interzicerea debitorului de a săvîrşi anumite acţiuni';

    app.$.fx.off = true;

    var $obiectulUrmăririi = $secţiune.find('#obiect');

    ok($obiectulUrmăririi.există(), 'avem cîmp pentru obiectul urmăririi');
    $obiectulUrmăririi.val(obiectulUrmăririi).trigger('change');
    equal($obiectulUrmăririi.val(), obiectulUrmăririi, 'setat obiectul urmăririi corespunzător');

    var $măsuraDeAsigurare = $secţiune.find('#măsura-de-asigurare');

    ok($măsuraDeAsigurare.există(), 'avem cîmp pentru măsura de asigurare');
    $măsuraDeAsigurare.val(măsuraDeAsigurare).trigger('change');
    equal($măsuraDeAsigurare.val(), măsuraDeAsigurare, 'setat măsura de asigurare corespunzător');

    var $acţiuni = $secţiune.find('textarea#acţiuni.lat'),
        acţiuni = 'Plecarea peste hotare.\n' +
          'Perfectarea permisului de conducere.';

    ok($acţiuni.există(), 'avem textarea lat pentru acţiuni');
    equal($acţiuni.val(), '', '…necompletat');
    $acţiuni.val(acţiuni);

    var procedură = app.FormularProcedură.colectează();

    equal(procedură['obiectul-urmăririi']['măsura-de-asigurare'], măsuraDeAsigurare, 'măsura de asigurare se colectează corespunzător');
    equal(procedură['obiectul-urmăririi']['acţiuni'], acţiuni, 'acţiunile se colectează corespunzător');

    var $butonDeSalvare = $formular.find('.bara-de-instrumente .salvează');

    ok($butonDeSalvare.există(), 'avem buton de salvare');
    $butonDeSalvare.click();

    $formular.one('salvat', function() {
      $formular.one('închis', function() {
        app.ProceduriRecente.$.find('.item:first').click();
        $formular.one('populat', function() {
          equal($măsuraDeAsigurare.val(), măsuraDeAsigurare, 'populat măsura de asigurare corespunzător');
          equal($acţiuni.val(), acţiuni, 'populat acţiuni corespunzător');

          var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

          ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
          $butonPentruÎncheiere.click();

          var formular = app.Încheieri.formular($butonPentruÎncheiere),
              meta = app.Încheieri.deschise[formular];

          app.$(meta).one('iniţializat', function() {
            var $încheiere = app.$(this.tab.document),
                date = this.tab.Încheiere.date;

            equal(date.variaţie, 'interzicerea debitorului de a săvîrşi anumite acţiuni',
              'context: variaţie == “interzicerea debitorului de a săvîrşi anumite acţiuni”');
            equal(date.acţiuni, acţiuni, 'context: acţiuni e setat corespunzător');

            var $secţiuneaChectiunea = $încheiere.find('section header:contains("Chestiunea")+.conţinut.editabil'),
                $secţiuneaDispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut.editabil');

            equal($secţiuneaChectiunea.find('blockquote').text(), acţiuni, 'acţiunile sunt menţionate în secţiunea “Chestiunea”');
            equal(date.normalizeazăSpaţii($secţiuneaDispoziţia.find('li').eq(2).text()), 'A interzice DEBITORULUI săvîrşirea acţiunilor menţionate.',
              'în secţiunea “Dispoziţia” se face referinţă la acţiunile menţionate în secţiunea “Chestiunea”');
            equal($secţiuneaDispoziţia.find('li').length, 3, 'secţiunea “Dispoziţia” enumeră 3 puncte');

            app.$.fx.off = false;

            setTimeout(function() {
              $încheiere.find('.închide').click();

              start();
            }, app.PAUZĂ_DE_OBSERVABILITATE);
          });
        });
      });
      $formular.find('button.închide').click();
    });
  });

  // ------------------------------------------

  asyncTest('Încheiere privind aplicarea măsurilor de asigurare a acţiunii: interzicerea altor persoane de a săvîrşi anumite acţiuni', function() {
    var app = this.app,
        $formular = app.FormularProcedură.$,
        $secţiune = app.FormularProcedură.$obiectulUrmăririi,
        obiectulUrmăririi = 'aplicarea măsurilor de asigurare a acţiunii',
        măsuraDeAsigurare = 'interzicerea altor persoane de a săvîrşi anumite acţiuni în privinţa obiectului în litigiu,' +
          ' inclusiv transmiterea de bunuri către debitor sau îndeplinirea unor alte obligaţii faţă de el';

    app.$.fx.off = true;

    var $obiectulUrmăririi = $secţiune.find('#obiect');

    ok($obiectulUrmăririi.există(), 'avem cîmp pentru obiectul urmăririi');
    $obiectulUrmăririi.val(obiectulUrmăririi).trigger('change');
    equal($obiectulUrmăririi.val(), obiectulUrmăririi, 'setat obiectul urmăririi corespunzător');

    var $măsuraDeAsigurare = $secţiune.find('#măsura-de-asigurare');

    ok($măsuraDeAsigurare.există(), 'avem cîmp pentru măsura de asigurare');
    $măsuraDeAsigurare.val(măsuraDeAsigurare).trigger('change');
    equal($măsuraDeAsigurare.val(), măsuraDeAsigurare, 'setat măsura de asigurare corespunzător');

    var $butonDeAdăugarePersoană = $formular.find('.adaugă.persoană.terţă');

    ok($butonDeAdăugarePersoană.există(), 'găsit butonul de adăugare persoană terţă');
    $butonDeAdăugarePersoană.click();

    var $persoanăTerţă = $formular.find('.persoană-terţă');
    var persoanăTerţă = {
      'gen-persoană': 'fizică',
      'nume': 'Philipe DOLORES',
      'idnp': '222333444555'
    };

    ok($persoanăTerţă.există(), 'adăugat persoană terţă');
    ok($persoanăTerţă.find('#gen-persoană').există(), 'avem cîmp pentru gen persoană');
    equal($persoanăTerţă.find('#gen-persoană').val(), 'juridică', '…implicit necompletat');
    $persoanăTerţă.find('#gen-persoană').val(persoanăTerţă['gen-persoană']).trigger('change');
    equal($persoanăTerţă.find('#gen-persoană').val(), persoanăTerţă['gen-persoană'], 'setat genul persoană corespunzător');

    ok($persoanăTerţă.find('#nume').există(), 'găsit cîmp pentru nume');
    equal($persoanăTerţă.find('#nume').val(), '', '…implicit necompletat');
    $persoanăTerţă.find('#nume').val(persoanăTerţă['nume']);

    ok($persoanăTerţă.find('#idnp').există(), 'găsit cîmp pentru IDNP');
    equal($persoanăTerţă.find('#idnp').val(), '', '…implicit necompletat');
    $persoanăTerţă.find('#idnp').val(persoanăTerţă['idnp']);

    var $acţiuni = $secţiune.find('textarea#acţiuni.lat'),
        acţiuni = 'Plecarea peste hotare.\n' +
          'Perfectarea permisului de conducere.';

    ok($acţiuni.există(), 'avem textarea lat pentru acţiuni');
    equal($acţiuni.val(), '', '…necompletat');
    $acţiuni.val(acţiuni);

    var $butonDeAdăugareBun = $secţiune.find('.adaugă-cîmp-personalizat.pentru-bunuri-în-litigiu');

    ok($butonDeAdăugareBun.există(), 'avem buton de adăugare bunuri');
    equal($butonDeAdăugareBun.text(), '+bun', '…cu textul corespunzător');
    $butonDeAdăugareBun.click();

    var $cîmpBun = $secţiune.find('.personalizat.bunuri-în-litigiu'),
        $descriere = $cîmpBun.find('.etichetă'), descriere = 'Descriere bun',
        $valoare = $cîmpBun.find('.sumă'),
        $valuta = $cîmpBun.find('.valuta');

    ok($cîmpBun.există(), 'la clic pe “+bun” se adaugă un cîmp corespunzător');
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

    var procedură = app.FormularProcedură.colectează(),
        bunuriColectate = procedură['obiectul-urmăririi']['bunuri-în-litigiu'];

    equal(procedură['obiectul-urmăririi']['măsura-de-asigurare'], măsuraDeAsigurare, 'măsura de asigurare se colectează corespunzător');
    equal(procedură['obiectul-urmăririi']['acţiuni'], acţiuni, 'acţiunile se colectează corespunzător');

    ok(bunuriColectate, 's-au colectat bunurile în litigiu');
    equal(bunuriColectate.length, 1, '…corespunzător un bun');
    equal(bunuriColectate[0].descrierea, bun.descrierea, '…cu descrierea corespunzătoare');
    equal(bunuriColectate[0].suma, bun.suma, '…cu suma corespunzătoare');
    equal(bunuriColectate[0].valuta, bun.valuta, '…cu valuta corespunzătoare');

    var persoaneTerţeColectate = procedură['persoane-terţe'];

    equal(persoaneTerţeColectate.length, 1, 'colectat un număr corespunzător de persoane terţe');
    equal(persoaneTerţeColectate[0]['gen-persoană'], persoanăTerţă['gen-persoană'], '…genul de persoană corespunde');
    equal(persoaneTerţeColectate[0]['nume'], persoanăTerţă['nume'], '…numele corespunde');
    equal(persoaneTerţeColectate[0]['idnp'], persoanăTerţă['idnp'], '…IDNP-ul corespunde');

    equal($valuta.val(), bun.valuta, 'valuta se setează corespunzător'); // verific pentru că e select

    var $butonDeSalvare = $formular.find('.bara-de-instrumente .salvează');

    ok($butonDeSalvare.există(), 'avem buton de salvare');
    $butonDeSalvare.click();

    $formular.one('salvat', function() {
      $formular.one('închis', function() {
        app.ProceduriRecente.$.find('.item:first').click();
        $formular.one('populat', function() {
          equal($măsuraDeAsigurare.val(), măsuraDeAsigurare, 'populat măsura de asigurare corespunzător');
          equal($acţiuni.val(), acţiuni, 'populat acţiuni corespunzător');

          var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

          ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
          $butonPentruÎncheiere.click();

          var formular = app.Încheieri.formular($butonPentruÎncheiere),
              meta = app.Încheieri.deschise[formular];

          app.$(meta).one('iniţializat', function() {
            var $încheiere = app.$(this.tab.document),
                date = this.tab.Încheiere.date;

            equal(date.variaţie, 'interzicerea altor persoane de a săvîrşi anumite acţiuni',
              'context: variaţie == “interzicerea altor persoane de a săvîrşi anumite acţiuni”');
            equal(date.acţiuni, acţiuni, 'context: acţiuni e setat corespunzător');
            ok(date.bunuriÎnLitigiu, 'context: avem bunuri');
            ok(app.$.isArray(date.bunuriÎnLitigiu), '…array');
            equal(date.bunuriÎnLitigiu.length, 1, '…într-un număr corespunzător');
            equal(JSON.stringify(date.bunuriÎnLitigiu), JSON.stringify(bunuriColectate), '…corespund cu cele colectate');

            var $secţiuneaChectiunea = $încheiere.find('section header:contains("Chestiunea")+.conţinut.editabil'),
                $secţiuneaDispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut.editabil'),
                textBun = bun.descrierea + ' — ' + bun.suma + ' ' + bun.valuta,
                textPersoană = persoanăTerţă.nume + ' (IDNP ' + persoanăTerţă.idnp + ')';

            equal($secţiuneaChectiunea.find('blockquote').text(), acţiuni, 'acţiunile sunt menţionate în secţiunea “Chestiunea”');
            equal(date.normalizeazăSpaţii($secţiuneaChectiunea.find('#bunuri li').text()), textBun,
              'bunurile sunt menţionate în secţiunea “Chestiunea”');
            equal(date.normalizeazăSpaţii($secţiuneaChectiunea.find('#persoane li').text()), textPersoană,
              'persoanele terţe sunt menţionate în secţiunea “Chestiunea”');
            equal(date.normalizeazăSpaţii($secţiuneaDispoziţia.find('li').eq(2).text()), 'A interzice PERSOANELOR TERŢE săvîrşirea acţiunilor menţionate.',
              'în secţiunea “Dispoziţia” se face referinţă la acţiunile menţionate în secţiunea “Chestiunea”');
            equal($secţiuneaDispoziţia.find('li').length, 3, 'secţiunea “Dispoziţia” enumeră 3 puncte');

            setTimeout(function() {
              $încheiere.find('.închide').click();

              $formular.one('închis', function() {
                ok(true, 'închis formularul de procedură');
                app.$.fx.off = false;
                start();
              });
              $formular.find('button.închide').click();
            }, app.PAUZĂ_DE_OBSERVABILITATE);
          });
        });
      });
      $formular.find('button.închide').click();
    });
  });

})();
