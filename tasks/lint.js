'use strict';

var touch = require('touch');


module.exports = function(grunt) {
  grunt.registerTask('touch:jshintrc', function() {
    touch('.jshintrc');
  });

  grunt.registerTask('lint', ['jshint', 'touch:jshintrc']);
};
