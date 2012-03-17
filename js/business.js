var Business = {
  init: function() {
    Onorariul.init();
  }
};

// --------------------------------------------------

var Onorariul = {
  // Articolul 38

  init: function() {
    $('#date-generale')
      .on('keydown keyup update paste change', '#suma-de-bază, #bunuri .valoare', Onorariul.actualizează)
      .on('change', '#caracter, #obiect', Onorariul.actualizează);

    $('#creditor').on('change', '.gen-persoană', Onorariul.actualizează);
  },

  actualizează: function() {
    var caracter = $('#caracter').val(),
        genPersoană = $('#creditor .gen-persoană').val(),
        onorariu = 0;

    if (caracter == 'nonpecuniar') {
      var obiect = $('#obiect').val();

      valoare = Onorariul.nonpecuniar[obiect][genPersoană];
      onorariu = typeof valoare == 'function' ? valoare() : valoare;
    } else {
      onorariu = Onorariul.pecuniar();
    }

    $('#onorariu').val(round(onorariu, 2));
  },

  pecuniar: function() {
    var suma = parseFloat($('#suma-de-bază').val() || 0);

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
    'evacuarea': {fizică: 200, juridică: 300},
    'instalarea': {fizică: 200, juridică: 200},
    'schimbul forţat': {fizică: 200, juridică: 200},
    'stabilirea domiciliului copilului': {fizică: 200, juridică: 200},
    'efectuarea de către debitor a unor acte obligatorii, nelegate de remiterea unor sume sau bunuri': {fizică: 200, juridică:200},
    'efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri mobile': {
      fizică: function() { return 100 + .01 * $('#date-generale #bunuri .valoare').suma() },
      juridică: function() { return 200 + .01 * $('#date-generale #bunuri .valoare').suma() }
    },
    'efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri imobile': {
      fizică: function() { return 100 + .01 * $('#date-generale #bunuri .valoare').suma() },
      juridică: function() { return 200 + .01 * $('#date-generale #bunuri .valoare').suma() }
    },
    'confiscarea bunurilor': {
      fizică: function() { return 100 + .01 * $('#date-generale #bunuri .valoare').suma() },
      juridică: function() { return 100 + .01 * $('#date-generale #bunuri .valoare').suma() }
    },
    'nimicirea unor bunuri': {
      fizică: function() { return 100 + .01 * $('#date-generale #bunuri .valoare').suma() },
      juridică: function() { return 100 + .01 * $('#date-generale #bunuri .valoare').suma() }
    },
    'restabilirea la locul de muncă': {fizică: 200, juridică: 200},
    'aplicarea măsurilor de asigurare a acţiunii': {
      fizică: function() {
        var taxaPerCaz = {1: 100, 2: 120};

        return taxaPerCaz[$('caz:checked').val()];
      },
      juridică: function() {
        var taxaPerCaz = {1: 100, 2: 120};

        return taxaPerCaz[$('caz:checked').val()];
      }
    }
  }
};

// --------------------------------------------------

function round(number, decimalCount) {
  var multiplier = Math.pow(10, decimalCount);

  return Math.round(number * multiplier) / multiplier;
}

// --------------------------------------------------

$.fn.suma = function() {
  var suma = 0;

  this.each(function() {
    this.value = $.trim(this.value);
    this.value = $.isNumeric(this.value) ? parseFloat(this.value) : 0;

    suma += parseFloat(this.value);
  });

  return suma;
};
