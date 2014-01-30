'use strict';

module.exports = {
  options: {
    reporter: 'dot'
  },
  all: {
    options: {
      urls: [
        '<%= connect.server.options.protocol %>://<%= connect.server.options.hostname %>:<%= connect.server.options.port %>/test/'
      ]
    }
  }
};

