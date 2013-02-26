module('Bara de sus');

asyncTest('Calculator dobînzi de întîrziere', function () {
  'use strict';

  var app = window.frames['app'],
      $buton = app.$('#bara-de-sus .instrumente .calculator'),
      $dialog = $buton.prev('.dialog'),
      calcule;

  app.$.fx.off = true;

  ok($buton.există(), 'avem buton');

  $buton.click();

  $dialog.one('afişare', function () {
    ok($dialog.is(':visible'), 'la click se afişează dialogul');

    verificăŞiCompleteazăCîmpurile($dialog);
    verificăDetaliileCalculului($dialog);

    setTimeout(function () { // aşteptăm o leacă să fie urmăribil testul
      verificăRaportul($dialog);
    }, app.PAUZĂ_DE_OBSERVABILITATE);
  });

  // ------------------------
  function verificăŞiCompleteazăCîmpurile($dialog) {
    var $început = $dialog.find('input.dată.început.perioadă'),
        $sfîrşit = $dialog.find('input.dată.sfîrşit.perioadă'),
        $rataAplicată = $dialog.find('input[name="rată-calculator"][type="radio"]'),
        $suma = $dialog.find('input.sumă.întîrziată'),
        $dobînda = $dialog.find('input.sumă.dobîndă');

    ok($început.există(), 'avem cîmp pentru început perioadă');
    ok($început.next('.ui-icon-calendar').există(), '…cu calendar');
    equal($început.val(), '', '…necompletat');

    ok($sfîrşit.există(), 'avem cîmp pentru sfîrşit perioadă');
    ok($sfîrşit.next('.ui-icon-calendar').există(), '…cu calendar');
    equal($sfîrşit.val(), '', '…necompletat');

    ok($rataAplicată.există(), 'avem opţiuni radio pentru rata aplicată');
    equal($rataAplicată.length, 2, '…cu 2 opţiuni');
    equal($rataAplicată.eq(0).val(), 5, '…prima e 5%');
    equal($rataAplicată.eq(1).val(), 9, '…prima e 9%');
    ok($rataAplicată.eq(1).is(':checked'), '…9% e bifat');

    ok($suma.există(), 'avem cîmp pentru sumă');
    equal($suma.next('b').text(), 'MDL', '…cu eticheta MDL');
    equal($suma.val(), '', '…necompletat');

    ok($dobînda.există(), 'avem cîmp pentru dobîndă');
    ok($dobînda.is('[readonly]'), '…readonly');
    ok($dobînda.next('.ui-icon-locked').există(), '…marcat readonly cu iconiţă');
    equal($dobînda.siblings('b').text(), 'MDL', '…cu eticheta MDL');
    equal($dobînda.val(), '', '…necompletat');
    ok($dobînda.siblings('.ui-icon-document.buton').există(), '…cu iconiţă pentru detalii calcul');

    $început.val('04.09.2009');
    $sfîrşit.val('14.06.2012');
    $suma.val('363761.50').trigger('input');
    equal($dobînda.val(), '162227.68', 'dobînda se calculează corect');
  }

  // ------------------------
  function verificăDetaliileCalculului($dialog) {
    /*jshint maxlen:5594 */
    var întîrziere = app.Subsecţiuni.întîrzieri.colectează($dialog),
        calculeCorecte = '{"dobînda":"162227.68","detalii":{"începutPerioadă":"04.09.2009","sfîrşitPerioadă":"14.06.2012","rata":9,"suma":"363761.50","rînduri":{"2009-08-14":{"data":"04.09.2009","durata":4,"rata":7,"dobînda":637.83},"2009-09-08":{"data":"08.09.2009","durata":147,"rata":5,"dobînda":20510.17},"2010-02-02":{"data":"02.02.2010","durata":28,"rata":6,"dobînda":4185.75},"2010-03-02":{"data":"02.03.2010","durata":28,"rata":6,"dobînda":4185.75},"2010-03-30":{"data":"30.03.2010","durata":35,"rata":7,"dobînda":5581},"2010-05-04":{"data":"04.05.2010","durata":28,"rata":7,"dobînda":4464.8},"2010-06-01":{"data":"01.06.2010","durata":28,"rata":7,"dobînda":4464.8},"2010-06-29":{"data":"29.06.2010","durata":35,"rata":7,"dobînda":5581},"2010-08-03":{"data":"03.08.2010","durata":31,"rata":7,"dobînda":4943.17},"2010-09-03":{"data":"03.09.2010","durata":32,"rata":7,"dobînda":5102.63},"2010-10-05":{"data":"05.10.2010","durata":31,"rata":7,"dobînda":4943.17},"2010-11-05":{"data":"05.11.2010","durata":28,"rata":7,"dobînda":4464.8},"2010-12-03":{"data":"03.12.2010","durata":35,"rata":7,"dobînda":5581},"2011-01-07":{"data":"07.01.2011","durata":27,"rata":8,"dobînda":4574.43},"2011-02-03":{"data":"03.02.2011","durata":29,"rata":8,"dobînda":4913.27},"2011-03-04":{"data":"04.03.2011","durata":35,"rata":8,"dobînda":5929.81},"2011-04-08":{"data":"08.04.2011","durata":28,"rata":8,"dobînda":4743.85},"2011-05-06":{"data":"06.05.2011","durata":28,"rata":8,"dobînda":4743.85},"2011-06-03":{"data":"03.06.2011","durata":35,"rata":8,"dobînda":5929.81},"2011-07-08":{"data":"08.07.2011","durata":28,"rata":8,"dobînda":4743.85},"2011-08-05":{"data":"05.08.2011","durata":32,"rata":9,"dobînda":5740.46},"2011-09-06":{"data":"06.09.2011","durata":31,"rata":10,"dobînda":5870.01},"2011-10-07":{"data":"07.10.2011","durata":28,"rata":10,"dobînda":5301.95},"2011-11-04":{"data":"04.11.2011","durata":28,"rata":10,"dobînda":5301.95},"2011-12-02":{"data":"02.12.2011","durata":35,"rata":9.5,"dobînda":6453.03},"2012-01-06":{"data":"06.01.2012","durata":28,"rata":8.5,"dobînda":4883.37},"2012-02-03":{"data":"03.02.2012","durata":28,"rata":6.5,"dobînda":4325.27},"2012-03-02":{"data":"02.03.2012","durata":32,"rata":4.5,"dobînda":4305.34},"2012-04-03":{"data":"03.04.2012","durata":31,"rata":4.5,"dobînda":4170.8},"2012-05-04":{"data":"04.05.2012","durata":24,"rata":4.5,"dobînda":3229.01},"2012-05-28":{"data":"28.05.2012","durata":18,"rata":4.5,"dobînda":2421.75}}}}';

    calcule = app.DobîndaDeÎntîrziere.calculează(întîrziere);

    equal(JSON.stringify(calcule), calculeCorecte, 'calculele sunt corecte');
  }

  // ------------------------
  function verificăRaportul($dialog) {
    /*jshint maxlen:144 */
    var $buton = $dialog.find('.ui-icon-document.buton'),
        formular = app.ButoanePentruÎncheieri.formular($buton),
        tab;

    $buton.click();
    ok($buton.attr('data-dinamic'), 'raportul e marcat dinamic');
    tab = app.Încheieri.deschise[formular].tab;

    app.$(tab).one('iniţializat', function () {
      ok(true, 'iniţializat raportul cu detaliile calculului');

      setTimeout(function () { // aşteptăm să ne asigurăm că nu se închide
        var $secţiune = tab.Încheiere.$.find('section:first .conţinut'),
            $paragraf = $secţiune.find('p').text(),
            $calcule = $secţiune.find('.calcule'),
            $rînduri = $calcule.children(),
            rînduri = calcule.detalii.rînduri,
            numărDeRînduri = 0,
            $coloniţe, $rînd, rînd, r;

        ok($paragraf.indexOf(calcule.detalii.rata + '%') > -1, 'afişat rata');
        ok($paragraf.indexOf(calcule.detalii.începutPerioadă + '–' + calcule.detalii.sfîrşitPerioadă) > -1, 'afişat perioada');
        ok($paragraf.indexOf(calcule.detalii.suma + ' de lei') > -1, 'afişat suma');

        for (var dată in rînduri) {
          numărDeRînduri++;
          rînd = rînduri[dată];
          $rînd = $rînduri.eq(numărDeRînduri);
          $coloniţe = $rînd.children();
          r = 'rîndul ' + numărDeRînduri + ': ';

          equal($coloniţe.eq(0).text(), numărDeRînduri, r + 'afişat numărul de ordine în prima coloniţă');
          equal($coloniţe.eq(1).text(), rînd.data, r + 'afişat data de început a perioadei în a doua coloniţă');
          equal($coloniţe.eq(2).text(), rînd.durata + ' zile', r + 'afişat durata perioadei în a treia coloniţă');
          equal($coloniţe.eq(3).text(), rînd.rata + '+9=' + (rînd.rata + 9).toFixed(1), r + 'afişat calculul ratei în a patra coloniţă');
          equal($coloniţe.eq(4).text(), rînd.dobînda, r + 'afişat dobînda pe perioadă în a cincia coloniţă');
        }

        equal($calcule.find('.total').text(), calcule.dobînda, 'afişat dobînda');

        tab.close();

        setTimeout(function () { // aşteptăm o leacă să fie urmăribil testul
          $dialog.find('.închide').click();
          app.$.fx.off = false;

          start();
        }, 500);
      }, 700);
    });
  }
});
