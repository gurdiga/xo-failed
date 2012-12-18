module('Bara de sus');

asyncTest('Calculator dobînzi de întîrziere', function () {
  'use strict';

  var app = window.frames['app'],
      $buton = app.$('#bara-de-sus .instrumente .calculator'),
      $dialog = $buton.prev('.dialog'),
      calcule;

  ok($buton.există(), 'avem buton');

  $buton.click();

  setTimeout(function () { // aşteptăm animaţia
    ok($dialog.is(':visible'), 'la click se afişează dialogul');

    verificăŞiCompleteazăCîmpurile($dialog);
    verificăDetaliileCalculului($dialog);
    verificăRaportul($dialog);
  }, 200);

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

    $început.val('03.03.2003');
    $sfîrşit.val('12.12.2012');
    $suma.val('20000').trigger('input');
    equal($dobînda.val(), '39565.20', 'dobînda se calculează corect');
  }

  // ------------------------
  function verificăDetaliileCalculului($dialog) {
    /*jshint maxlen:5594 */
    var întîrziere = app.Subsecţiuni.întîrzieri.colectează($dialog),
        calculeCorecte = '{"dobînda":39565.2,"detalii":{"începutPerioadă":"03.03.2003","sfîrşitPerioadă":"12.12.2012","rata":9,"suma":"20000","rînduri":{"2002-12-31":{"data":"03.03.2003","durata":25,"rata":9.5,"dobînda":253.42},"2003-03-28":{"data":"28.03.2003","durata":98,"rata":10.5,"dobînda":1047.12},"2003-07-04":{"data":"04.07.2003","durata":28,"rata":10.5,"dobînda":299.18},"2003-08-01":{"data":"01.08.2003","durata":49,"rata":11,"dobînda":536.99},"2003-09-19":{"data":"19.09.2003","durata":49,"rata":12,"dobînda":563.84},"2003-11-07":{"data":"07.11.2003","durata":35,"rata":13,"dobînda":421.92},"2003-12-12":{"data":"12.12.2003","durata":112,"rata":14,"dobînda":1411.51},"2004-04-02":{"data":"02.04.2004","durata":88,"rata":14,"dobînda":1109.04},"2004-06-29":{"data":"29.06.2004","durata":94,"rata":14,"dobînda":1184.66},"2004-10-01":{"data":"01.10.2004","durata":91,"rata":14.5,"dobînda":1171.78},"2004-12-31":{"data":"31.12.2004","durata":49,"rata":14.5,"dobînda":630.96},"2005-02-18":{"data":"18.02.2005","durata":140,"rata":13,"dobînda":1687.67},"2005-07-08":{"data":"08.07.2005","durata":56,"rata":13,"dobînda":675.07},"2005-09-02":{"data":"02.09.2005","durata":35,"rata":12.5,"dobînda":412.33},"2005-10-07":{"data":"07.10.2005","durata":91,"rata":12.5,"dobînda":1072.05},"2006-01-06":{"data":"06.01.2006","durata":91,"rata":12.5,"dobînda":1072.05},"2006-04-07":{"data":"07.04.2006","durata":84,"rata":12.5,"dobînda":989.59},"2006-06-30":{"data":"30.06.2006","durata":98,"rata":12.5,"dobînda":1154.52},"2006-10-06":{"data":"06.10.2006","durata":49,"rata":13,"dobînda":590.68},"2006-11-24":{"data":"24.11.2006","durata":14,"rata":14,"dobînda":176.44},"2006-12-08":{"data":"08.12.2006","durata":133,"rata":14.5,"dobînda":1712.6},"2007-04-20":{"data":"20.04.2007","durata":105,"rata":13.5,"dobînda":1294.52},"2007-08-03":{"data":"03.08.2007","durata":54,"rata":13.5,"dobînda":665.75},"2007-09-26":{"data":"26.09.2007","durata":44,"rata":16,"dobînda":602.74},"2007-11-09":{"data":"09.11.2007","durata":91,"rata":16,"dobînda":1246.58},"2008-02-08":{"data":"08.02.2008","durata":39,"rata":16,"dobînda":534.25},"2008-03-18":{"data":"18.03.2008","durata":73,"rata":17,"dobînda":1040},"2008-05-30":{"data":"30.05.2008","durata":123,"rata":18.5,"dobînda":1853.42},"2008-09-30":{"data":"30.09.2008","durata":63,"rata":17,"dobînda":897.53},"2008-12-02":{"data":"02.12.2008","durata":21,"rata":15.5,"dobînda":281.92},"2008-12-23":{"data":"23.12.2008","durata":28,"rata":14,"dobînda":352.88},"2009-01-20":{"data":"20.01.2009","durata":21,"rata":12.5,"dobînda":247.4},"2009-02-10":{"data":"10.02.2009","durata":98,"rata":11,"dobînda":1073.97},"2009-05-19":{"data":"19.05.2009","durata":35,"rata":10,"dobînda":364.38},"2009-06-23":{"data":"23.06.2009","durata":31,"rata":9,"dobînda":305.75},"2009-07-24":{"data":"24.07.2009","durata":21,"rata":8,"dobînda":195.62},"2009-08-14":{"data":"14.08.2009","durata":25,"rata":7,"dobînda":219.18},"2009-09-08":{"data":"08.09.2009","durata":147,"rata":5,"dobînda":1127.67},"2010-02-02":{"data":"02.02.2010","durata":28,"rata":6,"dobînda":230.14},"2010-03-02":{"data":"02.03.2010","durata":28,"rata":6,"dobînda":230.14},"2010-03-30":{"data":"30.03.2010","durata":35,"rata":7,"dobînda":306.85},"2010-05-04":{"data":"04.05.2010","durata":28,"rata":7,"dobînda":245.48},"2010-06-01":{"data":"01.06.2010","durata":28,"rata":7,"dobînda":245.48},"2010-06-29":{"data":"29.06.2010","durata":35,"rata":7,"dobînda":306.85},"2010-08-03":{"data":"03.08.2010","durata":31,"rata":7,"dobînda":271.78},"2010-09-03":{"data":"03.09.2010","durata":32,"rata":7,"dobînda":280.55},"2010-10-05":{"data":"05.10.2010","durata":31,"rata":7,"dobînda":271.78},"2010-11-05":{"data":"05.11.2010","durata":28,"rata":7,"dobînda":245.48},"2010-12-03":{"data":"03.12.2010","durata":35,"rata":7,"dobînda":306.85},"2011-01-07":{"data":"07.01.2011","durata":27,"rata":8,"dobînda":251.51},"2011-02-03":{"data":"03.02.2011","durata":29,"rata":8,"dobînda":270.14},"2011-03-04":{"data":"04.03.2011","durata":35,"rata":8,"dobînda":326.03},"2011-04-08":{"data":"08.04.2011","durata":28,"rata":8,"dobînda":260.82},"2011-05-06":{"data":"06.05.2011","durata":28,"rata":8,"dobînda":260.82},"2011-06-03":{"data":"03.06.2011","durata":35,"rata":8,"dobînda":326.03},"2011-07-08":{"data":"08.07.2011","durata":28,"rata":8,"dobînda":260.82},"2011-08-05":{"data":"05.08.2011","durata":32,"rata":9,"dobînda":315.62},"2011-09-06":{"data":"06.09.2011","durata":31,"rata":10,"dobînda":322.74},"2011-10-07":{"data":"07.10.2011","durata":28,"rata":10,"dobînda":291.51},"2011-11-04":{"data":"04.11.2011","durata":28,"rata":10,"dobînda":291.51},"2011-12-02":{"data":"02.12.2011","durata":35,"rata":9.5,"dobînda":354.79},"2012-01-06":{"data":"06.01.2012","durata":28,"rata":8.5,"dobînda":268.49},"2012-02-03":{"data":"03.02.2012","durata":28,"rata":6.5,"dobînda":237.81},"2012-03-02":{"data":"02.03.2012","durata":32,"rata":4.5,"dobînda":236.71},"2012-04-03":{"data":"03.04.2012","durata":31,"rata":4.5,"dobînda":229.32},"2012-05-04":{"data":"04.05.2012","durata":24,"rata":4.5,"dobînda":177.53},"2012-05-28":{"data":"28.05.2012","durata":32,"rata":4.5,"dobînda":236.71},"2012-06-29":{"data":"29.06.2012","durata":27,"rata":4.5,"dobînda":199.73},"2012-07-26":{"data":"26.07.2012","durata":35,"rata":4.5,"dobînda":258.9},"2012-08-30":{"data":"30.08.2012","durata":28,"rata":4.5,"dobînda":207.12},"2012-09-27":{"data":"27.09.2012","durata":28,"rata":4.5,"dobînda":207.12},"2012-10-25":{"data":"25.10.2012","durata":35,"rata":4.5,"dobînda":258.9},"2012-11-29":{"data":"29.11.2012","durata":13,"rata":4.5,"dobînda":96.16}}}}';

    calcule = app.DobîndaDeÎntîrziere.calculează(întîrziere);

    ok(JSON.stringify(calcule) === calculeCorecte, 'calculele sunt corecte');
  }

  // ------------------------
  function verificăRaportul($dialog) {
    /*jshint maxlen:144 */
    var $buton = $dialog.find('.ui-icon-document.buton'),
        formular = app.ButoanePentruÎncheieri.formular($buton),
        tab;

    $buton.click();
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
        $dialog.find('.închide').click();

        start();
      }, 700);
    });
  }
});
