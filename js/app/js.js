(function() {
  'use strict';

  // things that I wish were in the language
  var js = {};


  var AssertionError = window.AssertionError = function(message) {
    this.name = 'AssertionError';
    this.message = message;
  };

  js.assert = function(requirement, message) {
    if (!message) throw new Error('js.assert: assertion requires a message');
    if (!requirement) throw new AssertionError(message);
  };


  js.extend = function(destination) {
    js.assert(js.isObject(destination), 'js.extend: destination has to be an object [' + destination + ']');

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

  js.isPlainObject = _.isPlainObject;
  js.isObject = _.isObject;
  js.isArray = _.isArray;
  js.isEmpty = _.isEmpty;


  window.js = js;


  var stringifyOriginal = window.JSON.stringify;

  window.JSON.stringify = function(object, replacer, space) {
    // thanks to Rob W, http://stackoverflow.com/a/11616993/227167
    var cache = [],
        string;

    function preventCircularReferences(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        }

        // Store value in our collection
        cache.push(value);
      }

      return value;
    }

    string = stringifyOriginal.call(JSON, object, preventCircularReferences, space);
    cache = null; // Enable garbage collection

    return string;
  };
})();
