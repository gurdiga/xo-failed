asyncTest('Formular procedură: cheltuieli (populare)', function () {
  /*jshint maxlen:139*/
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $proceduriRecente = app.ProceduriRecente.$,
      $categoriiCheltuieli = app.Cheltuieli.categorii.$,
      $totalTaxeŞiSpeze = $formular.find('#total-taxe-şi-speze'),
      $cheltuieliAdăugate = app.Cheltuieli.$adăugate,
      dateColectate = {},
      primulDocument = 'Primul document',
      alDoileaDocument = 'Al doilea document';

  app.$.fx.off = true;
  ok($formular.is(':not(:visible)'), 'formularul e închis');

  $formular.one('populat', function () {
    ok(true, 'deschis formularul');

    adaugăCheltuieli();
  });

  $proceduriRecente.find('.item:first').click();

  // ------------------------------------------------
  function adaugăCheltuieli() {
    $cheltuieliAdăugate.children().remove();

    // ne asigurăm că procedura va fi considerată modificată
    $formular.find('#note-pj').val(+new Date());

    $categoriiCheltuieli.find('#taxaA1').click();
    equal($totalTaxeŞiSpeze.val(), app.UC, 'total cheltuieli = 1UC după adăugarea taxei A1');

    var $taxaA1 = $cheltuieliAdăugate.find('#taxaA1');

    ok($taxaA1.find('.achitare :checkbox').există(), 'găsit bifă pentru achitare');
    ok($taxaA1.find('.achitare :checkbox').is(':not(:checked)'), '…nebifată iniţial');
    ok($taxaA1.find('.achitare .dată').există(), 'găsit cîmp pentur data achitării');
    equal($taxaA1.find('.achitare .dată').val(), '', '…necompletat iniţial');

    // emulare comportament normal
    // .click() aparent nu e suficient pentru că handler-ul vede :checkbox-ul ca :not(:checked)
    $taxaA1.find('.achitare :checkbox').attr('checked', true).click();
    ok($taxaA1.is('.achitat'), 'la bifare marcat item vizual achitat');
    equal($taxaA1.find('.achitare .dată').val(), app.moment().format(app.FORMATUL_DATEI),
      '…completat cîmpul pentru data achitării cu data de azi');
    // …emulare comportament normal
    $taxaA1.find('.achitare :checkbox').attr('checked', true);

    dateColectate = app.FormularProcedură.colectează();
    ok(dateColectate.cheltuieli.itemi, 'avem itemi în cheltuielile colectate');
    ok(dateColectate.cheltuieli.itemi.taxaA1, '…cu taxaA1');
    equal(dateColectate.cheltuieli.itemi.taxaA1['achitat'], true, '……marcată achitată');
    equal(dateColectate.cheltuieli.itemi.taxaA1['data-achitării'], app.moment().format(app.FORMATUL_DATEI),
      '……data colectată corespunzător');

    $categoriiCheltuieli.find('#taxaA2').click();
    dateColectate = app.FormularProcedură.colectează();
    equal($totalTaxeŞiSpeze.val(), 4 * app.UC, 'total cheltuieli = 4UC după adăugarea taxei A2');
    ok(dateColectate.cheltuieli.itemi.taxaA2, '…colectat taxaA2');
    equal(dateColectate.cheltuieli.itemi.taxaA2['achitat'], false, '……marcată neachitată');
    equal(dateColectate.cheltuieli.itemi.taxaA2['data-achitării'], '', '……fără data achitării');

    adaugăTaxaB1();

    $formular.find('.bara-de-instrumente .salvează').click();
    $formular.one('salvat', function () {
      ok(true, 'salvat');

      $formular.one('închidere', function () {
        ok(true, 'închis formularul');

        verificăPopulare();
      });
      $formular.find('.închide').click();
    });
  }

  // ------------------------------------------------
  function adaugăTaxaB1() {
    /*jshint maxstatements:100*/
    $categoriiCheltuieli.find('#taxaB1').click();

    var $taxaB1 = $cheltuieliAdăugate.find('#taxaB1'),
        $document = $taxaB1.find('.document'),
        $destinatariAdăugaţi = $document.find('.destinatari-adăugaţi'),
        $butonDeAdăugareDestinatari = $document.find('.adaugă-destinatar');

    ok($taxaB1.există(), 'adăugat taxa B1');
    ok($document.există(), 'implicit avem un document');
    ok($document.find('.denumire').există(), '…cu denumire');
    equal($document.find('.denumire').val(), '', '……necompletată');
    $document.find('.denumire').val(primulDocument);

    ok($destinatariAdăugaţi.există(), '…cu lista de destinatari adăugaţi deja');
    ok($destinatariAdăugaţi.is('.comprimaţi'), '……comprimaţi');
    equal($destinatariAdăugaţi.children().length, 0, '……cu nici un destinatar adăugat implicit');
    ok($butonDeAdăugareDestinatari.există(), '…cu buton de adăugare destinatari');

    $butonDeAdăugareDestinatari.trigger('mouseenter');
    ok($butonDeAdăugareDestinatari.find('#destinatari').există(), 'la hover pe “+destinatari” se afişează lista');

    var $destinatari = app.Destinatari.$,
        $registratoriIndependenţi = $destinatari.find('.listă>.titlu:contains("Registratori independenţi")');

    ok($destinatari.există(), 'avem destinatari');
    ok($registratoriIndependenţi.există(), 'găsit lista de Registratori independenţi');
    ok($registratoriIndependenţi.find('.adaugă-toate').există(), '…buton de adpugare toţi itemi');
    ok($registratoriIndependenţi.next('.itemi'), '…cu itemi');
    equal($registratoriIndependenţi.next('.itemi').children().length, 11, '…11');

    $registratoriIndependenţi.next().children().first().click();
    equal($destinatariAdăugaţi.children().length, 1,
      'la click pe un item din #destinatari el se adaugă în lista destinatarilor adăugaţi');
    equal($totalTaxeŞiSpeze.val(), 5 * app.UC, '…total cheltuieli = 5UC după adăugarea unui registrator independent');

    $registratoriIndependenţi.find('.adaugă-toate').click();
    equal($destinatariAdăugaţi.children().length, $registratoriIndependenţi.next('.itemi').find('li').length,
      'la click pe “+toate” se adaugă toţi itemii din lista respectivă');
    equal($totalTaxeŞiSpeze.val(), 5 * app.UC,
      '…total cheltuieli = 5UC chiar şi după adăugarea tuturor registratorilor independenţi');

    var $butonDeAdăugareDocument = $taxaB1.find('.document+li>button.adaugă');

    ok($butonDeAdăugareDocument.există(), 'avem buton de adăugare document');
    equal($butonDeAdăugareDocument.text(), '+document', '…cu textul “+document”');

    $butonDeAdăugareDocument.click();
    equal($taxaB1.find('.document').length, 2, 'adăugat încă un document');

    var $alDoileaDocument = $taxaB1.find('.document').last();

    ok($alDoileaDocument.find('.denumire').există(), '…are cîmp pentru denumire');
    equal($alDoileaDocument.find('.denumire').val(), '', '……necompletată');
    $alDoileaDocument.find('.denumire').val(alDoileaDocument);

    ok($alDoileaDocument.find('.destinatari-adăugaţi').există(), 'are listă de destinatari');
    equal($alDoileaDocument.find('.destinatari-adăugaţi>li').length, 0, '…cu 0 destinatari implicit');
    ok($alDoileaDocument.find('.adaugă-destinatar').există(), 'are buton de adăugat destinatari');

    $alDoileaDocument.find('.adaugă-destinatar').trigger('mouseenter');
    ok($alDoileaDocument.find('.adaugă-destinatar').find('#destinatari').există(), '…care afişează lista');

    var $listaPărţiProcedură = $destinatari.find('.listă .titlu:contains("Părţile procedurii")');

    ok($listaPărţiProcedură.există(), 'în destinatari găsit “Părţile procedurii”');
    ok($listaPărţiProcedură.find('.adaugă-toate').există(), '…cu butonaş pentru a adăuga toţi itemii');
    ok($listaPărţiProcedură.next('.itemi').există, '…cu listă de itemi');
    equal($listaPărţiProcedură.next('.itemi').children().length, 2, '……cu 2 itemi');

    $listaPărţiProcedură.find('.adaugă-toate').click();
    equal($alDoileaDocument.find('.destinatari-adăugaţi>li').length, 2, 'adăugat părţile');
    equal($totalTaxeŞiSpeze.val(), (5 + 2 * 0.25) * app.UC,
      '…total cheltuieli = (5 + 2*0.25) UC chiar şi după adăugarea tuturor registratorilor independenţi');

    var $persoanăTerţă = $destinatari.find('.persoană.terţă');

    ok($persoanăTerţă.există(), 'avem opţiunea de a adăuga o persoană terţă ca destinatar');

    $persoanăTerţă.click();
    equal($alDoileaDocument.find('.destinatari-adăugaţi>li').length, 3, '…la click se adaugă la lista de destinatari adăugaţi');
    ok($alDoileaDocument.find('.destinatari-adăugaţi>li').last().is('.persoană.terţă'), '……ultimul item');

    var $cîmpPersoanăTerţă = $alDoileaDocument.find('.destinatari-adăugaţi>li').last().find('input'),
        persoanăTerţă = 'George BUŞILĂ';

    ok($cîmpPersoanăTerţă.există(), '……cu cîmp');
    ok($cîmpPersoanăTerţă.is(':focused'), '………focusat');
    equal($cîmpPersoanăTerţă.val(), '', '……necompletat');

    $cîmpPersoanăTerţă.val(persoanăTerţă);
    equal($cîmpPersoanăTerţă.val(), persoanăTerţă, '…setat numele persoanei terţe corespunzător');

    dateColectate = app.FormularProcedură.colectează();
    ok(dateColectate.cheltuieli.itemi.taxaB1, '…colectat taxaB1');
    equal(dateColectate.cheltuieli.itemi.taxaB1['achitat'], false, '……marcată neachitată');
    equal(dateColectate.cheltuieli.itemi.taxaB1['data-achitării'], '', '……fără data achitării');

    var documenteColectate = dateColectate.cheltuieli.itemi.taxaB1['subformular'];

    ok($.isArray(documenteColectate), '……cu o listă de documente');
    equal(documenteColectate.length, 2, '……din 2 itemi');
    ok($.isArray(documenteColectate[0].destinatari), '……primul document are o listă de destinatari');
    equal(documenteColectate[0].destinatari.length, $destinatariAdăugaţi.children().length, '………în număr corespunzător');
    deepEqual(documenteColectate[0].destinatari, $destinatariAdăugaţi.children().map(function () { return this.innerHTML; }).get(),
      '………corespund în particular');
    deepEqual(documenteColectate[0]['destinatari-persoane-terţe'], [], '……nu are destinatari persoane terţe');
    equal(documenteColectate[0].document, primulDocument, '……denumirea documentului corespunde');

    var părţile = $alDoileaDocument.find('.destinatari-adăugaţi>li:not(.persoană.terţă)').map(function () {
      return this.innerHTML;
    }).get();

    deepEqual(documenteColectate[1].destinatari, părţile, 'al doilea document are părţile procedurii ca destinatari');
    deepEqual(documenteColectate[1]['destinatari-persoane-terţe'], [persoanăTerţă], '…dar are persoanele terţe corespunzătoare');
    equal(documenteColectate[1].document, alDoileaDocument, '……şi are denumirea corespunzătoare');
  }

  // ------------------------------------------------
  function verificăPopulare() {
    $formular.one('populat', function () {
      ok(true, 'redeschis formularul');

      equal($cheltuieliAdăugate.children().length, 3, 's-au repopulat 3 itemi');

      var $taxaA1 = $cheltuieliAdăugate.children().eq(0);

      equal($taxaA1.attr('id'), 'taxaA1', 'primul item e taxaA1');
      ok($taxaA1.find('.achitare :checkbox').is(':checked'), '…bifată achitată');
      equal($taxaA1.find('.achitare .dată').val(), app.moment().format(app.FORMATUL_DATEI), '…data achitării este completată');

      var $taxaA2 = $cheltuieliAdăugate.children().eq(1);

      equal($taxaA2.attr('id'), 'taxaA2', 'al doilea item e taxaA2');
      ok($taxaA2.find('.achitare :checkbox').is(':not(:checked)'), '…marcată neachitată (debifată)');
      equal($taxaA2.find('.achitare .dată').val(), '', '…data achitării este necompletată corespunzător');

      var $taxaB1 = $cheltuieliAdăugate.children().eq(2);

      equal($taxaB1.attr('id'), 'taxaB1', 'al treilea item e taxaB1');
      ok($taxaB1.find('.achitare :checkbox').is(':not(:checked)'), '…marcată neachitată (debifată)');
      equal($taxaB1.find('.achitare .dată').val(), '', '…data achitării este necompletată corespunzător');
      equal($taxaB1.find('.subformular .document').length, 2, '…documentele sunt în număr corespunzător');

      var $primulDocument = $taxaB1.find('.subformular .document').eq(0);

      equal($primulDocument.find('.denumire').val(), primulDocument, '…data achitării este necompletată corespunzător');
      equal($primulDocument.find('.destinatari-adăugaţi').children().length, 11, '…destinatarii adăugaţi sunt în număr corespunzător');

      $taxaB1.remove();
      închideFormularul();
    });

    $proceduriRecente.find('.item:first').click();
  }

  // ------------------------------------------------
  function închideFormularul() {
    $formular.find('.bara-de-instrumente .salvează').click();
    $formular.one('salvat', function () {
      ok(true, 'salvat');

      $formular.one('închidere', function () {
        ok(true, 'închis formularul');

        app.$.fx.off = false;
        start();
      });
      $formular.find('.închide').click();
    });
  }
});
