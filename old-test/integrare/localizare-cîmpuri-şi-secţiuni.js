test('Procedură: localizare cîmpuri şi secţiuni', function() {
  'use strict';

  ok(this.$dataIntentării.există(), 'găsit #data-intentării');
  ok(this.$creditor.există(), 'găsit #creditor');
  ok(this.$debitor.există(), 'găsit .debitor');
  ok(this.$de.există(), 'găsit #document-executoriu');
  ok(this.$obiectulUrmăririi, 'găsit FormularProcedură.$obiectulUrmăririi');
});
