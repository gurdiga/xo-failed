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


  js.extend = function() {
    return _.extend.apply(_, arguments);
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


  window.js = js;
})();
