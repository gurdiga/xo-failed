'use strict';

module.exports = function(grunt) {
  grunt.config.set('uglify', {
    options: {
      report: 'min',
      sourceMap: function(dest) { return dest.replace(/\.js$/, '.map'); },
      banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    },
    build: {
      files: [{
        src: ['<%= src %>'],
        dest: 'build/app.min.js'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

};
