(function() {
  'use strict';

  angular.module('App').service('ObiectulUrmaririi', function() {
    var optiuni = [{
      'slug': 'evacuare',
      'dimensiune': 'scurtă',
      'formular-încheiere': 'încheiere-de-evacuare',
      'soapta-buton': 'Formează Încheiere de numire a datei evacuării forţate',
      'eticheta': 'evacuarea'
    }, {
      'slug': 'instalare',
      'dimensiune': 'scurtă',
      'formular-încheiere': 'încheiere-de-instalare',
      'soapta-buton': 'Formează Încheiere cu privire la instalarea în spaţiul locativ',
      'eticheta': 'instalarea'
    }, {
      'slug': 'schimb-fortat',
      'dimensiune': 'scurtă',
      'formular-încheiere': 'încheiere-de-schimb-forţat',
      'soapta-buton': 'Formează Încheiere cu privire la schimbul forţat al locuinţelor',
      'eticheta': 'schimbul forţat'
    }, {
      'slug': 'stabilire-a-domiciliului-copilului',
      'formular-încheiere': 'încheiere-de-stabilire-a-domiciliului-copilului',
      'soapta-buton': 'Formează Somaţie cu privire la executarea documentului executoriu de stabilire a domiciliului copilului minor',
      'eticheta': 'stabilirea domiciliului copilului'
    }, {
      'slug': 'efectuare-a-unor-actiuni-nelegate-de-bunuri',
      'formular-încheiere': 'încheiere-de-efectuare-a-unor-acţiuni-nelegate-de-bunuri',
      'soapta-buton': 'Formează Somaţie cu privire la executarea de către debitor a unor acţiuni nelegate de remiterea unor sume sau bunuri',
      'eticheta': 'efectuarea de către debitor a unor acţiuni obligatorii, nelegate de remiterea unor sume sau bunuri'
    }, {
      'slug': 'efectuare-a-unor-actiuni-legate-de-bunuri-mobile',
      'formular-încheiere': 'încheiere-de-efectuare-a-unor-acţiuni-legate-de-bunuri-mobile',
      'soapta-buton': 'Formează Încheiere de numire a datei ridicării a unor sume sau bunuri',
      'eticheta': 'efectuarea de către debitor a unor acţiuni obligatorii, legate de remiterea unor bunuri mobile'
    }, {
      'slug': 'efectuare-a-unor-actiuni-legate-de-bunuri-imobile',
      'formular-încheiere': 'încheiere-de-efectuare-a-unor-acţiuni-legate-de-bunuri-imobile',
      'soapta-buton': 'Formează Încheiere de numire a datei transmiterii bunurilor imobile',
      'eticheta': 'efectuarea de către debitor a unor acţiuni obligatorii, legate de remiterea unor bunuri imobile'
    }, {
      'slug': 'confiscare-a-bunurilor',
      'dimensiune': 'scurtă',
      'formular-încheiere': 'încheiere-de-confiscare-a-bunurilor',
      'soapta-buton': 'Formează Încheiere de numire a datei confiscării bunurilor',
      'eticheta': 'confiscarea bunurilor'
    }, {
      'slug': 'nimicire-a-bunurilor',
      'dimensiune': 'scurtă',
      'formular-încheiere': 'încheiere-de-nimicire-a-bunurilor',
      'soapta-buton': 'Formează Încheiere de numire a datei nimicirii bunurilor',
      'eticheta': 'nimicirea bunurilor'
    }, {
      'slug': 'restabilire-la-locul-de-munca',
      'dimensiune': 'scurtă',
      'formular-încheiere': 'încheiere-de-restabilire-la-locul-de-muncă',
      'soapta-buton': 'Formează Somaţie de restabilire a salariatului la locul de muncă',
      'eticheta': 'restabilirea la locul de muncă'
    }, {
      'slug': 'aplicarea-masurilor-de-asigurare-a-actiunii',
      'formular-încheiere': 'încheiere-privind-aplicarea-măsurilor-de-asigurare-a-acţiunii',
      'soapta-buton': 'Formează Încheiere de intentare a procedurii de executare privind aplicarea măsurilor de asigurare a acţiunii',
      'eticheta': 'aplicarea măsurilor de asigurare a acţiunii'
    }];

    return {
      optiuni: optiuni
    };
  });

})();
