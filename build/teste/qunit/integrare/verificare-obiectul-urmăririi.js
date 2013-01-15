test('Formular procedură: obiectul urmăririi', function () {
  /*jshint maxlen:141 */
  'use strict';

  var app = this.app,
      $secţiune = this.$obiectulUrmăririi,
      caracterIniţial = $secţiune.find('#caracter').val();

  equal($secţiune.find('#caracter').val(), 'pecuniar', 'Iniţial caracterul este “pecuniar”');

  $secţiune.find('#caracter').val('nonpecuniar').change();
  ok($secţiune.find('select#obiect').există(), 'avem cîmp pentru pentru obiect');
  ok($secţiune.find('select#obiect+.buton[data-formular]').există(), 'avem butonaş pentru încheiere');
  equal($secţiune.find('select#obiect').val(), 'evacuarea', 'Iniţial obiectul este “evacuarea”');

  ok($secţiune.find('textarea#din-încăperea').există(), 'avem textarea pentru adresa');
  equal($secţiune.find('textarea#din-încăperea').val(), '', '…necompletat');

  ok($secţiune.find('input#data-şi-ora-evacuării').există(), 'avem cîmpul pentru data şi ora evacuării');
  ok($secţiune.find('input#data-şi-ora-evacuării').is('.dată'), '…cu clasa “dată” pentru calendar');
  equal($secţiune.find('input#data-şi-ora-evacuării').val(), '', '…necompletat');

  var $butonDeAdăugare = $secţiune.find('button.adaugă-cîmp-personalizat');

  ok($butonDeAdăugare.există(), 'avem butonaş de adăugat amînări');
  equal($butonDeAdăugare.data('etichetă'), 'Amînat pînă la', '…cu data-etichetă');
  equal($butonDeAdăugare.data('şablon'), 'cîmpul-pentru-data-şi-ora-amînării-evacuării', '…cu data-şablon');

  $butonDeAdăugare.click();
  ok($secţiune.find('.etichetă.amînare').există(), 'la click pe butonul de adăugare se adaugă un cîmp pentru amînare');
  equal($secţiune.find('.etichetă.amînare').val(), 'Amînat pînă la', '…cu eticheta “Amînat pînă la”');
  ok($secţiune.find('.etichetă.amînare').next('input').is(':focus'), '…cu cîmpul pentru dată focusat');

  ok($secţiune.find(':checkbox#se-acordă-alt-spaţiu').există(), 'avem bifă pentru “se acordă alt spaţiu”');
  ok($secţiune.find(':checkbox#se-acordă-alt-spaţiu').is(':not(:checked)'), '…nebifată');

  // restabileşte valoarea iniţială
  $secţiune.find('#caracter').val(caracterIniţial).change();
});
