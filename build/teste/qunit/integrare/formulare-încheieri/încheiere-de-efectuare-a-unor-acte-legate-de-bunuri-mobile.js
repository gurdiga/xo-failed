// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Încheiere de numire a datei ridicării a unor sume sau bunuri', function () {
  /*global UtilitareÎncheiere:false */
  /*jshint maxlen:145 maxstatements:31 */
  'use strict';

  var app = this.app,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi;

  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val('efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri mobile').change();

  var dataŞiOraRidicării = '02.03.2013 ora 11:00';

  ok($secţiune.find('#data-şi-ora-ridicării').există(), 'avem cîmp pentru data şi ora ridicării');
  $secţiune.find('#data-şi-ora-ridicării').val(dataŞiOraRidicării);

  var $butonDeAdăugareBun = $secţiune.find('.adaugă-cîmp-personalizat.sumă'),
      $cîmpBun, nume, i = 0;

  ok($secţiune.find('.sumă.personalizat').există(), 'un cîmp pentru bunuri se adaugă implicit');
  ok($butonDeAdăugareBun.există(), 'avem buton pentru adăugare bunuri');
  equal($butonDeAdăugareBun.text(), '+bun', '…cu textul “+bun”');

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

  for (nume in bunuri) {
    $cîmpBun = $butonDeAdăugareBun.parent().prev('.personalizat');
    $cîmpBun.find('.etichetă').val(nume);
    $cîmpBun.find('.sumă').val(bunuri[nume].suma);
    $cîmpBun.find('.valuta').val(bunuri[nume].valuta);

    i++;
    if (i < numărDeBunuri) $butonDeAdăugareBun.click();
  }

  equal($secţiune.find('.sumă.personalizat').length, numărDeBunuri, 'avem cîmpuri pentru toate bunurile');

  var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

  ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
  $butonPentruÎncheiere.click();

  var formular = app.ButoanePentruÎncheieri.formular($butonPentruÎncheiere),
      meta = app.Încheieri.deschise[formular];

  app.$(meta).one('iniţializat', function () {
    var $încheiere = app.$(this.tab.document),
        date = this.tab.Încheiere.date,
        subtitlu = 'de numire a datei ridicării a unor sume sau bunuri';

    ok(app.$.isPlainObject(date.bunuri), 'lista de bunuri e definită în contextul încheierii');

    UtilitareÎncheiere.verificăŞoaptăButon($încheiere, $butonPentruÎncheiere);
    UtilitareÎncheiere.verificăSubtitlu($încheiere, subtitlu);
    UtilitareÎncheiere.verificăSecţiuni($încheiere,
      ['Procedura', 'Creditorul', 'Debitorul', 'Chestiunea', 'Motivele', 'Dispoziţia', 'Executorul']);

    var $secţiuneaMotivele = $încheiere.find('section header:contains("Motivele")+.conţinut.editabil'),
        $listaBunuri = $secţiuneaMotivele.find('ol'),
        item;

    for (var nume in bunuri) {
      item = nume + ' ' + bunuri[nume].suma + ' ' + bunuri[nume].valuta;
      ok($listaBunuri.find('li:contains("' + item + '")').există(), 'bunul “' + item + '” şi valoarea lui este menţionat în lista de bunuri');
    }

    var $secţiuneaDispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut.editabil');

    ok($secţiuneaDispoziţia.find('p:contains("' + dataŞiOraRidicării + '")').există(), 'e menţionată data şi ora ridicării');
    ok(!$secţiuneaDispoziţia.find('p:contains("Ridicarea forţată în cadrul acestei proceduri a fost amînată pînă la")').există(),
        'NU se menţionează amînare dacă nu avem amînări în procedură');

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
              $secţiuneaMotivele = $încheiere.find('section header:contains("Motivele")+.conţinut.editabil'),
              $secţiuneaDispoziţia = $încheiere.find('section header:contains("Dispoziţia")+.conţinut.editabil');

          ok($secţiuneaMotivele.find('p:contains("' + dataŞiOraAmînării + '")').există(), 'este menţionată data şi ora amînării');
          ok($secţiuneaDispoziţia.find('p:contains("' + dataŞiOraAmînării + '")').există(), 'este menţionată data şi ora amînării');
          ok(!$secţiuneaDispoziţia.find('p:contains("' + dataŞiOraRidicării + '")').există(), 'NU este menţionată data şi ora ridicării');

          app.FormularProcedură.$.find('.închide').click();
          app.$(app.FormularProcedură.$).one('închidere', function () {
            ok(true, 'închis formularul de procedură');

            start();
          });
        });
      }, app.PAUZĂ_DE_OBSERVABILITATE);
    }, app.PAUZĂ_DE_OBSERVABILITATE);
  });
});
