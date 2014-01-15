'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('tidy', 'HTML lint', function() {
    var args = '-quiet -errors -utf8 -xml'.split(' ');

    args = args.concat(this.data.src);

    grunt.util.spawn({
      cmd: 'tidy',
      args: args,
      opts: {
        stdio: 'pipe'
      }
    }, this.async());
  });

};
