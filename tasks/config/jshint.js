'use strict';

var fs = require('fs');
var readJSON = require('grunt/lib/grunt/file').readJSON;


var referenceTime = fs.statSync('.jshintrc').mtime;

function recentlyChanged(file) {
  if (process.env.FORCE) return true;

  return fs.statSync(file).mtime > referenceTime;
}


module.exports = {
  options: readJSON('.jshintrc'),

  browser: {
    options: readJSON('.jshintrc.browser'),
    files: [{
      src: ['<%= src %>', '<%= tests %>'],
      filter: recentlyChanged
    }]
  },

  node: {
    options: readJSON('.jshintrc.node'),
    files: [{
      src: ['<%= config %>'],
      filter: recentlyChanged
    }]
  }

};
