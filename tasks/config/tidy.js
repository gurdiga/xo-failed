'use strict';

module.exports = {
  index: {
    src: '<%= htmlbuild.index.dest %>'
  },
  'test-runner-template': {
    src: 'test/index.template.html'
  },
  'test-runner-compiled': {
    src: 'test/index.html'
  },
  html: {
    src: '<%= tidy.index.src %>'
  },
  templates: {
    src: '<%= concat.templates.dest %>'
  }
};
