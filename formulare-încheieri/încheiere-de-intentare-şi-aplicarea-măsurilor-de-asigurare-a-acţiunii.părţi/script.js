window.init = function (context) {
  /*jshint maxlen:130 */
  'use strict';

  var app = context.app,
      total = app.FormularProcedură.$.find('#total').val(),
      $destinatari = app.Cheltuieli.$.find('.adăugate #taxaB1 .document .destinatari-adăugaţi');

  context.clauze = {
    '.registru': 'ÎS “CRIS Registru”',
    '.cadastru': 'ÎS “Cadastru”',
    '.cîs': 'Camera Înregistrării de Stat',
    '.îfs': 'Inspectoratul Fiscal Principal de Stat',
    '.cnas': 'Casa Naţională de Asigurări Sociale',
    '.deţinători-info-despre-valori': 'participanţii profesionişti care deţin informaţia privind deţinătorii de valori mobiliare',
    '.bănci': 'băncile comerciale'
  };
  context.afişeazăClauza = {};

  for (var clauză in context.clauze) {
    context.afişeazăClauza[clauză] = $destinatari.find(clauză).există();
  }

  context.totalDatorie = app.accounting.formatNumber(total, 2, ' ', '.');

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
