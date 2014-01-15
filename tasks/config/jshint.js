'use strict';

var readJSON = require('grunt/lib/grunt/file').readJSON;

module.exports = {
  options: readJSON('.jshintrc'),

  browser: {
    options: readJSON('.jshintrc.browser'),
    files: ['<%= src %>', '<%= tests %>']
  },

  node: {
    options: readJSON('.jshintrc.node'),
    files: ['<%= config %>']
  }

};
