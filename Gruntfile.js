'use strict';

var path = require('path');
var config = require('load-grunt-config');

module.exports = function(grunt) {

  config(grunt, {
    configPath: path.join(process.cwd(), 'tasks/config'),
    init: true,
    loadGruntTasks: true,

    config: {
      pkg: grunt.file.readJSON('package.json'),
      src: ['app/**/*.js'],
      gs: ['app/**/*.gs'],
      config: ['Gruntfile.js', 'tasks/**/*.js', 'package.json'],
      tests: ['test/**/*.js']
    }
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('pre-commit', ['jshint']);

};
