// valoarea unităţii convenţionale
var UC = 20;

var Business = {
  init: function() {
    Onorariul.init();
    Defaults.init();
  }
};

// --------------------------------------------------

var Onorariul = {
  // Articolul 38

  init: function() {
    $('#date-generale')
      .on(
        'keydown keyup update paste change',
        '#suma-de-bază, #bunuri .valoare, input:checkbox',
        Onorariul.actualizează
      )
      .on('change', '#caracter, #obiect', Onorariul.actualizează);

    $('#debitor').on('change', '.gen-persoană', Onorariul.actualizează);
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
    'evacuarea': {fizică: 200 * UC, juridică: 300 * UC},
    'instalarea': {fizică: 200 * UC, juridică: 200 * UC},
    'schimbul forţat': {fizică: 200 * UC, juridică: 200 * UC},
    'stabilirea domiciliului copilului': {fizică: 200 * UC, juridică: 200 * UC},
    'efectuarea de către debitor a unor acte obligatorii, nelegate de remiterea unor sume sau bunuri': {fizică: 200 * UC, juridică:200 * UC},
    'efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri mobile': {
      fizică: function() { return 100 * UC + .01 * $('#date-generale #bunuri .valoare').suma() },
      juridică: function() { return 200 * UC + .01 * $('#date-generale #bunuri .valoare').suma() }
    },
    'efectuarea de către debitor a unor acte obligatorii, legate de remiterea unor bunuri imobile': {
      fizică: function() { return 100 * UC + .01 * $('#date-generale #bunuri .valoare').suma() },
      juridică: function() { return 200 * UC + .01 * $('#date-generale #bunuri .valoare').suma() }
    },
    'confiscarea bunurilor': {
      fizică: function() { return 100 * UC + .01 * $('#date-generale #bunuri .valoare').suma() },
      juridică: function() { return 100 * UC + .01 * $('#date-generale #bunuri .valoare').suma() }
    },
    'nimicirea unor bunuri': {
      fizică: function() { return 100 * UC + .01 * $('#date-generale #bunuri .valoare').suma() },
      juridică: function() { return 100 * UC + .01 * $('#date-generale #bunuri .valoare').suma() }
    },
    'restabilirea la locul de muncă': {fizică: 200 * UC, juridică: 200 * UC},
    'aplicarea măsurilor de asigurare a acţiunii': {
      fizică: function() {
        return $('#bunuri-supuse-înregistrării-sau-bani').is(':checked')
          ? 100 * UC
          : 120 * UC;
      },
      juridică: function() {
        return $('#bunuri-supuse-înregistrării-sau-bani').is(':checked')
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

function round(number, decimalCount) {
  var multiplier = Math.pow(10, decimalCount);

  return Math.round(number * multiplier) / multiplier;
}

// --------------------------------------------------

$.fn.suma = function() {
  var suma = 0;

  this.filter('input').each(function() {
    if ($.isNumeric(this.value)) {
      $(this).removeClass('invalid');
      suma += parseFloat(this.value);
    } else {
      $(this).addClass('invalid');
    };
  });

  return suma;
};
