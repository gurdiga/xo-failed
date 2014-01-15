'use strict';

module.exports = {
  all: {
    src: [
      'app/**/*-routing-config.js',
      'app/**/*-routing-controller.js',
      'app/**/*-directive.js',
      'app/**/*-controller.js',
      'app/**/*-service.js'
    ],
    dest: 'build/app.js'
  }
};
