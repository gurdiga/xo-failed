'use strict';

module.exports = function(grunt) {

  grunt.registerTask('html', [
    'concat:templates',
    'tidy:templates',
    'htmlbuild',
    'tidy:html'/*,
    'clean:templates'*/
  ]);

};
