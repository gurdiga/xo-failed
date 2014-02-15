(function() {
  'use strict';

  XO.LoggedAuthenticationService = function(authenticationService) {
    var LoggedAuthenticationService = {
      createUser       : addDebugMessages('createUser'),
      authenticateUser : addDebugMessages('authenticateUser')
    };

    return LoggedAuthenticationService;


    function addDebugMessages(functionName) {
      var message = 'AuthenticationService.' + functionName + '()';

      return function(email, password) {
        console.debug(message, email);

        var promise = authenticationService[functionName](email, password);

        promise.then(function() {
          console.debug(message + ' finished', email);
        });

        promise.catch(function(err) {
          console.error(err);
        });

        return promise;
      };
    }
  };

}());
