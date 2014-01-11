'use strict';

module.exports = function(grunt) {
  grunt.config.set('tidy', {
    index: {
      src: '<%= htmlbuild.index.dest %>'
    },
    qunit: {
      src: 'build/teste/qunit/index.html'
    },
    html: {
      src: [
        '<%= tidy.index.src %>',
        '<%= tidy.qunit.src %>'
      ]
    },
    templates: {
      src: '<%= concat.templates.dest %>'
    }
  });


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
