// valoarea unităţii convenţionale
var UC = 20;

var Business = {
  init: function() {
    var pagină = HashController.pagină();

    if (this[pagină]) this[pagină]();
  },

  '#formular': function() {
    DobîndaBNM.init();
    Onorariul.init();
    TotalCheltuieli.init();
    Defaults.init();
  }
};

// --------------------------------------------------

var DobîndaBNM = {
  rate: {},
  iniţializat: false,

  init: function() {
    if (DobîndaBNM.iniţializat) return;

    DobîndaBNM.încarcă();

    $('#date-generale').on('change', '#total', DobîndaBNM.calculează);
    $('#document-executoriu').on('keyup update paste', '#data-hotărîrii', DobîndaBNM.calculează);

    DobîndaBNM.iniţializat = true;
  },

  calculează: function(e) {
    if ($.isEmptyObject(DobîndaBNM.rate)) return;

    var suma = parseFloat($('#total').val()),
        dataHotărîrii = $.trim($('#data-hotărîrii').val());

    if (!/(\d{2}).(\d{2}).(\d{4})/.test(dataHotărîrii)) return;

    dataHotărîrii = moment(dataHotărîrii, 'DD.MM.YYYY').format('YYYY-MM-DD');

    var data, dataPrecedentă, primaDatăAplicabilă;

    for (data in DobîndaBNM.rate) {
      if (data > dataHotărîrii) break;

      dataPrecedentă = data;
    }

    primaDatăAplicabilă = dataPrecedentă;
    dataPrecedentă = null;

    var durate = {};

    for (data in DobîndaBNM.rate) {
      if (dataPrecedentă) {
        durate[dataPrecedentă] = zileÎntre(dataPrecedentă, data);
      }

      dataPrecedentă = data;
    }

    durate[data] = zileÎntre(data, new Date);

    function zileÎntre(data1, data2) {
      if (typeof data1 == 'string') data1 = moment(data1, 'YYYY-MM-DD').toDate();
      if (typeof data2 == 'string') data2 = moment(data2, 'YYYY-MM-DD').toDate();

      return Math.round((data2 - data1) / (24 * 3600 * 1000));
    }

    var rata, dobînda = 0;

    for (data in DobîndaBNM.rate) {
      if (data < primaDatăAplicabilă) continue;

      rata = DobîndaBNM.rate[data] / 100;
      dobînda += suma * rata / 365 * durate[data];
    }

    // rotunjim pînă la bănuţi
    dobînda = Math.round(dobînda * 100) / 100;

    $('#dobînda-bnm').val(dobînda);
  },

  încarcă: function() {
    $.getJSON('rate-bnm/rata_de_bază.json')
      .success(function(data) {
        DobîndaBNM.rate = data;
        DobîndaBNM.calculează();
      });
  }
};

// --------------------------------------------------

var Onorariul = {
  // Articolul 38

  init: function() {
    var schimbareDate = 'keyup update paste',
        cîmpuriConsiderate = '.sumă:not(.calculat), .valuta, .bunuri .valoare, input:checkbox';

    $('#date-generale')
      .on(schimbareDate, cîmpuriConsiderate, Onorariul.actualizează)
      .on('change', '#caracter, #obiect', Onorariul.actualizează);

    $('#formular').on('change', '.debitor #gen-persoană', Onorariul.actualizează);
    $('#părţile-au-ajuns-la-conciliere').on('change', Onorariul.actualizează);
  },

  actualizează: function() {
    var caracter = $('#caracter').val(),
        genPersoană = $('.debitor #gen-persoană').val(),
        onorariu = 0;

    if (caracter == 'nonpecuniar') {
      var obiect = $('#obiect').val();

      valoare = Onorariul.nonpecuniar[obiect][genPersoană];
      onorariu = typeof valoare == 'function' ? valoare() : valoare;
    } else {
      onorariu = Onorariul.pecuniar();
    }

    if ($('#părţile-au-ajuns-la-conciliere').is(':checked')) {
      onorariu *= .7;
    }

    $('#onorariu').val(onorariu.toFixed(2));
  },

  pecuniar: function() {
    var total = $('#date-generale .sumă:not(.calculat)').suma();

    $('#date-generale #total').val(total).trigger('change');

    if (total <= 100000) {
      var minim = $('#amendă-sau-încasare-periodică').is(':checked') ? 200 : 500;

      return Math.max(total * .10, minim);
    } else if (total <= 300000) {
      return 10000 + (total - 100000) * .05;
    } else if (total > 300000) {
      return 20000 + (total - 300000) * .03;
    }
  },

  nonpecuniar: {
    'evacuarea': {fizică: 200 * UC, juridică: 300 * UC},
    'instalarea': {fizică: 200 * UC, juridică: 200 * UC},
    'schimbul forţat': {fizică: 200 * UC, juridică: 200 * UC},
    'stabilirea domiciliului copilului': {fizică: 200 * UC, juridică: 200 * UC},
    'efectuarea de către debitor a unor acte obligatorii, nelegate de remiterea unor sume sau bunuri': {fizică: 200 * UC, juridică:200 * UC},
    'efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri mobile': {
      fizică: function() { return 100 * UC + .01 * $('#date-generale .bunuri .valoare').suma() },
      juridică: function() { return 200 * UC + .01 * $('#date-generale .bunuri .valoare').suma() }
    },
    'efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri imobile': {
      fizică: function() { return 100 * UC + .01 * $('#date-generale .bunuri .valoare').suma() },
      juridică: function() { return 200 * UC + .01 * $('#date-generale .bunuri .valoare').suma() }
    },
    'confiscarea bunurilor': {
      fizică: function() { return 100 * UC + .01 * $('#date-generale .bunuri .valoare').suma() },
      juridică: function() { return 100 * UC + .01 * $('#date-generale .bunuri .valoare').suma() }
    },
    'nimicirea unor bunuri': {
      fizică: function() { return 100 * UC + .01 * $('#date-generale .bunuri .valoare').suma() },
      juridică: function() { return 100 * UC + .01 * $('#date-generale .bunuri .valoare').suma() }
    },
    'restabilirea la locul de muncă': {fizică: 200 * UC, juridică: 200 * UC},
    'aplicarea măsurilor de asigurare a acţiunii': {
      fizică: function() {
        return $('.bunuri-supuse-înregistrării-sau-bani').is(':checked')
          ? 100 * UC
          : 120 * UC;
      },
      juridică: function() {
        return $('.bunuri-supuse-înregistrării-sau-bani').is(':checked')
          ? 100 * UC
          : 120 * UC;
      }
    }
  }
};

