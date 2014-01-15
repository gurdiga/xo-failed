'use strict';

module.exports = {
  server: {
    options: {
      keepalive: true,
//      protocol: 'https', // can’t get livereload to work on HTTPS
      hostname: '*'
    }
  }
};
