// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Somaţie de stabilire a domiciliului copilului', function () {
  /*global UtilitareÎncheiere:false */
  /*jshint maxlen:162 */
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi,
      obiect = 'stabilirea domiciliului copilului';

  ok($formular.is(':visible'), 'formularul de procedură e deschis');
  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val(obiect).change();
  equal($secţiune.find('#obiect').val(), obiect, 'setat obiectul corespunzător');

  var $numeleCopilului = $secţiune.find('#numele-copilului'),
      $dataNaşteriiCopilului = $secţiune.find('#data-naşterii-copilului'),
      $dataPrezentăriiDebitorului = $secţiune.find('#data-prezentării-debitorului');

  ok($numeleCopilului.există(), 'avem cîmp pentru numele copilului');
  equal($numeleCopilului.val(), '', '…implicit necompletat');
  ok($dataNaşteriiCopilului.există(), 'avem cîmp pentru data naşterii copilului');
  equal($dataNaşteriiCopilului.val(), '', '…implicit necompletat');
  ok($dataPrezentăriiDebitorului.există(), 'avem cîmp pentru data prezentării creditorului în oficiu');
  equal($dataPrezentăriiDebitorului.val(), '', '…implicit necompletat');

  var numeleCopilului = 'John DOE',
      dataNaşteriiCopilului = '01.01.2000',
      dataPrezentăriiDebitorului = '05.06.2012 ora 12:00';

  $numeleCopilului.val(numeleCopilului);
  $dataNaşteriiCopilului.val(dataNaşteriiCopilului);
  $dataPrezentăriiDebitorului.val(dataPrezentăriiDebitorului);


  var procedură = app.FormularProcedură.colectează();

  (function verificăColectarea() {
    equal(procedură['obiectul-urmăririi']['numele-copilului'], numeleCopilului, 'colectarea: numele copilului');
    equal(procedură['obiectul-urmăririi']['data-naşterii-copilului'], dataNaşteriiCopilului, 'colectarea: data naşterii copilului');
    equal(procedură['obiectul-urmăririi']['data-prezentării-debitorului'], dataPrezentăriiDebitorului, 'colectarea: data prezentării debitorului');
  })();


  $formular.find('.bara-de-instrumente .salvează').click();
  $formular.one('salvat', function () {
    ok(true, 'salvat');
    $formular.one('închis', function () {
      app.ProceduriRecente.$.find('.item:first').click();
      $formular.one('populat', function () {
        ok(true, 'redeschis şi populat');

        equal($numeleCopilului.val(), numeleCopilului, 'populat: numele copilului');
        equal($dataNaşteriiCopilului.val(), dataNaşteriiCopilului, 'populat: data naşterii copilului');
        equal($dataPrezentăriiDebitorului.val(), dataPrezentăriiDebitorului, 'populat: data prezentării debitorului');


        var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

        ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
        $butonPentruÎncheiere.click();

        var formular = app.ButoanePentruÎncheieri.formular($butonPentruÎncheiere),
            meta = app.Încheieri.deschise[formular];

        app.$(meta).one('iniţializat', function () {
          var $încheiere = app.$(this.tab.document),
              date = this.tab.Încheiere.date,
              subtitlu = 'cu privire la executarea documentului executoriu de stabilire a domiciliului copilului minor';

          UtilitareÎncheiere.verificăŞoaptăButon($încheiere, $butonPentruÎncheiere);
          UtilitareÎncheiere.verificăSubtitlu($încheiere, subtitlu);
          UtilitareÎncheiere.verificăSecţiuni($încheiere, ['Procedura', 'Creditorul', 'Debitorul', 'Executorul']);

          var $conţinut = $încheiere.find('section .conţinut.pe-toată-foaia');

          ok($conţinut.există(), 'avem secţiunea atotcuprinzătoare');
          ok($conţinut.find('p:contains("' + numeleCopilului + '")').există(), 'e menţionat numele copilului');
          ok($conţinut.find('p:contains("' + dataNaşteriiCopilului + '")').există(), 'e menţionată data naşterii copilului');
          ok($conţinut.find('p:contains("' + date.executor.telefon + '")').există(), 'e menţionat telefonul executorului');
          ok($conţinut.find('p:contains("' + dataPrezentăriiDebitorului + '")').există(), 'e menţionată data prezentării debitorului în oficiu');

          setTimeout(function () {
            $încheiere.find('.închide').click();

            start();
          }, app.PAUZĂ_DE_OBSERVABILITATE);
        });
      }); // one populat
    }); // one închis

    $formular.find('button.închide').click();
  }); // one salvat
});
