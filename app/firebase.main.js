(function() {
  'use strict';
  /*global Firebase*/

  XO.Firebase = {
    Config: {
      url: 'https://xo-dev.firebaseio.com'
    },

    main: function() {
      XO.Firebase.ref = new Firebase(XO.Firebase.Config.url);

      XO.Firebase.SimpleLogin  = angular.injector(['XO']).get('$firebaseSimpleLogin')(XO.Firebase.ref);
      XO.Firebase.$firebase    = angular.injector(['XO']).get('$firebase');
      XO.Firebase.angularScope = angular.injector(['XO']).get('$rootScope').$new();
    }
  };

}());
