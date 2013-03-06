// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Încheiere de numire a datei ridicării a unor sume sau bunuri mobile', function () {
  /*global UtilitareÎncheiere:false */
  /*jshint maxlen:169 maxstatements:31 */
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi,
      obiect = 'efectuarea de către debitor a unor acţiuni obligatorii, legate de remiterea unor bunuri mobile';

  ok($formular.is(':visible'), 'formularul de procedură e deschis');
  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val(obiect).change();
  equal($secţiune.find('#obiect').val(), obiect, 'setat obiectul corespunzător');

  var dataŞiOraRidicării = '02.03.2013 ora 11:00';

  ok($secţiune.find('#data-şi-ora-ridicării').există(), 'avem cîmp pentru data şi ora ridicării');
  $secţiune.find('#data-şi-ora-ridicării').val(dataŞiOraRidicării);

  var $butonDeAdăugareBun, $cîmpBun;
  var bunuri = {
    'Bicicletă': {
      suma: 2500,
      valuta: 'MDL'
    },
    'Radio FM': {
      suma: 840,
      valuta: 'EUR'
    }
  }, numărDeBunuri = Object.keys(bunuri).length;

  (function adaugăBunuri() {
    $butonDeAdăugareBun = $secţiune.find('.adaugă-cîmp-personalizat.bun-ridicat'),

    ok($butonDeAdăugareBun.există(), 'avem buton pentru adăugare bunuri');
    equal($butonDeAdăugareBun.text(), '+bun', '…cu textul “+bun”');

    for (var nume in bunuri) {
      $butonDeAdăugareBun.click();
      $cîmpBun = $butonDeAdăugareBun.parent().prev('.personalizat');
      $cîmpBun.find('.etichetă').val(nume);
      $cîmpBun.find('.sumă').val(bunuri[nume].suma);
      $cîmpBun.find('.valuta').val(bunuri[nume].valuta);
    }

    equal($secţiune.find('.bunul-ridicat.personalizat').length, numărDeBunuri, 'avem cîmpuri pentru toate bunurile');
  })();


  var procedură = app.FormularProcedură.colectează(),
      bunuriColectate = procedură['obiectul-urmăririi']['bunuri-ridicate'],
      bun;

  (function verificăColectarea() {
    equal(procedură['obiectul-urmăririi']['bunuri-ridicate'].length, numărDeBunuri, 'colectare: avem numărul corespunzător de bunuri');

    for (var i = 0; i < numărDeBunuri; i++) {
      bun = bunuriColectate[i];

      ok(bun.descrierea in bunuri, 'colectare: ' + bun.descrierea + ': descrierea corespunde');
      equal(bun.suma, bunuri[bun.descrierea].suma, 'colectare: ' + bun.descrierea + ': suma corespunde');
      equal(bun.valuta, bunuri[bun.descrierea].valuta, 'colectare: ' + bun.descrierea + ': valuta corespunde');
    }
  })();


  $formular.find('.bara-de-instrumente .salvează').click();
  $formular.one('salvat', function () {
    ok(true, 'salvat');
    $formular.one('închis', function () {
      app.ProceduriRecente.$.find('.item:first').click();
      $formular.one('populat', function () {
        ok(true, 'redeschis şi populat');

        var $cîmpuriBunuri = $secţiune.find('.bunul-ridicat');

        equal($cîmpuriBunuri.length, numărDeBunuri, 'populare: numărul bunurilor corespunde');

        for (var i = 0; i < numărDeBunuri; i++) {
          equal($cîmpuriBunuri.eq(i).find('.etichetă').val(), bunuriColectate[i].descrierea, 'populare: descrierea corespunde');
          equal($cîmpuriBunuri.eq(i).find('input').val(), bunuriColectate[i].suma, 'populare: suma corespunde');
          equal($cîmpuriBunuri.eq(i).find('.valuta').val(), bunuriColectate[i].valuta, 'populare: valuta corespunde');
        }


        var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

        ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
        $butonPentruÎncheiere.click();

        var formular = app.ButoanePentruÎncheieri.formular($butonPentruÎncheiere),
            meta = app.Încheieri.deschise[formular];

        app.$(meta).one('iniţializat', function () {
          var $încheiere = app.$(this.tab.document),
              date = this.tab.Încheiere.date,
              subtitlu = 'de numire a datei ridicării a unor sume sau bunuri';

          ok(app.$.isArray(date.bunuri), 'lista de bunuri e definită în contextul încheierii');

          UtilitareÎncheiere.verificăŞoaptăButon($încheiere, $butonPentruÎncheiere);
          UtilitareÎncheiere.verificăSubtitlu($încheiere, subtitlu);
          UtilitareÎncheiere.verificăSecţiuni($încheiere,
            ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

          var $secţiuneaMotivele = $încheiere.find('section header:contains("Motivele")+.conţinut.editabil'),
              $listaBunuri = $secţiuneaMotivele.find('ol'),
              item;

          for (var nume in bunuri) {
            item = nume + ' — ' + bunuri[nume].suma + ' ' + bunuri[nume].valuta;
            ok($listaBunuri.find('li:contains("' + item + '")').există(), 'bunul “' + item + '” şi valoarea lui este menţionat în lista de bunuri');
          }

          var $secţiuneaDispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut.editabil');

          ok($secţiuneaDispoziţia.find('p:contains("' + dataŞiOraRidicării + '")').există(), 'e menţionată data şi ora ridicării în secţiunea “Dispoziţia”');
          ok(!$secţiuneaDispoziţia.find('p:contains("Ridicarea forţată în cadrul acestei proceduri a fost amînată pînă la")').există(),
              'în secţiunea “Dispoziţia” NU se menţionează amînare dacă nu avem amînări în procedură');

          setTimeout(function () {
            $încheiere.find('.închide').click();

            var $butonDeAdăugareAmînare = $secţiune.find('.adaugă-cîmp-personalizat.amînare');

            ok($butonDeAdăugareAmînare.există(), 'avem buton de adăugare amînări');
            $butonDeAdăugareAmînare.click();

            setTimeout(function () {
              var $cîmpPentruAmînare = $butonDeAdăugareAmînare.parent().prev('.amînare.personalizat'),
                  dataŞiOraAmînării = '03.03.2013 ora 11:00';

              ok($cîmpPentruAmînare.există(), '…care adaugă un cîmp pentru amînare, personalizabil');
              $cîmpPentruAmînare.find('.dată').val(dataŞiOraAmînării);

              $butonPentruÎncheiere.click();
              meta = app.Încheieri.deschise[formular];

              app.$(meta).one('iniţializat', function () {
                var $încheiere = app.$(this.tab.document),
                    date = this.tab.Încheiere.date,
                    $secţiuneaMotivele = $încheiere.find('section header:contains("Motivele")+.conţinut.editabil'),
                    $secţiuneaDispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut.editabil');

                ok(true, 'cînd executarea este amînată…');
                ok(date.amînată, '…în date avem flag care marchează amînarea ridicării');
                equal(date.ultimaAmînare, dataŞiOraAmînării, '…în date avem data şi ora amînării');

                ok($secţiuneaMotivele.find('p:contains("' + dataŞiOraAmînării + '")').există(), '…în secţiunea “Motivele” este menţionată data şi ora amînării');
                ok($secţiuneaDispoziţia.find('p:contains("' + dataŞiOraAmînării + '")').există(), '…în secţiunea “Motivele” este menţionată data şi ora amînării');
                ok(!$secţiuneaDispoziţia.find('p:contains("' + dataŞiOraRidicării + '")').există(), '…în secţiunea “Motivele” NU este menţionată data şi ora ridicării');

                $încheiere.find('.închide').click();
                start();
              });
            }, app.PAUZĂ_DE_OBSERVABILITATE);
          }, app.PAUZĂ_DE_OBSERVABILITATE);
        });
      }); // one populat
    }); // one închis

    $formular.find('button.închide').click();
  }); // one salvat
});
