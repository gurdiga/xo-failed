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
          'app/config.js',
          'app/bind-to-angular.js',
          '<%= src %>',
          '!app/ac*iun*.js',
          'js/action.js'
        ],
      },
      sections: {
        templates: '<%= concat.templates.dest %>'
      }
    }
  },

  'test-runner': {
    src: 'test/index.template.html',
    dest: 'test/index.html',
    options: {
      relative: false,
      prefix: '../',
      scripts: {
        lib: [
          'node_modules/grunt-mocha-phantomjs/node_modules/mocha-phantomjs/node_modules/mocha/mocha.js',
          'node_modules/chai/chai.js',
          'node_modules/sinon-chai/lib/sinon-chai.js',
          'node_modules/sinon/pkg/sinon.js',
        ],
        helpers: [
          'test/test-helpers/*.js',
        ],
        tests: [
          '<%= tests %>'
        ],
        src: '<%= htmlbuild.index.options.scripts %>'
      }
    }
  }
};
