'use strict';

module.exports = function(grunt) {

  grunt.config.init({
    pkg: grunt.file.readJSON('package.json'),
    src: ['js/app/**/*.js'],
    gs: ['js/app/**/*.gs'],
    config: ['Gruntfile.js', 'tasks/**/*.js', 'package.json'],
    tests: ['build/teste/qunit/**/*.js'],
  });

  grunt.loadTasks('./tasks');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('pre-commit', ['jshint']);

};
