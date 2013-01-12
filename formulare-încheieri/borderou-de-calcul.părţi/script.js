// <![CDATA[  prevent tidy from compaining about unescaped && which is a JS operator
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
      var număr = {
        taxe: 0,
        speze: 0
      };

      var total = {
        taxe: {
          achitat: 0,
          rămasDeAchitat: 0
        },
        speze: {
          achitat: 0,
          rămasDeAchitat: 0
        }
      };

      var $ = context.opener.$,
          id, $item, tip,
          cost, achitat, costPerItem;

      for (id in context.procedură.cheltuieli.itemi) {
        tip = id.substr(0, 4) === 'taxa' ? 'taxe' : 'speze';
        $item = context.opener.Cheltuieli.$.find('#' + id);

        număr[tip]++;
        achitat = $item.find('.achitare :checkbox').is(':checked');

        if (tip === 'taxe') {
          if ($item.find('.subformular:has(.document)').există()) {
            costPerItem = $item.find('input.cost-per-item').suma() * context.opener.UC;
            cost = 0;

            $item.find('.subformular .document').each(function () {
              cost += $(this).find('.cantitate').suma() * costPerItem;
            });
          } else {
            cost = $item.find('input.cost').suma() * context.opener.UC;
          }

          if ($item.is('#taxaA6') && $item.find('#din-arhivă').is(':checked')) {
            cost += context.opener.UC;
          }
        } else {
          cost = 0;

          $item.find('.subformular .document').each(function () {
            cost += $(this).find('.sumă').suma();
          });
        }

        context[tip] = context[tip] || {};
        context[tip][număr[tip]] = {
          descriere: $item.find('p').contents(':not(.uc)').text().trim(),
          cost: cost,
          achitat: achitat,
          dataAchitării: achitat ? $item.find('.achitare .dată').val() : '—'
        };

        total[tip] = total[tip] || {};
        total[tip][achitat ? 'achitat' : 'rămasDeAchitat'] += cost;
      }

      context.speze = context.speze || false;
      context.total = total;
      context.afişămColoniţaCuDataAchitării = total.taxe.achitat || total.speze.achitat;
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
// ]]>
