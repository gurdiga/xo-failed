(function() {
  'use strict';

  XO.RegistrationFormValidator = function() {
    var RegistrationFormValidator = {

      emailPresent: function(email) {
        return email.trim().length > 0;
      },


      emailValid: function(email) {
        var regex = /^\s*[^@ ]+@[^@ ]+\.[^@ ]{2,}\s*$/;

        return regex.test(email);
      }
    };

    return RegistrationFormValidator;
  };

}());
