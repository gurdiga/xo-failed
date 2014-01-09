(function() {
  'use strict';

  module.exports = function(grunt) {

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      src: ['js/app/**/*.js'],
      gs: ['js/app/**/*.gs'],
      config: ['Gruntfile.js', 'package.json'],
      tests: ['build/teste/qunit/**/*.js'],

      jshint: {
        files: ['<%= src %>', '<%= config %>', '<%= tests %>'],
        options: grunt.file.readJSON('.jshintrc')
      },

      uglify: {
        options: {
          report: 'min',
          sourceMap: function(dest) { return dest.replace(/\.js$/, '.map'); },
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
          files: [{
            src: ['<%= src %>'],
            dest: 'build/app.min.js'
          }]
        }
      },

      concat: {
        options: {
          separator: '\n'
        },
        dist: {
          // concat templates and inject them into index.html?
        }
      },

      watch: {
        options: {
          atBegin: true
        },

        gs: {
          options: {
            livereload: true
          },
          files: ['<%= gs %>'],
          tasks: ['gorilla']
        },

        templates: {
          options: {
            livereload: true,
            event: ['added', 'deleted']
          },
          files: ['js/app/**/*.html'],
          tasks: ['inject-templates']
        }
      },

      // https://npmjs.org/package/grunt-gorilla
      gorilla: {
        options: {
          bare: true,
          sourceMap: true, // will these still work after concatenation/minification?
          overwrite: true
        },

        compile: {
          expand: true,
          cwd: 'js/app',
          src: ['*.gs'],
          dest: '<%= gorilla.compile.cwd %>',
          ext: '.compiled.js' // enable sourcemaps based on extension?
        }
      },

      htmlbuild: {
        index: {
          src: 'index.template.html',
          dest: './index.html',
          options: {
            relative: false,
            scripts: {
              lib: [
                'js/lib/jquery*.js',
                'lib/jquery-ui-1.9.2.custom/js/jquery-ui-1.9.2.custom.min.js',
                'js/lib.js',
                'js/lib/firebase.js',
                'js/lib/firebase*.js',
                'js/lib/angular.min.js',
                'js/lib/angular*.js'
              ],
              app: [
                'js/app/init.js',
                'js/app/**/*.js',
                'js/action.js'
              ],
            },
            sections: {
              templates: 'js/app/**/*.html'
            }
          }
        },

        qunit: {
          // TODO
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-gorilla');

    grunt.registerTask('html', ['htmlbuild']);
    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('pre-commit', ['jshint']);


  };
})();
