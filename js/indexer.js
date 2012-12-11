/*global self:false XMLHttpRequest:false */

/*
      Căutare.indexer.postMessage({'găseşte': text});
      Căutare.indexer.addEventListener('message', primeşteRăspunsul, false);

      function primeşteRăspunsul(e) {
        Căutare.anulează();
        Căutare.rezultate.afişează(e.data, text);
        Căutare.indexer.removeEventListener('message', primeşteRăspunsul, false);
      }
*/

(function () {
  'use strict';

  self.onmessage = function (e) {
    var mesaj = e.data;

    for (var comandă in mesaj) {
      Indexer[comandă](mesaj[comandă]);
    }
  };

  // --------------------------------------------------

  var Indexer = {
    date: {},

    încarcă: function (url) {
      var req = new XMLHttpRequest();

      req.onreadystatechange = function () {
        if (req.readyState === 4) {
          Indexer.date = JSON.parse(req.responseText);
        }
      };

      req.open('GET', url, true);
      req.send(null);
    },

    găseşte: function (text) {
      /*jshint maxcomplexity:6*/
      text = reEscape(text);

      var re = {
        laÎnceputDeRînd: new RegExp('^' + text, 'gi'),
        laÎnceputDeCuvînt: new RegExp('\\b' + text, 'gi'),
        oriunde: new RegExp(text, 'gi')
      };

      var date = Indexer.date;
      var rezultate = {
        laÎnceputDeRînd: [],
        laÎnceputDeCuvînt: [],
        oriunde: [],
        unificate: function () {
          var unice = {},
              toate = this.laÎnceputDeRînd
                .concat(this.laÎnceputDeCuvînt)
                .concat(this.oriunde),
              l = toate.length,
              i, j, m, valoare, număr;

          for (i = 0; i < l; i++) {
            valoare = toate[i];

            for (j = 0, m = date[valoare].length; j < m; j++) {
              număr = date[valoare][j];
              if (!unice[număr]) unice[număr] = date[''][număr];
            }
          }

          return unice;
        }
      };

      for (var item in date) {
        if (re.laÎnceputDeRînd.test(item)) rezultate.laÎnceputDeRînd.push(item);
        else if (re.laÎnceputDeCuvînt.test(item)) rezultate.laÎnceputDeCuvînt.push(item);
        else if (re.oriunde.test(item)) rezultate.oriunde.push(item);
      }

      self.postMessage(rezultate.unificate());
    }
  };

  // --------------------------------------------------

  function reEscape(re) {
    return re.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }
})();
