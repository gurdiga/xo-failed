window.init = function (context) {
  /*jshint loopfunc:true */
  'use strict';

  var taxe = {},
      speze = {},
      număr = 0,
      $ = context.opener.$,
      totalTaxe = 0,
      totalSpeze = 0,
      id, $item, tip, descriere,
      cost, costPerItem;

  for (id in context.procedură.cheltuieli.itemi) {
    număr++;
    tip = id.substr(0, 4);

    $item = context.opener.Cheltuieli.$.find('#' + id);
    descriere = $item.find('p').text().trim();

    if (tip === 'taxa') {
      if ($item.find('.subformular:has(.document)').există()) {
        costPerItem = parseFloat($item.find('input.cost-per-item').val()) * context.opener.UC;
        cost = 0;

        $item.find('.subformular .document').each(function () {
          cost += parseFloat($(this).find('.cantitate').val()) * costPerItem;
        });
      } else {
        cost = parseFloat($item.find('input.cost').val()) * context.opener.UC;
      }

      taxe[număr] = {
        descriere: descriere,
        cost: cost.toFixed(2)
      };
      totalTaxe += cost;
    } else {
      cost = 0;

      $item.find('.subformular .document').each(function () {
        cost += parseFloat($(this).find('.sumă').val());
      });

      speze[număr] = {
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
};
