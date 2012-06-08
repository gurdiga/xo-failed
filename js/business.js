// valoarea unităţii convenţionale
var UC = 20;

var Business = {
  init: function() {
    var pagină = HashController.pagină();

    if (this[pagină]) this[pagină]();
  },

  '#formular': function() {
    Onorariul.init();
    TotalCheltuieli.init();
    Defaults.init();
  }
};

// --------------------------------------------------

var Onorariul = {
  // Articolul 38

  init: function() {
    var schimbareDate = 'keydown keyup update paste change',
        cîmpuriConsiderate = '.sumă, .valuta, .bunuri .valoare, input:checkbox';

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
    var total = $('#date-generale .sumă:not(#total)').suma();

    $('#date-generale #total').val(total);

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

    Formular.initTitlu();
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

    var evenimente = 'keydown keyup update paste change mouseup';

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
