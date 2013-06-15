window.init = function(context) {
  'use strict';

  var total = context.app.FormularProcedură.$.find('#total').val();

  context.totalDatorie = context.app.accounting.formatNumber(total, 2, ' ', '.');

  // TODO
  context.mijloculDeTranspport = 'datele din subsecţiunea de sechestrare';
};
