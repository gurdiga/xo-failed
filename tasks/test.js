'use strict';

module.exports = function(grunt) {
  grunt.registerTask('test', ['jshint', 'html', 'lint', 'mocha_phantomjs']);
};

