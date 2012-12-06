test('Procedura: verifică valori implicite', function () {
  'use strict';

  var app = this.app;

  equal(this.$creditor.find('#gen-persoană').val(), 'juridică',
      'pentru procedura de orgin general creditorul e implicit persoană juridică');
  equal(this.$debitor.find('#gen-persoană').val(), 'fizică',
      'pentru procedura de orgin general debitorul e implicit persoană fizică');
  equal(this.$obiectulUrmăririi.find('#caracter').val(), 'pecuniar',
       'pentru procedura de ordin general caracterul implicit este pcuniar');
  equal(app.Procedura.$.find('#total-taxe-şi-speze').suma(), app.UC,
      'cheltuieli: total implicit taxe şi speze == taxa de intentare');
  ok(app.Procedura.$.find('#cheltuieli .adăugate #taxaA1').există(),
      'cheltuieli: taxa de intentare este adăugată implicit');

  var $butoaneÎncheiere = app.Procedura.$.find('.buton[data-formular]'),
      $butoaneÎncheiereDezactivate = $butoaneÎncheiere.filter('[dezactivat]');

  equal($butoaneÎncheiere.length, $butoaneÎncheiereDezactivate.length,
      'butoanele pentru încheieri sunt dezactivate');
});
