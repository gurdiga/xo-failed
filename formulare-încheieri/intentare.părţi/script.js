window.init = function (context) {
  'use strict';

  var total = context.app.FormularProcedură.$.find('#total').val();

  context.totalDatorie = context.app.accounting.formatNumber(total, 2, ' ', '.');

  var conciliere = context.procedură.cheltuieli.itemi.taxaB11;

  if (conciliere) {
    context.conciliere = {
      data: conciliere.subformular['data-concilierii'],
      ora: conciliere.subformular['ora-concilierii']
    };
  } else {
    context.conciliere = false;
  }
};
