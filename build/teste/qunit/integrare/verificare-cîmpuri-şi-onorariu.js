asyncTest('Procedură: verificare prezenţă cîmpuri şi calcul onorariu', function () {
  /*jshint maxlen:170*/
  'use strict';

  var dateProcedură = this.dateProcedură,
      app = this.app,
      creditor, debitor, de, sume;

  this.$dataIntentării.val(dateProcedură['data-intentării']);

  creditor = dateProcedură['creditor'];
  ok(this.$creditor.find('#denumire').val(creditor['denumire']).există(), 'găsit cîmp denumire creditor');
  ok(this.$creditor.find('#idno').val(creditor['idno']).există(), 'găsit cîmp IDNO creditor');
  ok(this.$creditor.find('#sediu').val(creditor['sediu']).există(), 'găsit cîmp sediu creditor');

  debitor = dateProcedură['debitori'][0];
  ok(this.$debitor.find('#nume').val(debitor['nume']).există(), 'găsit cîmp nume debitor');
  ok(this.$debitor.find('#idnp').val(debitor['idnp']).există(), 'găsit cîmp IDNP debitor');
  ok(this.$debitor.find('#data-naşterii').val(debitor['data-naşterii']).există(), 'găsit cîmp data naşterii debitor');

  de = dateProcedură['document-executoriu'];
  ok(this.$de.find('#instanţa-de-judecată').val(de['instanţa-de-judecată']).există(), 'găsit cîmp #instanţa-de-judecată pentru DE');
  ok(this.$de.find('#numărul-de').val(de['numărul-de']).există(), 'găsit cîmp număr pentru DE');
  ok(this.$de.find('#data-hotărîrii').val(de['data-hotărîrii']).există(), 'găsit cîmp data hotărîrii DE');
  ok(this.$de.find('#dispozitivul').val(de['dispozitivul']).trigger('input').există(), 'găsit cîmp dispozitiv DE');
  ok(this.$de.find('#data-rămînerii-definitive').val(de['data-rămînerii-definitive']).există(), 'găsit cîmp data-rămînerii-definitive DE');

  sume = dateProcedură['obiectul-urmăririi']['sume'];
  ok(this.$obiectulUrmăririi.find('#suma-de-bază').val(sume['Suma de bază']).există(), 'găsit cîmp suma de bază');
  ok(this.$obiectulUrmăririi.find('.adaugă-cîmp-personalizat').click().există(), 'găsit buton de adăugare cîmp personalizat');

  var $obiectulUrmăririi = this.$obiectulUrmăririi,
      $cîmpPersonalizat = $obiectulUrmăririi.find('.personalizat:last');

  ok($cîmpPersonalizat.există(), 'găsit cîmp personalizat adăugat');
  ok($cîmpPersonalizat.find('.etichetă').val('Datorie adăugătoare').există(), 'găsit etichetă cîmp personalizat adăugat');
  ok($cîmpPersonalizat.find('.sumă').val(sume['Datorie adăugătoare']).există(), 'găsit suma în cîmpul personalizat adăugat');

  // ------------------------
  app.$(app.document).one('calculat-onorariul', function () {
    equal($obiectulUrmăririi.find('#total').suma(), sume['Suma de bază'] + sume['Datorie adăugătoare'], 'totalul e suma sumelor');

    var onorariuImplicit = dateProcedură['cheltuieli']['onorariu'];

    equal(app.FormularProcedură.$.find('#onorariu').val(), onorariuImplicit, 'cheltuieli: pentru procedura de ordin general onorariul implicit este ' + onorariuImplicit);

    start();
  });
});
