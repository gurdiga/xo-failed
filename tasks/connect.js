'use strict';

module.exports = function(grunt) {
  grunt.config.set('connect', {
    server: {
      options: {
        keepalive: true,
        protocol: 'https',
        hostname: '*'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('c', 'connect');
};
