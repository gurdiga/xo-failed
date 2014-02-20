(function() {
  'use strict';

  XO.generatePassword = function(length, groupLength) {
    var GROUP_SEPARATOR = '-';
    var CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var password = '';
    var currentGroupLength = 0;

    for (var i = 0; i < length; i++) {
      password += CHARACTERS.charAt(Math.floor(randomFraction() * CHARACTERS.length));
      currentGroupLength++;

      if (currentGroupLength === groupLength && i + 1 < length) {
        password += GROUP_SEPARATOR;
        currentGroupLength = 0;
      }
    }

    return password;

    function randomFraction() {
      if ('window.Uint32Array' in window && 'crypto' in window && 'getRandomValues' in window.crypto) {
        var intArray = new window.Uint32Array(1);
        var randomNumbers = window.crypto.getRandomValues(intArray);

        return parseFloat('.' + randomNumbers[0]);
      } else {
        return Math.random();
      }
    }

  };

}());
