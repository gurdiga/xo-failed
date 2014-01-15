'use strict';

module.exports = {
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
          'app/init.js',
          'app/**/*.js',
          '!app/ac*iun*.js',
          'action.js'
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
};
