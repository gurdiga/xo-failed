'use strict';


module.exports = {
  options: {
    atBegin: true,
    interval: 1000,
    cwd: process.cwd()
  },

  gs: {
    files: ['<%= gs %>'],
    tasks: ['gorilla']
  },

  templates: {
    files: ['index.template.html', 'app/**/*.html'],
    tasks: ['html']
  },

  js: {
    options: {
      livereload: true
    },
    files: ['<%= src %>', '<%= config %>', '<%= tests %>'],
    tasks: ['test']
  }
};
