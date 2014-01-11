'use strict';

module.exports = function(grunt) {
  grunt.config.set('watch', {
    options: {
      atBegin: true
    },

    gs: {
      options: {
        livereload: true
      },
      files: ['<%= gs %>'],
      tasks: ['gorilla']
    },

    templates: {
      options: {
        livereload: true,
        event: ['added', 'deleted']
      },
      files: ['app/**/*.html'],
      tasks: ['htmlbuild']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');

};
