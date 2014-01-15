'use strict';


module.exports = {
  options: {
    atBegin: true
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
    files: ['<%= src %>', '<%= config %>', '<%= tests %>'],
    tasks: ['html', 'lint']
  }
};
