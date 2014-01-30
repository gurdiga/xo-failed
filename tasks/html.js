'use strict';

module.exports = function(grunt) {

  grunt.registerTask('test-runner-html', [
    'tidy:test-runner-template',
    'htmlbuild:test-runner',
    'tidy:test-runner-compiled'
  ]);

  grunt.registerTask('index-html', [
    'concat:templates',
    'tidy:templates',
    'htmlbuild:index',
    'tidy:html'/*,
    'clean:templates'*/
  ]);

  grunt.registerTask('html', [
    'index-html',
    'test-runner-html'
  ]);

};
