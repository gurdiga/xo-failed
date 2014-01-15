'use strict';

module.exports = {
  index: {
    src: '<%= htmlbuild.index.dest %>'
  },
  qunit: {
    src: 'test/index.html'
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
};
