'use strict';

var basename = require('path').basename;

module.exports = {
  templates: {
    options: {
      process: function(src, filepath) {
        var templateId = basename(filepath, '.html');

        return '' +
          '<script type="text/ng-template" id="' + templateId + '">\n' +
          src +
          '</script>\n';
      }
    },
    src: [
      'app/**/*.html'
    ],
    dest: 'build/templates.html'
  }
};
