'use strict';

module.exports = function(grunt) {

  grunt.config.init({
    pkg: grunt.file.readJSON('package.json'),
    app: 'app',
    src: ['app/**/*.js'],
    gs: ['app/**/*.gs'],
    config: ['Gruntfile.js', 'tasks/**/*.js', 'package.json'],
    tests: ['test/**/*.js'],
  });

  grunt.loadTasks('./tasks');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('pre-commit', ['jshint']);

};
