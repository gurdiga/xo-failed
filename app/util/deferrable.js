(function() {
  'use strict';

  XO.Deferrable = {
    create: angular.injector(['XO']).get('$q').defer
  };
}());
