(function () {
  'use strict';

  var UtilitareÎncheiere = {
    verificăŞoaptăButon: function ($încheiere, $butonPentruÎncheiere) {
      var titlu = $încheiere.find('h1').text(),
          utilitare = $încheiere[0].defaultView.Încheiere.utilitare,
          subtitlu = utilitare.normalizeazăSpaţii($încheiere.find('h1+h2').text()),
          şoaptăCorespunzătoare = 'Formează ' + titlu + ' ' + subtitlu;

      equal($butonPentruÎncheiere.attr('title'), şoaptăCorespunzătoare, 'şoapta pe butonul de încheiere corespunde cu titlul ei');
    },

    verificăSubtitlu: function ($încheiere, subtitluCorect) {
      var utilitare = $încheiere[0].defaultView.Încheiere.utilitare,
          subtitluDeFacto = utilitare.normalizeazăSpaţii($încheiere.find('h1+h2').text());

      equal(subtitluDeFacto, subtitluCorect, 'subtitlul corespunde');
    },

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
        ok($secţiuneProcedură.next('.conţinut').text().trim() !== '', '…cu ceva text');

        if (UtilitareÎncheiere.verificăriStandard[secţiune]) {
          UtilitareÎncheiere.verificăriStandard[secţiune]($încheiere);
        }
      }

      ok($încheiere.find('#semnătura').există(), 'avem loc pentru semnătură');
      ok($încheiere.find('#ştampila').există(), 'avem loc pentru ştampila');

      ok($încheiere.find('button.închide').există(), 'avem buton de închidere');
      ok($încheiere.find('.bara-de-instrumente.pentru.încheiere').există(), 'avem bară de instrumente');
    },

    verificăriStandard: { // per secţiune
      'Procedura': function ($încheiere) {
        var app = $încheiere[0].defaultView.opener,
            date = $încheiere[0].defaultView.Încheiere.date,
            numărComplet = app.Utilizator.login + date.procedură['tip'] + '-' + app.FormularProcedură.număr(),
            $secţiuneProcedură = $încheiere.find('section header:contains("Procedura")'),
            $secţiuneProcedurăConţinut = $secţiuneProcedură.next('.conţinut');

        ok($secţiuneProcedurăConţinut.is(':contains("' + numărComplet + '")'), 'avem numărul procedurii');
      }
    }
  };

  window.UtilitareÎncheiere = UtilitareÎncheiere;
})();
