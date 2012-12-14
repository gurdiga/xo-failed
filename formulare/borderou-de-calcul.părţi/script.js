(function () {
  'use strict';

  window.init = function (context) {
    Init.pregăteşteDatelePentruTabel(context);
    Init.pregăteşteRechiziteleBancare(context);
  };


  var Init = {
    // --------------------------------------------------
    pregăteşteDatelePentruTabel: function (context) {
      /*jshint loopfunc:true, maxcomplexity:5 */
      var taxe = {},
          speze = {},
          $ = context.opener.$,
          numărTaxe = 0,
          numărSpeze = 0,
          totalTaxe = 0,
          totalSpeze = 0,
          afişămColoniţaCuDataAchitării = false,
          id, $item, tip, descriere,
          cost, achitat, dataAchitării, costPerItem;

      for (id in context.procedură.cheltuieli.itemi) {
        tip = id.substr(0, 4);
        $item = context.opener.Cheltuieli.$.find('#' + id);
        descriere = $item.find('p').text().trim();
        achitat = $item.find('.achitare :checkbox').is(':checked');

        if (achitat) {
          dataAchitării = $item.find('.achitare .dată').val();
          afişămColoniţaCuDataAchitării = true;
        } else {
          dataAchitării = '—';
        }

        if (tip === 'taxa') {
          numărTaxe++;

          if ($item.find('.subformular:has(.document)').există()) {
            costPerItem = $item.find('input.cost-per-item').suma() * context.opener.UC;
            cost = 0;

            $item.find('.subformular .document').each(function () {
              cost += $(this).find('.cantitate').suma() * costPerItem;
            });
          } else {
            cost = $item.find('input.cost').suma() * context.opener.UC;
          }

          taxe[numărTaxe] = {
            descriere: descriere,
            cost: cost.toFixed(2),
            achitat: achitat,
            dataAchitării: dataAchitării
          };
          totalTaxe += cost;
        } else {
          numărSpeze++;
          cost = 0;

          $item.find('.subformular .document').each(function () {
            cost += $(this).find('.sumă').suma();
          });

          speze[numărSpeze] = {
            descriere: descriere,
            cost: cost.toFixed(2),
            achitat: achitat,
            dataAchitării: dataAchitării
          };
          totalSpeze += cost;
        }
      }

      context.taxe = taxe;
      context.totalTaxe = totalTaxe.toFixed(2);

      context.speze = speze;
      context.totalSpeze = totalSpeze.toFixed(2);

      context.afişămColoniţaCuDataAchitării = afişămColoniţaCuDataAchitării;
    },

    // --------------------------------------------------
    pregăteşteRechiziteleBancare: function (context) {
      /*jshint maxcomplexity:7 */
      var proprietăţi = [
        'nume', 'codul-fiscal',
        'cont-taxe-speze', 'cont-onorarii',
        'denumire-bancă-taxe-speze', 'denumire-bancă-onorarii',
        'cod-bancă-taxe-speze', 'cod-bancă-onorarii'
      ], i, l = proprietăţi.length;

      for (i = 0; i < l; i++) {
        if (context.executor[proprietăţi[i]]) continue;
        context.executor[proprietăţi[i]] = context.opener.Profil.cîmpNecompletat;
      }

      var banca = opener.Bănci.cautăDupăSufix(context.executor['banca-taxe-speze']), cod;

      for (cod in banca) {
        if (!banca.hasOwnProperty(cod)) break;
        context.executor['denumire-bancă-taxe-speze'] = banca[cod];
        context.executor['cod-bancă-taxe-speze'] = cod;
      }

      banca = opener.Bănci.cautăDupăSufix(context.executor['banca-onorarii']);

      for (cod in banca) {
        if (!banca.hasOwnProperty(cod)) break;
        context.executor['denumire-bancă-onorarii'] = banca[cod];
        context.executor['cod-bancă-onorarii'] = cod;
      }
    }
  };

  window.Init = Init;
})();
