'use strict';

module.exports = function(grunt) {
  // https://npmjs.org/package/grunt-gorilla
  grunt.config.set('htmlbuild', {
    index: {
      src: 'index.template.html',
      dest: 'index.html',
      options: {
        relative: false,
        scripts: {
          lib: [
            'js/lib/jquery*.js',
            'lib/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js',
            'js/lib.js',
            'js/lib/firebase.js',
            'js/lib/firebase*.js',
            'js/lib/angular.min.js',
            'js/lib/angular*.js'
          ],
          app: [
            'js/app/init.js',
            'js/app/**/*.js',
            'js/action.js'
          ],
        },
        sections: {
          templates: '<%= concat.templates.dest %>'
        }
      }
    },

    qunit: {
      // TODO
    }
  });

  grunt.loadNpmTasks('grunt-html-build');

  grunt.registerTask('html', [
    'concat:templates',
    'tidy:templates',
    'htmlbuild',
    'tidy:html',
    'clean:templates'
  ]);

};
