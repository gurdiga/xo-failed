'use strict';

module.exports = function(grunt) {
  grunt.config.set('jshint', {
    options: grunt.file.readJSON('.jshintrc'),
    browser: {
      files: ['<%= src %>', '<%= tests %>']
    },
    node: {
      options:  grunt.file.readJSON('.jshintrc.node'),
      files: ['<%= config %>']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

};
