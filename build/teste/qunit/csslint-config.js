/*global CSSLint:false*/
(function() {
  'use strict';

  var STYLESHEETS = [
    '/css/style.css',
    '/css/shared.css',
    '/css/încheiere.css'
  ];

  var RULES = {
    //'adjoining-classes': true,
    //'box-model': true,
    'box-sizing': true,
    'compatible-vendor-prefixes': true,
    //'display-property-grouping': true,
    'duplicate-background-images': true,
    'duplicate-properties': true,
    'empty-rules': true,
    'errors': true,
    'fallback-colors': true,
    'floats': true,
    'font-faces': true,
    //'font-sizes': true,
    'gradients': true,
    //'ids': true,
    //'import': true,
    //'important': true,
    'known-properties': true,
    //'outline-none': true,
    //'overqualified-elements': true,
    //'qualified-headings': true,
    'regex-selectors': true,
    'rules-count': true,
    'selector-max-approaching': true,
    'selector-max': true,
    'shorthand': true,
    'star-property-hack': true,
    'text-indent': true,
    'underscore-property-hack': true,
    //'unique-headings': true,
    'universal-selector': true,
    //'unqualified-attributes': true,
    'vendor-prefix': true,
    'zero-units': true
  };

  module('CSSLint');

  $.each(STYLESHEETS, function(_, stylesheet) {
    asyncTest(stylesheet, function() {
      $.get(stylesheet + '?' + (new Date()).getTime(), function(code) {
        var results = CSSLint.verify(code, RULES);

        if (results.messages.length === 0) {
          ok(true);
        } else {
          $.each(results.messages, function(_, item) {
            var message = item.type + ': ' + item.message;

            if (item.line) message += ' (line ' + item.line + ', col ' + item.col + ')';

            ok(false, message);
          });
        }

        start();
      });
    });
  });

})();
