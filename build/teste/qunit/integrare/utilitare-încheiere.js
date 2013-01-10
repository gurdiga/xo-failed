(function () {
  'use strict';

  var UtilitareÎncheiere = {
    verificăSecţiuni: function ($încheiere, secţiuni) {
      ok($încheiere.find('article hgroup h1').există(), 'avem h1');
      ok($încheiere.find('article hgroup h2').există(), 'avem h2');

      var l = secţiuni.length,
          i = 0,
          secţiune, $secţiuneProcedură;

      for (; i < l; i++) {
        secţiune = secţiuni[i];
        $secţiuneProcedură = $încheiere.find('section header:contains("' + secţiune + '")');

        ok($secţiuneProcedură.există(), 'avem titlul pentru secţiunea ' + secţiune);
        ok($secţiuneProcedură.next('.conţinut').există(), 'avem conţinutul secţiunea ' + secţiune);

        if (UtilitareÎncheiere.verificăriStandard[secţiune]) {
          UtilitareÎncheiere.verificăriStandard[secţiune]($încheiere);
        }
      }

      ok($încheiere.find('#semnătura').există(), 'avem loc pentru semnătură');
      ok($încheiere.find('#ştampila').există(), 'avem loc pentru ştampila');
    },

    verificăriStandard: { // per secţiune
      'Procedura': function ($încheiere) {
        var app = $încheiere[0].defaultView.opener,
            numărComplet = app.Utilizator.login + app.FormularProcedură.număr(),
            $secţiuneProcedură = $încheiere.find('section header:contains("Procedura")'),
            $secţiuneProcedurăConţinut = $secţiuneProcedură.next('.conţinut');

        ok($secţiuneProcedurăConţinut.is(':contains("' + numărComplet + '")'), 'avem numărul procedurii');
      }
    }
  };

  window.UtilitareÎncheiere = UtilitareÎncheiere;
})();
