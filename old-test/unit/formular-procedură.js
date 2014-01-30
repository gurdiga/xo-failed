(function() {
  'use strict';

  var app = window.frames['app'];

  module('Structură formular procedură');


  test('Secţiune “Acţiuni procedurale”', function() {
    var $formular = app.FormularProcedură.$,
        $secţiune = $formular.find('fieldset#acţiuni-procedurale'),
        $conţinut = $secţiune.find('div.conţinut');

    ok($formular.există(), 'găsit formularul');
    ok($secţiune.există(), 'găsit secţiunea');
    ok($secţiune.find('legend:contains("Acţiuni procedurale")').există(), '…cu titlul corespunzător');
    ok($conţinut.există(), '…cu div pentru conţinut');
    ok($conţinut.find('.itemi').există(), '……listă pentru itemi');
  });

})();
