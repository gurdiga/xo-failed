window.init = function(context) {
  'use strict';

  var total = context.app.FormularProcedură.$.find('#total').val();

  context.totalDatorie = context.app.accounting.formatNumber(total, 2, ' ', '.');

  var speza5 = context.app.Cheltuieli.item(context.procedură.cheltuieli.itemi, 'speza5');

  context.dataŞiOraDeplasării = speza5.subformular['data-şi-ora-deplasării'];
};
