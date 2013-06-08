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
      /*jshint loopfunc:true, maxcomplexity:8 */
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

      var app = context.app,
          $ = app.$,
          itemiPerProcedurăLuaţiDejaÎnCalcul = {},
          $items = app.Cheltuieli.$adăugate.children(),
          $item, grup,
          descriere, cost, achitat, costPerItem, note;

      context.procedură.cheltuieli.itemi.forEach(function(item, i) {
        grup = item.id.substr(0, 4) === 'taxa' ? 'taxe' : 'speze';
        $item = $items.eq(i);

        număr[grup]++;
        achitat = $item.find('.achitare :checkbox').is(':checked');
        descriere = $item.find('p').clone().find('.uc').remove().end().text().trim();

        if (grup === 'taxe') {
          if ($item.find('.subsecţiune:has(.personalizat)').există()) {
            costPerItem = $item.find('input.cost-per-item').suma() * app.UC;
            cost = 0;

            $item.find('.subsecţiune .personalizat').each(function () {
              cost += $(this).find('.cantitate').suma() * costPerItem;
            });
          } else {
            cost = $item.find('input.cost').suma() * app.UC;
          }

          if ($item.is('#taxaA6') && $item.find('#din-arhivă').is(':checked')) {
            cost += app.UC;
          }
        } else { // speză
          cost = 0;

          $item.find('.subsecţiune .personalizat').each(function () {
            cost += $(this).find('.sumă').suma();
          });

          // https://docs.google.com/document/d/1RCXVMBSJV8YOl-Fd-Cv6ji30_l-UU9jBXBZtwmMIb58/edit#bookmark=id.t8d2ds1n5h81
          if ($item.is('#speza5')) {
            if (!itemiPerProcedurăLuaţiDejaÎnCalcul['speza5']) {
              cost = $item.find('.cost-per-procedură').suma() * app.UC;
              itemiPerProcedurăLuaţiDejaÎnCalcul['speza5'] = true;
            }

            if ($item.find('#în-afara-circumscripţiei').is(':checked')) cost += 5 * app.UC;

            note = $item.find('#note-deplasare').val().trim();

            if (note) descriere += '<br/>\n' + note;
          }
        }

        context[grup] = context[grup] || {};
        context[grup][număr[grup]] = {
          descriere: descriere,
          cost: cost,
          achitat: achitat,
          dataAchitării: achitat ? $item.find('.achitare .dată').val() : '—'
        };

        total[grup] = total[grup] || {};
        total[grup][achitat ? 'achitat' : 'rămasDeAchitat'] += cost;
      });

      context.speze = context.speze || false;
      context.total = total;
      context.afişămColoniţaCuDataAchitării = total.taxe.achitat || total.speze.achitat;
    },

    // --------------------------------------------------
    pregăteşteRechiziteleBancare: function (context) {
      /*jshint maxcomplexity:7 */
      var app = context.app;
      var proprietăţi = [
        'nume', 'cod-fiscal',
        'cont-taxe-speze', 'cont-onorarii',
        'denumire-bancă-taxe-speze', 'denumire-bancă-onorarii',
        'cod-bancă-taxe-speze', 'cod-bancă-onorarii'
      ], i, l = proprietăţi.length;

      for (i = 0; i < l; i++) {
        if (context.executor[proprietăţi[i]]) continue;
        context.executor[proprietăţi[i]] = app.Profil.cîmpNecompletat;
      }

      var banca = app.Bănci.cautăDupăSufix(context.executor['bancă-taxe-speze']), cod;

      for (cod in banca) {
        if (!banca.hasOwnProperty(cod)) break;
        context.executor['denumire-bancă-taxe-speze'] = banca[cod];
        context.executor['cod-bancă-taxe-speze'] = cod;
      }

      banca = app.Bănci.cautăDupăSufix(context.executor['bancă-onorarii']);

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
