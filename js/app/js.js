(function() {
  'use strict';

  // things that I wish were in the language
  var js = {};


  function AssertionError(message) {
    this.name = 'AssertionError';
    this.message = message;
  }

  js.assert = function(requirement, message) {
    if (!message) throw new Error('js.assert: assertion requires a message');
    if (!requirement) throw new AssertionError(message);
  };


  js.debug = function() {
    /*global console*/
    console.log.apply(console, arguments);
  };


  js.extend = function(destination) {
    js.assert(js.isPlainObject(destination), 'js.extend: destination has to be a plain object [' + destination + ']');

    var sources = Array.prototype.slice.call(arguments, 1);

    js.assert(sources.length > 0, 'js.extend: specify at least one source');

    // thanks to Andrew Dupont @ http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
    sources.forEach(function(source) {
      for (var property in source) {
        if (js.isPlainObject(source[property])) {
          destination[property] = destination[property] || {};
          js.extend(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
    });

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
