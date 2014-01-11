(function() {
  'use strict';

  function ObiectulUrmaririi() {
    var optiuni = [{
      'dimensiune': 'scurtă',
      'formular-încheiere': 'încheiere-de-evacuare',
      'soapta-buton': 'Formează Încheiere de numire a datei evacuării forţate',
      'eticheta': 'evacuarea'
    }, {
      'dimensiune': 'scurtă',
      'formular-încheiere': 'încheiere-de-instalare',
      'soapta-buton': 'Formează Încheiere cu privire la instalarea în spaţiul locativ',
      'eticheta': 'instalarea'
    }, {
      'dimensiune': 'scurtă',
      'formular-încheiere': 'încheiere-de-schimb-forţat',
      'soapta-buton': 'Formează Încheiere cu privire la schimbul forţat al locuinţelor',
      'eticheta': 'schimbul forţat'
    }, {
      'formular-încheiere': 'încheiere-de-stabilire-a-domiciliului-copilului',
      'soapta-buton': 'Formează Somaţie cu privire la executarea documentului executoriu de stabilire a domiciliului copilului minor',
      'eticheta': 'stabilirea domiciliului copilului'
    }, {
      'formular-încheiere': 'încheiere-de-efectuare-a-unor-acţiuni-nelegate-de-bunuri',
      'soapta-buton': 'Formează Somaţie cu privire la executarea de către debitor a unor acţiuni nelegate de remiterea unor sume sau bunuri',
      'eticheta': 'efectuarea de către debitor a unor acţiuni obligatorii, nelegate de remiterea unor sume sau bunuri'
    }, {
      'formular-încheiere': 'încheiere-de-efectuare-a-unor-acţiuni-legate-de-bunuri-mobile',
      'soapta-buton': 'Formează Încheiere de numire a datei ridicării a unor sume sau bunuri',
      'eticheta': 'efectuarea de către debitor a unor acţiuni obligatorii, legate de remiterea unor bunuri mobile'
    }, {
      'formular-încheiere': 'încheiere-de-efectuare-a-unor-acţiuni-legate-de-bunuri-imobile',
      'soapta-buton': 'Formează Încheiere de numire a datei transmiterii bunurilor imobile',
      'eticheta': 'efectuarea de către debitor a unor acţiuni obligatorii, legate de remiterea unor bunuri imobile'
    }, {
      'dimensiune': 'scurtă',
      'formular-încheiere': 'încheiere-de-confiscare-a-bunurilor',
      'soapta-buton': 'Formează Încheiere de numire a datei confiscării bunurilor',
      'eticheta': 'confiscarea bunurilor'
    }, {
      'dimensiune': 'scurtă',
      'formular-încheiere': 'încheiere-de-nimicire-a-bunurilor',
      'soapta-buton': 'Formează Încheiere de numire a datei nimicirii bunurilor',
      'eticheta': 'nimicirea bunurilor'
    }, {
      'dimensiune': 'scurtă',
      'formular-încheiere': 'încheiere-de-restabilire-la-locul-de-muncă',
      'soapta-buton': 'Formează Somaţie de restabilire a salariatului la locul de muncă',
      'eticheta': 'restabilirea la locul de muncă'
    }, {
      'formular-încheiere': 'încheiere-privind-aplicarea-măsurilor-de-asigurare-a-acţiunii',
      'soapta-buton': 'Formează Încheiere de intentare a procedurii de executare privind aplicarea măsurilor de asigurare a acţiunii',
      'eticheta': 'aplicarea măsurilor de asigurare a acţiunii'
    }];

    return {
      optiuni: optiuni
    };
  }

  window.App.service('ObiectulUrmaririi', ObiectulUrmaririi);

})();
