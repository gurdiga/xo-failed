(function() {
  'use strict';

  var StructuriDate = {
    versiuni: {
      'profil': [],
      'procedură': [
        function(date) {
          var itemi = [];

          for (var id in date.cheltuieli.itemi) {
            itemi.push({
              id: id,
              date: date.cheltuieli.itemi[id]
            });
          }

          date.cheltuieli.itemi = itemi;

          return date;
        }
      ]
    },

    tipPerUrl: function(url) {
      if (/profil.json$/.test(url)) return 'profil';
      if (/proceduri\/$/.test(url)) return 'procedură';
      if (/proceduri\/\d+\/date.json$/.test(url)) return 'procedură';
    },

    seteazăVersiune: function(tip, date) {
      date.versiune = this.versiuni[tip].length;
    },

    aplicăSchimbări: function(tip, date) {
      date.versiune = date.versiune || 0;

      this.versiuni[tip].forEach(function(transformare, versiune) {
        if (versiune < date.versiune) return;

        date = transformare(date);
      });

      date.versiune = this.versiuni[tip].length;

      return date;
    }
  };

  window.StructuriDate = StructuriDate;

})();
