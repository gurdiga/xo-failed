'use strict';

module.exports = function(grunt) {
  grunt.config.set('gorilla', {
    options: {
      bare: true,
      sourceMap: true, // will these still work after concatenation/minification?
      overwrite: true
    },

    compile: {
      expand: true,
      cwd: 'js/app',
      src: ['*.gs'],
      dest: '<%= gorilla.compile.cwd %>',
      ext: '.compiled.js' // enable sourcemaps based on extension?
    }
  });

  grunt.loadNpmTasks('grunt-gorilla');

};
