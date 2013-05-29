(function() {
  'use strict';

  module('Unit: FormularProcedură.secţiuni["cheltuieli"]');

  var app = window.frames['app'];

  function item(selector) {
    return app.Cheltuieli.categorii.pregăteşteOCopieLaItem(
      app.Cheltuieli.categorii.$.find(selector)
    );
  }

  var date = {};

  date['generic'] = {
    'selector': '#taxaB2-1',
    'date': {
      'achitat': true,
      'data-achitării': '01.01.2013',
      subformular: {
        'ore-lucrate': '5'
      }
    }
  };

  test('.item["generic"].colectează()', function() {
    var colectează = app.FormularProcedură.secţiuni['cheltuieli'].item['generic'].colectează;

    equal(colectează.length, 1, 'funcţia acceptă un argument');

    var $item = item(date['generic'].selector),
        dateDinItem = date['generic'].date;

    $item.find('.achitare :checkbox').attr('checked', dateDinItem['achitat']);
    $item.find('.achitare .dată').val(dateDinItem['data-achitării']);
    $item.find('#ore-lucrate').val(dateDinItem.subformular['ore-lucrate']);

    deepEqual(colectează($item), dateDinItem, 'colectat datele despre achitare şi datele din subformular');
  });


  test('.item["generic"].populează()', function() {
    var populează = app.FormularProcedură.secţiuni['cheltuieli'].item['generic'].populează;

    equal(populează.length, 2, 'funcţia acceptă două argumente');

    var $item = item(date['generic'].selector),
        dateDinItem = date['generic'].date;

    populează($item, dateDinItem);

    equal($item.find('.achitare :checkbox').is(':checked'), dateDinItem['achitat'], 'popular bifa de achitare');
    equal($item.find('.achitare .dată').val(), dateDinItem['data-achitării'], 'populat data achitării');
    equal($item.find('#ore-lucrate').val(), dateDinItem.subformular['ore-lucrate'], 'populat orele lucrate');
  });


  date['generic-cu-bife'] = {
    'selector': '#taxaB5',
    'date': {
      'achitat': true,
      'data-achitării': '01.01.2013',
      subformular: {
        'licitaţie-repetată': true
      }
    }
  };

  test('.item["generic"].colectează() — cu bife', function() {
    var colectează = app.FormularProcedură.secţiuni['cheltuieli'].item['generic'].colectează;

    equal(colectează.length, 1, 'funcţia acceptă un argument');

    var dateDinItem = date['generic-cu-bife'].date,
        $item = item(date['generic-cu-bife'].selector);

    $item.find('.achitare :checkbox').attr('checked', dateDinItem['achitat']);
    $item.find('.achitare .dată').val(dateDinItem['data-achitării']);
    $item.find('#licitaţie-repetată').attr('checked', dateDinItem.subformular['licitaţie-repetată']);

    //console.log(colectează($item), dateDinItem);
    deepEqual(colectează($item), dateDinItem, 'colectat datele despre achitare şi datele din subformular');
  });

  test('.item["generic"].populează() — cu bife', function() {
    var populează = app.FormularProcedură.secţiuni['cheltuieli'].item['generic'].populează,
        dateDinItem = date['generic-cu-bife'].date,
        $item = item(date['generic-cu-bife'].selector);

    populează($item, dateDinItem);

    // cîmpurile referitoare la achitare s-au testat în testul precedent
    equal(
      $item.find('#licitaţie-repetată').is(':checked'),
      dateDinItem.subformular['licitaţie-repetată'],
      'bifat bifa corespunzător'
    );
  });


  date['listă'] = {
    'selector': '#taxaB7',
    'date': {
      'achitat': true,
      'data-achitării': '01.01.2013',
      subformular: [
        {nume: 'Ion OLARU'},
        {nume: 'Ion BUŞILĂ'},
        {nume: 'Ion CUTĂRESCU'}
      ]
    }
  };

  test('.item["listă"].colectează()', function() {
    var colectează = app.FormularProcedură.secţiuni['cheltuieli'].item['listă'].colectează;

    equal(colectează.length, 1, 'funcţia acceptă un argument');

    var dateDinItem = date['listă'].date,
        $item = item(date['listă'].selector);

    $item.find('.achitare :checkbox').attr('checked', dateDinItem['achitat']);
    $item.find('.achitare .dată').val(dateDinItem['data-achitării']);

    function completeazăRînd($rînd, date) {
      for (var proprietate in date) {
        $rînd.find('[nume-cîmp="' + proprietate + '"]').val(date[proprietate]);
      }
    }

    var $rînd = $item.find('.personalizat');

    dateDinItem.subformular.forEach(function(rînd, i, rînduri) {
      completeazăRînd($rînd, rînd);

      if (i < rînduri.length - 1) $rînd = $rînd.clone().insertAfter($rînd);
    });

    deepEqual(colectează($item), dateDinItem, 'colectat datele despre achitare şi lista din subformular');
  });

  test('.item["listă"].populează()', function() {
    var populează = app.FormularProcedură.secţiuni['cheltuieli'].item['listă'].populează;

    equal(populează.length, 2, 'funcţia acceptă două argumente');

    var dateDinItem = date['listă'].date,
        $item = item(date['listă'].selector);

    populează($item, dateDinItem);

    var $rînduri = $item.find('.personalizat');

    dateDinItem.subformular.forEach(function(rînd, i) {
      for (var nume in rînd) {
        equal($rînduri.eq(i).find('[nume-cîmp="' + nume + '"]').val(), rînd[nume], 'datele corespund: ' + rînd[nume]);
      }
    });
  });



  date['documente-adresabile'] = {
    'selector': '#taxaB1',
    'date': {
      'achitat': true,
      'data-achitării': '01.01.2013',
      subformular: [{
        'document': 'Denumirea documentului',
        'destinatari': [
          'Destinatar &1',
          'Destinatar 2',
          'Destinatar 3'
        ],
        'destinatari-persoane-terţe': [
          'Ion OLARU'
        ]
      }]
    }
  };

  test('.item["documente-adresabile"].colectează()', function() {
    var colectează = app.FormularProcedură.secţiuni['cheltuieli'].item['documente-adresabile'].colectează;

    equal(colectează.length, 1, 'funcţia acceptă un argument');

    var dateDinItem = date['documente-adresabile'].date,
        $item = item(date['documente-adresabile'].selector);

    $item.find('.achitare :checkbox').attr('checked', dateDinItem['achitat']);
    $item.find('.achitare .dată').val(dateDinItem['data-achitării']);
    $item.find('.etichetă').val(dateDinItem.subformular[0].document);

    var $destinatari = $item.find('.destinatari-adăugaţi');

    dateDinItem.subformular[0]['destinatari'].
    forEach(function(destinatar) {
      $destinatari.append($('<li>', {html: destinatar}));
    });
    dateDinItem.subformular[0]['destinatari-persoane-terţe'].
    forEach(function(destinatar) {
      $('<li>', {text: 'persoană terţă', 'class': 'persoană terţă'}).
        append($('<input>', {value: destinatar})).
        appendTo($destinatari);
    });

    //console.log(colectează($item), dateDinItem);
    deepEqual(colectează($item), dateDinItem, 'colectat datele despre achitare, lista de documente, şi destinatari');
  });

  test('.item["documente-adresabile"].populează()', function() {
    var populează = app.FormularProcedură.secţiuni['cheltuieli'].item['documente-adresabile'].populează;

    equal(populează.length, 2, 'funcţia acceptă două argumente');

    var dateDinItem = date['documente-adresabile'].date,
        $item = item(date['documente-adresabile'].selector);

    populează($item, dateDinItem);

    equal($item.find('.achitare :checkbox').is(':checked'), dateDinItem['achitat'], 'bifa de achitare e bifată');
    equal($item.find('.achitare .dată').val(), dateDinItem['data-achitării'], 'data achitării e completată corespunzător');
    equal($item.find('.etichetă').val(), dateDinItem.subformular[0].document, 'numele documentului e completat');

    var $destinatari = $item.find('.destinatari-adăugaţi li.eliminabil');

    dateDinItem.subformular[0]['destinatari'].forEach(function(destinatar) {
      ok($destinatari.filter('li:not(.persoană.terţă):contains("' + destinatar + '")').există(),
          's-a populat destinatar: ' + destinatar);
    });

    var $destinatariPersoaneTerţe = $destinatari.filter('li.persoană.terţă');

    dateDinItem.subformular[0]['destinatari-persoane-terţe'].forEach(function(destinatar, i) {
      var $persoanăTerţă = $destinatariPersoaneTerţe.eq(i);

      equal($persoanăTerţă.text(), 'persoană terţă', 's-a populat “persoană terţă” pentru ' + destinatar);
      equal($persoanăTerţă.find('input').val(), destinatar, 's-a populat destinatar persoană terţă: ' + destinatar);
    });
  });


  var dateAşteptate = {
    '#taxaA1': '{"achitat":false,"data-achitării":""}',
    '#taxaA2': '{"achitat":false,"data-achitării":""}',
    '#taxaA3': '{"achitat":false,"data-achitării":"","subformular":[{"denumire":""}]}',
    '#taxaA4': '{"achitat":false,"data-achitării":""}',
    '#taxaA5': '{"achitat":false,"data-achitării":""}',
    '#taxaA6': '{"achitat":false,"data-achitării":"","subformular":{"din-arhivă":false}}',
    '#taxaB1': '{"achitat":false,"data-achitării":"","subformular":[{"document":"","destinatari":[],"destinatari-persoane-terţe":[]}]}',
    '#taxaB2': '{"achitat":false,"data-achitării":""}',
    '#taxaB2-1': '{"achitat":false,"data-achitării":"","subformular":{"ore-lucrate":""}}',
    '#taxaB3': '{"achitat":false,"data-achitării":""}',
    '#taxaB4': '{"achitat":false,"data-achitării":""}',
    '#taxaB5': '{"achitat":false,"data-achitării":"","subformular":{"licitaţie-repetată":false}}',
    '#taxaB6': '{"achitat":false,"data-achitării":"","subformular":{"licitaţie-repetată":false}}',
    '#taxaB7': '{"achitat":false,"data-achitării":"","subformular":[{"nume":""}]}',
    '#taxaB8': '{"achitat":false,"data-achitării":""}',
    '#taxaB9': '{"achitat":false,"data-achitării":"","subformular":[{"denumire":""}]}',
    '#taxaB10': '{"achitat":false,"data-achitării":""}',
    '#taxaB11': '{"achitat":false,"data-achitării":"","subformular":{"data-şi-ora-concilierii":""}}',
    '#taxaB12': '{"achitat":false,"data-achitării":""}',
    '#taxaB13': '{"achitat":false,"data-achitării":"","subformular":{"ore-lucrate":""}}',
    '#taxaC1': '{"achitat":false,"data-achitării":"","subformular":[{"denumire":""}]}',
    '#taxaC2': '{"achitat":false,"data-achitării":"","subformular":[{"denumirea":"","suma":""}]}',
    '#taxaC3': '{"achitat":false,"data-achitării":"","subformular":[{"denumirea":"","suma":""}]}',
    '#speza1': '{"achitat":false,"data-achitării":"","subformular":[{"descrierea":"","suma":""}]}',
    '#speza2': '{"achitat":false,"data-achitării":"","subformular":[{"descrierea":"","suma":""}]}',
    '#speza3': '{"achitat":false,"data-achitării":"","subformular":[{"descrierea":"","suma":""}]}',
    '#speza4': '{"achitat":false,"data-achitării":"","subformular":[{"descrierea":"","suma":""}]}',
    '#speza5': '{"achitat":false,"data-achitării":"","subformular":[{"data-şi-ora-deplasării":""},{"în-afara-circumscripţiei":false},{"descrierea":"","suma":""}]}',
    '#speza6': '{"achitat":false,"data-achitării":""}',
    '#speza7': '{"achitat":false,"data-achitării":""}',
    '#speza8': '{"achitat":false,"data-achitării":""}',
    '#speza9': '{"achitat":false,"data-achitării":""}',
    '#speza10': '{"achitat":false,"data-achitării":""}',
    '#speza11': '{"achitat":false,"data-achitării":""}',
    '#speza12': '{"achitat":false,"data-achitării":""}',
    '#speza13': '{"achitat":false,"data-achitării":""}'
  };


  test('date din itemi', function() {
    var $item, dateColectate;

    for (var selector in dateAşteptate) {
      $item = item(selector);
      //console.log(selector, $item.attr('gen-date'));

      dateColectate = app.FormularProcedură.secţiuni['cheltuieli'].
        item[$item.attr('gen-date') || 'generic'].
        colectează($item);

      //console.log(JSON.stringify(dateColectate));
      equal(JSON.stringify(dateColectate), dateAşteptate[selector], 'datele corespund pentru ' + selector);
    }
  });

})();
