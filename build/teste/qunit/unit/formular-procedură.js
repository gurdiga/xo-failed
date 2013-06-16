(function() {
  'use strict';

  var app = window.frames['app'];

  module('Unit: Structură formular procedură: secţiune “Acţiuni procedurale”');

  test('Există', function() {
    var $formular = app.FormularProcedură.$,
        $secţiune = $formular.find('fieldset#acţiuni-procedurale');

    ok($formular.există(), 'găsit formularul');
    ok($secţiune.există(), 'găsit secţiunea');
    ok($secţiune.find('legend:contains("Acţiuni procedurale")').există(), '…cu titlul corespunzător');
    ok($secţiune.find('div.conţinut').există(), '…cu div pentru conţinut');
  });
})();
