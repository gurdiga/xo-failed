'use strict';

module.exports = {
  options: {
    overwrite: true
  },

  compile: {
    expand: true,
    src: ['<%= gs %>'],
    ext: '.js'
  }
};
