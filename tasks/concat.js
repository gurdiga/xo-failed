'use strict';

module.exports = function(grunt) {
  grunt.config.set('concat', {
    templates: {
      options: {
        process: function(src, filepath) {
          var id = filepath.match(/([^\/]+)-directive.html$/)[1];

          return '' +
            '<script type="text/ng-template" id="directive-' + id + '">\n' +
            src +
            '</script>\n';
        }
      },
      src: 'app/**/*-directive.html',
      dest: 'app/templates.html'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

};
