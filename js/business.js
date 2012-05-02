// valoarea unităţii convenţionale
var UC = 20;

var Business = {
  init: function() {
    Onorariul.init();
    Defaults.init();
    TotalCheltuieli.init();
  }
};

// --------------------------------------------------

var Onorariul = {
  // Articolul 38

  init: function() {
    $('#date-generale')
      .on(
        'keydown keyup update paste change',
        '.sumă, .valuta, .bunuri .valoare, input:checkbox',
        Onorariul.actualizează
      )
      .on('change', '#caracter, #obiect', Onorariul.actualizează);

    $('#debitor').on('change', '.gen-persoană', Onorariul.actualizează);
    $('#părţile-au-ajuns-la-conciliere').on('change', Onorariul.actualizează);
  },

  actualizează: function() {
    var caracter = $('#caracter').val(),
        genPersoană = $('#debitor .gen-persoană').val(),
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
    $('#date-generale #total').val($('#date-generale .sumă:not(#total)').suma());

    var suma = parseFloat($('#date-generale #total').val());

    if (suma <= 100000) {
      if ($('#încasare-periodică').is(':checked')) {
        return 500;
      } else if ($('#încasare-amendă').is(':checked')) {
        return 200;
      } else {
        return Math.max(suma * .10, 500);
      }
    } else if (suma <= 300000) {
      return 10000 + (suma - 100000) * .05;
    } else if (suma > 300000) {
      return 20000 + (suma - 300000) * .03;
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
      switch($(this).val()) {

      case 'restabilirea la locul de muncă':
        $('#creditor .gen-persoană').val('fizică');
        $('#debitor .gen-persoană').val('juridică');
        break;

      case 'stabilirea domiciliului copilului':
        $('#creditor .gen-persoană').val('fizică');
        $('#debitor .gen-persoană').val('fizică');
        break;

      }
    });
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
      '[id="taxaB2.1"] .cantitate',
      '#taxaA6 .din.arhivă',
      '#taxaB6 .licitaţie.repetată',
      '#taxaA3 .cantitate'
    ].join(',');

    var evenimente = 'keydown keyup update paste change mouseup';

    $('#cheltuieli').on('DOMSubtreeModified', '#listă-taxe-şi-speze', this.calculează);
    $('#listă-taxe-şi-speze').on(evenimente, cîmpuriValoare, this.calculează);
  },

  calculează: function(e) {
    e.stopPropagation();

    // TODO: de evitat evenimentele de adăugare a butonului de eliminare

    var total = 0,
        cheltuieliAdăugate = $('#listă-taxe-şi-speze');

    total += cheltuieliAdăugate.find('input.cost, input.valoare, input.sumă').suma();
    total += cheltuieliAdăugate.find('[id="taxaB2.1"] .cantitate').suma() * .5;
    total += cheltuieliAdăugate.find('#taxaA6 .din.arhivă').is(':checked') ? 1 : 0;

    var licitaţieRepetată = cheltuieliAdăugate.find('#taxaB6 .licitaţie.repetată');

    if (licitaţieRepetată.is(':checked')) {
      total -= licitaţieRepetată.closest('.item').find('.cost').suma() * .5;
    }

    total += cheltuieliAdăugate.find('#taxaA3 .cantitate').suma();

    var documenteExpediate = cheltuieliAdăugate.find('#taxaB1 .document');

    documenteExpediate.each(function() {
      var destinatari = $(this).children('.destinatari-adăugaţi').children();

      if (destinatari.există()) {
        total +=
          destinatari.filter('.suplimentar').length * .25 +
          (destinatari.filter(':not(.suplimentar)').există() ? 1 : 0);
      }
    });

    $('#total-taxe-şi-speze').val(total * UC);

    // cazuri speciale:
    // * documente adresabile
    //   denumire + # de destinatari de anumite fel
    //   .item .document .destinatari-adăugaţi = 1
    //   count(.item .document .destinatari-adăugaţi.suplimentar) * .25
    // * ore lucrate: .item .cantitate * .5
    // * bifa din arhivă: .din.arhivă:checked +1
    // * bifă “licitaţie repetată”: -.5
    // * tA3: sum(.item .cantitate)

  }
};
