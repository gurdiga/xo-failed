// formularul de procedură trebuie se fi rămas deschis de la încheierile-referitoare-la-obiectul-urmăririi.js
asyncTest('Somaţie de restabilire a salariatului la locul de muncă', function () {
  /*global UtilitareÎncheiere:false */
  /*jshint maxlen:140 */
  'use strict';

  var app = this.app,
      $formular = app.FormularProcedură.$,
      $secţiune = app.FormularProcedură.$obiectulUrmăririi,
      obiect = 'restabilirea la locul de muncă';

  ok($formular.is(':visible'), 'formularul de procedură e deschis');
  $secţiune.find('#caracter').val('nonpecuniar').change();
  $secţiune.find('#obiect').val(obiect).change();
  equal($secţiune.find('#obiect').val(), obiect, 'setat obiectul corespunzător');

  var funcţie = 'pilot de curse',
      salariuRecuperat = '12000';

  ok($secţiune.find('#funcţie').există(), 'avem cîmp pentru funcţie');
  equal($secţiune.find('#funcţie').val(), '', '…implicit necompletat');
  $secţiune.find('#funcţie').val(funcţie);
  ok($secţiune.find('#salariu-recuperat').există(), 'avem cîmp pentru suma salariului recuperat');
  equal($secţiune.find('#salariu-recuperat').val(), '', '…implicit necompletat');
  $secţiune.find('#salariu-recuperat').val(salariuRecuperat);


  var procedură = app.FormularProcedură.colectează();

  (function verificăColectarea() {
    equal(procedură['obiectul-urmăririi']['funcţie'], funcţie, 'colectarea: funcţia');
    equal(procedură['obiectul-urmăririi']['salariu-recuperat'], salariuRecuperat, 'colectarea: salariul recuperat');
  })();


  $formular.find('.bara-de-instrumente .salvează').click();
  $formular.one('salvat', function () {
    ok(true, 'salvat');
    $formular.one('închis', function () {
      app.ProceduriRecente.$.find('.item:first').click();
      $formular.one('populat', function () {
        ok(true, 'redeschis şi populat');

        equal($secţiune.find('#funcţie').val(), funcţie, 'popularea: funcţie');
        equal($secţiune.find('#salariu-recuperat').val(), salariuRecuperat, 'popularea: salariul lrecuperat');


        var $butonPentruÎncheiere = $secţiune.find('#obiect~.buton[data-formular]');

        ok($butonPentruÎncheiere.există(), 'găsit butonaşul pentru încheiere');
        $butonPentruÎncheiere.click();

        var formular = app.Încheieri.butonaşe.formular($butonPentruÎncheiere),
            meta = app.Încheieri.deschise[formular];

        app.$(meta).one('iniţializat', function () {
          var $încheiere = app.$(this.tab.document),
              subtitlu = 'de restabilire a salariatului la locul de muncă';

          UtilitareÎncheiere.verificăŞoaptăButon($încheiere, $butonPentruÎncheiere);
          UtilitareÎncheiere.verificăSubtitlu($încheiere, subtitlu);
          UtilitareÎncheiere.verificăSecţiuni($încheiere, ['Procedura', 'Creditorul', 'Debitorul', 'Executorul']);

          var $conţinut = $încheiere.find('section .conţinut.pe-toată-foaia');

          ok($conţinut.există(), 'avem secţiunea atotcuprinzătoare');
          equal($conţinut.find('p:contains("' + funcţie + '")').length, 2, 'se menţionează funcţia în două rînduri');

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

