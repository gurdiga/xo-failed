'use strict';

module.exports = function(grunt) {
  grunt.registerTask('test', ['html', 'lint', 'mocha_phantomjs']);
};

