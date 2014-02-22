(function() {
  'use strict';

  var deferrable = angular.injector(['XO']).get('$q');

  XO.Deferrable = {
    all: deferrable.all,
    create: deferrable.defer
  };
}());
