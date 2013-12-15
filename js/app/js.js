(function() {
  /*global console*/
  'use strict';

  // things that I wish were in the language
  var js = {};

  js.assert = function(requirement, message) {
    if (!requirement) throw new Error(message);
  };


  js.debug = function() {
    console.log.apply(console, arguments);
  };


  js.extend = function(destination, source) {
    // thanks to Andrew Dupont @ http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
    for (var property in source) {
      if (js.isPlainObject(source[property])) {
        destination[property] = destination[property] || {};
        js.extend(destination[property], source[property]);
      } else {
        destination[property] = source[property];
      }
    }

    return destination;
  };


  js.isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  js.isFunction = function(f) {
    return _.isFunction(f);
  };

  js.isOneOf = function(subject, collection) {
    return _.contains(collection, subject);
  };

  js.isPlainObject = function(o) {
    return _.isPlainObject(o);
  };

  js.isArray = function(o) {
    return _.isArray(o);
  };


  window.js = js;
})();
