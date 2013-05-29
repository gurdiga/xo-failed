window.init = function(context) {
  'use strict';

  var total = context.app.FormularProcedură.$.find('#total').val();

  context.totalDatorie = context.app.accounting.formatNumber(total, 2, ' ', '.');
  context.dataŞiOraDeplasării = context.procedură.cheltuieli.itemi.speza5.subformular[0]['data-şi-ora-deplasării'];
};
