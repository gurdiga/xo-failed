test('Formular procedură: cheltuieli', function () {
  /*jshint maxlen:125*/
  'use strict';

  this.app.$.fx.off = true;

  var $cheltuieliAdăugate = this.app.Cheltuieli.$adăugate,
      $categorii = this.app.Cheltuieli.categorii.$,
      cheltuieliAdăugate = $cheltuieliAdăugate.find('>.item').map(function () { return this.id; }).get();

  equal(cheltuieliAdăugate.length, 2, 'implicit sunt adăugate 2 cheltuieli');
  equal(cheltuieliAdăugate.join(), 'taxaA1,taxaA2', '…: taxa de intentare şi cea de arhivare');

  (function verificămBugDespreInabilitateaDeAAdăugaAdresaţiDupăReadăugareaTaxeiB1() {
    $categorii.find('#taxaB1').click();

    var $taxaB1 = $cheltuieliAdăugate.find('#taxaB1');

    ok($taxaB1.există(), 'adăugat taxaB1');
    $taxaB1.find('.adaugă-destinatar').trigger('mouseenter');
    ok($taxaB1.find('.adaugă-destinatar #destinatari').există(), 'găsit lista cu categorii de destinatari');

    var $primulDestinatar = $taxaB1.find('.adaugă-destinatar #destinatari').find('>li.listă>.itemi>li').first();

    equal($taxaB1.find('.destinatari-adăugaţi>li').length, 0, 'iniţial nu avem destinatari adăugaţi');
    $primulDestinatar.click();
    ok($primulDestinatar.is('.dezactivat'), 'marcat destinatarul adăugat');
    equal($taxaB1.find('.destinatari-adăugaţi>li').length, 1, 'adăugat destinatarul respectiv');

    $taxaB1.trigger('mousemove');
    ok($taxaB1.find('.elimină').există(), 'afişat butonaşul de eliminare');

    $taxaB1.find('.elimină').click();
    ok(!$cheltuieliAdăugate.find('#taxaB1').există(), 'eliminat taxaB1');

    $categorii.find('#taxaB1').click();

    $taxaB1 = $cheltuieliAdăugate.find('#taxaB1');

    ok($taxaB1.există(), 'readăugat taxaB1');
    equal($taxaB1.find('.destinatari-adăugaţi>li').length, 0, 'după readăugare: nu avem destinatari adăugaţi');
    $taxaB1.find('.adaugă-destinatar').trigger('mouseenter');
    ok($taxaB1.find('.adaugă-destinatar #destinatari').există(), 'după readăugare: găsit lista cu categorii de destinatari');

    $primulDestinatar = $taxaB1.find('.adaugă-destinatar #destinatari').find('>li.listă>.itemi>li').first();

    equal($taxaB1.find('.destinatari-adăugaţi>li').length, 0, 'după readăugare: iniţial nu avem destinatari adăugaţi');
    ok($primulDestinatar.is(':not(.dezactivat)'), 'după readăugare: primul destinatar nu e marcat ca adăugat');
    $primulDestinatar.click();
    ok($primulDestinatar.is('.dezactivat'), 'după readăugare: marcat destinatarul adăugat');
    equal($taxaB1.find('.destinatari-adăugaţi>li').length, 1, 'după readăugare: adăugat destinatarul respectiv');

    $taxaB1.trigger('mousemove');
    ok($taxaB1.find('.elimină').există(), 'afişat butonaşul de eliminare');

    $taxaB1.find('.elimină').click();
    ok(!$cheltuieliAdăugate.find('#taxaB1').există(), 'eliminat taxaB1');
  })();

  this.app.$.fx.off = false;
});
