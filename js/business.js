var Business = {
  init: function() {
    Onorariul.init();
  }
};

// --------------------------------------------------

var Onorariul = {
  init: function() {
    $('#date-generale')
      .on('keydown keyup update paste change', '#suma-de-bază', Onorariul.actualizează)
      .on('change', '#caracter', Onorariul.actualizează)
      .on('change', '#obiect', Onorariul.actualizează);

    $('#creditor').on('change', '.gen-persoană', Onorariul.actualizează);
  },

  actualizează: function() {
    var caracter = $('#caracter').val(),
        genPersoană = $('#creditor .gen-persoană').val();

    function get(hash, property) {
      return typeof property == 'function' ? hash[property]() : hash[property];
    }

    var onorariu = 0;

    if (caracter == 'nonpecuniar') {
      var obiect = $('#obiect').val();

      onorariu = get(Onorariul.nonpecuniar, obiect)[genPersoană];
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
        return suma * .10;
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
      fizică: function() { return 100 + .01 * $('#bunuri .valoare').suma() },
      juridică: function() { return 200 + .01 * $('#bunuri .valoare').suma() }
    },
    'efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri imobile': {
      fizică: function() { return 100 + .01 * $('#bunuri .valoare').suma() },
      juridică: function() { return 200 + .01 * $('#bunuri .valoare').suma() }
    },
    'confiscarea bunurilor': {
      fizică: function() { return 100 + .01 * $('#bunuri .valoare').suma() },
      juridică: function() { return 100 + .01 * $('#bunuri .valoare').suma() }
    },
    'nimicirea bunurilor': {fizică: 100, juridică: 100},
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
    suma += parseFloat(this.value);
  });

  return suma;
};
