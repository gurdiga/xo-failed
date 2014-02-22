'use strict';

module.exports = function(grunt) {
  grunt.registerTask('test', ['html', 'lint', 'mocha_phantomjs']);

  grunt.registerTask('subset-tests', 'Only run the specified suset of tests', function(subset) {
    if (!subset) {
      grunt.log.error('This task needs the subset specified like this: subset-tests:test/util/*.js');
      return false;
    }

    grunt.config('tests', subset.split(','));
  });
};

