window.init = function (context) {
  /*jshint loopfunc:true */
  'use strict';

  var taxe = {},
      speze = {},
      $ = context.opener.$,
      numărTaxe = 0,
      numărSpeze = 0,
      totalTaxe = 0,
      totalSpeze = 0,
      id, $item, tip, descriere,
      cost, costPerItem;

  for (id in context.procedură.cheltuieli.itemi) {
    tip = id.substr(0, 4);

    $item = context.opener.Cheltuieli.$.find('#' + id);
    descriere = $item.find('p').text().trim();

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
        cost: cost.toFixed(2)
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
        cost: cost.toFixed(2)
      };
      totalSpeze += cost;
    }
  }

  context.taxe = taxe;
  context.totalTaxe = totalTaxe.toFixed(2);

  context.speze = speze;
  context.totalSpeze = totalSpeze.toFixed(2);

  context.necompletat = '[nu e completat în profil]';
};
