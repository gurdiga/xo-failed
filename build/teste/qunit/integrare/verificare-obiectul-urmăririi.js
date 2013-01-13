test('Formular procedură: obiectul urmăririi', function () {
  'use strict';

  var $secţiune = this.$obiectulUrmăririi,
      caracterIniţial = $secţiune.find('#caracter').val();

  equal($secţiune.find('#caracter').val(), 'pecuniar', 'Iniţial caracterul este “pecuniar”');

  $secţiune.find('#caracter').val('nonpecuniar').change();
  ok($secţiune.find('select#obiect').există(), 'avem cîmp pentru pentru obiect');
  ok($secţiune.find('select#obiect+.buton[data-formular]').există(), 'avem butonaş pentru încheiere');
  equal($secţiune.find('select#obiect').val(), 'evacuarea', 'Iniţial obiectul este “evacuarea”');

  ok($secţiune.find('textarea#din-încăperea').există(), 'avem textarea pentru adresa');
  equal($secţiune.find('textarea#din-încăperea').val(), '', '…necompletat');

  ok($secţiune.find('input#data-evacuării').există(), 'avem data evacuării');
  ok($secţiune.find('input#data-evacuării').is('.dată'), '…cu clasa “dată” pentru calendar');
  equal($secţiune.find('input#data-evacuării').val(), '', '…necompletat');

  ok($secţiune.find('input#ora-evacuării').există(), 'avem ora evacuării');
  equal($secţiune.find('input#ora-evacuării').val(), '', '…necompletat');

  ok($secţiune.find(':checkbox#se-acordă-alt-spaţiu').există(), 'avem bifă pentru “se acordă alt spaţiu”');
  ok($secţiune.find(':checkbox#se-acordă-alt-spaţiu').is(':not(:checked)'), '…nebifată');

  // restabileşte valoarea iniţială
  $secţiune.find('#caracter').val(caracterIniţial).change();
});
