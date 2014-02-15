(function() {
  'use strict';

  /*global Firebase*/
  XO.Firebase = {
    Config: {
      url: 'https://xo-dev.firebaseio.com'
    },

    ref: undefined,
    SimpleLogin: undefined,

    main: function() {
      XO.Firebase.ref = new Firebase(XO.Firebase.Config.url);
      XO.Firebase.SimpleLogin = angular.injector(['XO']).get('$firebaseSimpleLogin')(XO.Firebase.ref);
    }
  };

}());