// --------------------------------------------------

var Defaults = {
  init: function() {
    $('#date-generale').on('change', '#obiect', function() {
      var obiect = $(this).val(),
          genCreditor = $('#creditor #gen-persoană'),
          genDebitor = $('.debitor #gen-persoană');

      switch(obiect) {
        case 'restabilirea la locul de muncă':
          genCreditor.val('fizică');
          genDebitor.val('juridică');
          break;

        case 'stabilirea domiciliului copilului':
          genCreditor.val('fizică');
          genDebitor.val('fizică');
          break;
      }

      genCreditor.trigger('change');
      genDebitor.trigger('change');
    });

    if (Formular.seCreazăProcedurăNouă()) {
      $('#taxaA1').click();

      var caracterProcedură = $('#caracter'),
          genCreditor = $('#creditor #gen-persoană');

      switch (HashController.date()) {
        case 's':
          caracterProcedură.val('pecuniar');
          genCreditor.val('juridică');
          break;

        case 'p':
          caracterProcedură.val('pecuniar');
          genCreditor.val('fizică');
          break;

        default:
          caracterProcedură.val('pecuniar');
          genCreditor.val('juridică');
          break;
      }

      caracterProcedură.trigger('change');
      genCreditor.trigger('change');
    }

    TotalCheltuieli.calculează();
  }
};

// --------------------------------------------------

$.fn.suma = function() {
  var suma = 0;

  this.filter('input').each(function() {
    var cîmp = $(this),
        existăValoare = $.trim(cîmp.val()) != '';


    if ($.isNumeric(cîmp.val()) && cîmp.val() >= 0) {
      if (cîmp.is('.invalid')) cîmp.removeClass('invalid');

      if (cîmp.next().is('.valuta') && cîmp.next('.valuta').val() != 'MDL') {
        var valuta = cîmp.next('.valuta').val(),
            rataBNM = RateBNM[valuta];

        suma += this.value * rataBNM.value / rataBNM.nominal;
      } else {
        suma += parseFloat(this.value);
      }
    } else {
      if (existăValoare) cîmp.addClass('invalid');
    };
  });

  return parseFloat(suma.toFixed(2));
};

// --------------------------------------------------

var TotalCheltuieli = {
  init: function() {
    var cîmpuriValoare = [
      'input.cost',
      'input.valoare',
      'input.sumă',
      'input.cantitate',
      '#taxaA6 .din.arhivă',
      '#taxaB5 .licitaţie.repetată',
      '#taxaB6 .licitaţie.repetată'
    ].join(',');

    var evenimente = 'keyup update paste mouseup';

    $('#listă-taxe-şi-speze').on(evenimente, cîmpuriValoare, this.calculează);
  },

  calculează: function(e, automat) {
    if (automat) return;

    var total = 0,
        cheltuieliAdăugate = $('#listă-taxe-şi-speze');

    total += cheltuieliAdăugate.find('input.valoare, input.sumă').suma();
    total += cheltuieliAdăugate.find('input.cost').suma() * UC;
    total += cheltuieliAdăugate.find('#taxaB2-1 .cantitate').suma() * .5 * UC;
    total += cheltuieliAdăugate.find('#taxaB9 .cantitate').suma() * 5 * UC;
    total += cheltuieliAdăugate.find('#taxaA6 .din.arhivă').is(':checked') ? 1 * UC : 0;

    var licitaţieRepetată = cheltuieliAdăugate.find('#taxaB6 .licitaţie.repetată');

    if (licitaţieRepetată.is(':checked')) {
      total -= licitaţieRepetată.closest('.item').find('.cost').suma() * .5 * UC;
    }

    var licitaţieRepetată = cheltuieliAdăugate.find('#taxaB5 .licitaţie.repetată');

    if (licitaţieRepetată.is(':checked')) {
      total -= licitaţieRepetată.closest('.item').find('.cost').suma() * .5 * UC;
    }

    total += cheltuieliAdăugate.find('#taxaA3 .cantitate').suma() * UC;
    total += cheltuieliAdăugate.find('#taxaB7 .document').length * 3 * UC;
    total += cheltuieliAdăugate.find('#taxaB13 .cantitate').suma() * 5 * UC;
    total += cheltuieliAdăugate.find('#taxaC1 .cantitate').suma() * 5 * UC;

    var documenteExpediate = cheltuieliAdăugate.find('#taxaB1 .document');

    documenteExpediate.each(function() {
      var destinatari = $(this).children('.destinatari-adăugaţi').children();

      if (destinatari.există()) {
        total +=
          destinatari.filter('.suplimentar').length * .25 * UC +
          (destinatari.filter(':not(.suplimentar)').există() ? 1 * UC : 0);
      }
    });

    $('#total-taxe-şi-speze').val(total);
  }
};
