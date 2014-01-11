'use strict';

module.exports = function(grunt) {
  grunt.config.set('clean', {
    templates: '<%= concat.templates.dest %>'
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
};
