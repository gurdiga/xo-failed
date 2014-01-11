(function() {
  'use strict';


  var Transformări = {
    'profil': [],
    'procedură': []
  };


  Transformări.procedură.push(function(date) {
    var itemi = [];

    for (var id in date.cheltuieli.itemi) {
      itemi.push({
        id: id,
        date: date.cheltuieli.itemi[id]
      });
    }

    date.cheltuieli.itemi = itemi;

    return date;
  });


  Transformări.procedură.push(function(date) {
    var sume = [], suma, eticheta;

    for (eticheta in date['obiectul-urmăririi'].sume) {
      suma = date['obiectul-urmăririi'].sume[eticheta];
      suma.eticheta = eticheta;
      sume.push(suma);
    }

    date['obiectul-urmăririi'].sume = sume;

    return date;
  });


  var StructuriDate = {
    transformări: Transformări,

    tipPerUrl: function(url) {
      if (/profil.json$/.test(url)) return 'profil';
      if (/proceduri\/$/.test(url)) return 'procedură';
      if (/proceduri\/\d+\/date.json$/.test(url)) return 'procedură';
    },

    seteazăVersiune: function(tip, date) {
      date.versiune = Transformări[tip].length;
    },

    aplicăSchimbări: function(tip, date) {
      date.versiune = date.versiune || 0;

      Transformări[tip].forEach(function(transformare, versiune) {
        if (versiune < date.versiune) return;

        date = transformare(date);
      });

      date.versiune = Transformări[tip].length;

      return date;
    }
  };

  window.StructuriDate = StructuriDate;

})();
