(function() {
  'use strict';

  var app = window.frames['app'];


  module('StructuriDate');

  test('.aplicăSchimbări', function() {
    var dateIniţiale = {
      nume: 'Joe Doe',
      data: '01.01.1970',
      itemi: {
        'a': 1,
        'b': 2
      }
    };

    var dateTransformate = {
      nume: 'Joe Doe',
      data: '01.01.1970',
      itemi: {
        'a': [1],
        'b': [2]
      },
      versiune: 1
    };

    var tipDate = 'profil';

    app.StructuriDate.transformări[tipDate] = [function(date) {
      // schimă valori itemi din number în array
      for (var item in date.itemi) {
        date.itemi[item] = [date.itemi[item]];
      }

      return date;
    }];

    equal(
      JSON.stringify(app.StructuriDate.aplicăSchimbări(tipDate, dateIniţiale)),
      JSON.stringify(dateTransformate),
      'datele s-au transformat corespunzător + setat versiunea'
    );
  });


  test('.tipPerUrl', function() {
    equal(app.StructuriDate.tipPerUrl('/date/007/profil.json'), 'profil', 'detectat “profil”');
    equal(app.StructuriDate.tipPerUrl('/date/007/proceduri/'), 'procedură', 'detectat “procedură”');
    equal(app.StructuriDate.tipPerUrl('/date/007/proceduri/5/date.json'), 'procedură', 'detectat “procedură”');
  });


  test('.transformări.procedură[0]', function() {
    var dateIniţiale = {
      'data-intentării':'31.05.2013',
      'document-executoriu':{'date':'irelevante-DE'},
      'obiectul-urmăririi':{'date':'irelevante-obiectul'},
      'cheltuieli':{
        'onorariu':'2400.00',
        'părţile-au-ajuns-la-conciliere':false,
        'itemi':{
          'taxaA1':{'date':'irelevante-taxaA1'},
          'taxaA2':{'date':'irelevante-taxaA2'},
          'taxaA6':{'date':'irelevante-taxaA6'},
          'speza1':{'date':'irelevante-speza1'}
        }
      },
      'creditor':{'date':'irelevante-creditor'},
      'persoane-terţe':['persoane-terţe'],
      'debitori':['debitori'],
      'tip':'',
      'data-ultimei-modificări':'06.06.2013 20:48',
      'încheieri':{'date':'irelevante-încheieri'}
    };

    var dateTransformate = app.StructuriDate.aplicăSchimbări('procedură', dateIniţiale);

    equal(dateTransformate.versiune, app.StructuriDate.transformări.procedură.length,
      'setat versiunea în funcţie de numărul de transformări aplicate');

    for (var k in dateIniţiale) {
      if (k === 'cheltuieli') {
        equal(dateTransformate.cheltuieli['onorariu'], dateIniţiale.cheltuieli['onorariu'], 'onorariul a rămas neschimbat');
        equal(
          dateTransformate.cheltuieli['părţile-au-ajuns-la-conciliere'],
          dateIniţiale.cheltuieli['părţile-au-ajuns-la-conciliere'],
          '“părţile-au-ajuns-la-conciliere” a rămas neschimbat'
        );
        deepEqual(
          dateTransformate.cheltuieli.itemi,
          [
            {id: 'taxaA1', date: {'date':'irelevante-taxaA1'}},
            {id: 'taxaA2', date: {'date':'irelevante-taxaA2'}},
            {id: 'taxaA6', date: {'date':'irelevante-taxaA6'}},
            {id: 'speza1', date: {'date':'irelevante-speza1'}}
          ],
          'itemii cheltuieli s-au schimbat din hash in array de hash-uri'
        );
      } else {
        deepEqual(dateTransformate[k], dateIniţiale[k], k + ' a rămas neschimbat');
      }
    }
  });

})();
