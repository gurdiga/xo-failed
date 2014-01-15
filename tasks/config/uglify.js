'use strict';

module.exports = {
  options: {
    report: 'min',
    sourceMap: function(dest) { return dest.replace(/\.js$/, '.map'); },
    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
  },
  build: {
    files: [{
      src: ['<%= ngmin.all.dest %>'],
      dest: 'build/app.min.js'
    }]
  }
};
