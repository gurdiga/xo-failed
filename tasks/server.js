'use strict';

module.exports = function(grunt) {
  grunt.registerTask('s', ['html', 'server']);
  grunt.registerTask('server', function() {
    var args = '-p 7000 -d ./'.split(' ');

    grunt.util.spawn({
      cmd: 'httpster',
      args: args,
      opts: {
        stdio: 'pipe'
      }
    }, this.async());
  });
};
