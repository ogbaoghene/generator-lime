// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Autoload grunt plugins
  require('jit-grunt')(grunt);

  // Configurable paths
  var config = {
    dev: 'dev/',
    build: 'build',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      // bower: {
      //   files: ['bower.json'],
      //   tasks: ['wiredep']
      // },
      gruntfile: {
        files: ['Gruntfile.js']
      },<% if (includeAutoprefixer) { %>
      sass: {
        files: ['<%%= config.dev %>sass/**/*.{scss,sass}'],
        tasks: ['sass:build', 'autoprefixer:build']
      },<% } else { %>
      sass: {
        files: ['<%%= config.dev %>sass/**/*.{scss,sass}'],
        tasks: ['sass:build']
      },<% } %><% if (includeJavascript) { %>
      js: {
        files: ['<%%= config.dev %>js/{,*/}*.js'],
        tasks: ['concat:build']
      },<% } %><% if (includeStyleguide) { %>
      styleguide: {
        files: ['<%%= config.dev %>sass/**/*.{scss,sass}', '<%%= config.dev %>sass/styleguide.md'],
        tasks: ['styleguide', 'copy:styleguide']
      },<% } %>
      livereload: {
        options: {
          livereload: '<%%= connect.options.livereload %>'
        },
        files: [<% if (addContainer) { %> 
          '<%%= config.dev %>index.html',<% } %>
          '<%%= config.dev %>templates/{,*/}*.html',
          '<%%= config.build %>/styles/{,*/}*.css'<% if (includeStyleguide) { %>,
          '<%%= config.build %>/styleguide/{,*/}*.html'<% } %><% if (includeJavascript) { %>,
          '<%%= config.build %>/js/{,*/}*.js'<% } %><% if (includeImages) { %>,
          '<%%= config.dev %>images/{,*/}*'<% } %>
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9001,
        open: true,
        livereload: 35729,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          // base: ['<%%= config.dev %>']
          middleware: function(connect) {
            return [
              connect.static(config.build),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.dev)
            ];
          }
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        src: ['<%%= config.dist %>/*']
      },
      build: {
        src: ['<%%= config.build %>/*']
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {<% if (addLibsass) { %>
        sourceMap: false,
        includePaths: ['bower_components'],
        // imagePath: 
        <% } else { %>
        sourcemap: false,
        loadPath: 'bower_components'
      <% } %>},
      dist: {<% if (addLibsass) { %>
        outputStyle: 'compressed',
        files: {
          '<%%= config.dist %>/styles/styles.min.css': '<%%= config.dev %>sass/screen.scss'
        }
        <% } else { %>
        options: {
          style: 'compressed'
        },
        files: {
          '<%%= config.dist %>/styles/styles.min.css': '<%%= config.dev %>sass/screen.scss'
        }
      <% } %>},
      build: {<% if (addLibsass) { %>
        files: {
          '<%%= config.build %>/styles/styles.css': '<%%= config.dev %>sass/screen.scss'
        }
        <% } else { %>
        options: {
          style: 'expanded'
        },
        files: {
          '<%%= config.build %>/styles/styles.css': '<%%= config.dev %>sass/screen.scss'
        }
      <% } %>}
    },<% if (includeAutoprefixer) { %>

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1','ie 8']
      },
      dist: {
        options: {
          map: true
        },
        src: '<%%= config.dist %>/styles/styles.min.css'
      },
      build: {
        options: {
          map: true
        },
        src: '<%%= config.build %>/styles/styles.css'
      }
    },<% } %><% if (includeStyleguide) { %>

    // Generate a styleguide
    styleguide: {
      options: {
        //template: {
          //src: 'docs/styleguide-template'
        //},
        framework: {
          name: 'kss'
        }
      },
      all: {
        files: [{
         '<%%= config.build %>/styleguide': '<%%= config.dev %>sass/screen.scss'
        }]
      }
    },<% } %><% if (includeJavascript) { %>

    // Concatenate JS files
    concat: {
      options: {
        separator: ';',
      },
      build: {
        src: [
          '<%%= config.dev %>js/{,*/}*.js'
        ],
        dest: '<%%= config.build %>/js/scripts.js'
      }
    },

    // Minify JS files
    uglify: {
      // options: {
      //   mangle: false
      // },
      dist: {
        files: {
          '<%%= config.dist %>/js/scripts.min.js': ['<%%= config.build %>/js/scripts.js']
        }
      }
    },<% } %>

    // Automatically inject Bower components files

    // Copies remaining files to places other tasks can use
    copy: {<% if (includeStyleguide) { %>
      styleguide: {
        src: '<%%= config.build %>/styles/styles.css',
        dest: '<%%= config.build %>/styleguide/public/style.css'
      }<% } %>
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      dev: [
        'sass:build'<% if (includeStyleguide) { %>,
        'styleguide'<% } %><% if (includeJavascript) { %>,
        'concat'<% } %>
      ],
      dist: [
        'sass:dist'<% if (includeJavascript) { %>,
        'concat'<% } %>
        // 'imagemin',
        // 'svgmin'
      ]
    }

  });


  grunt.registerTask('deploy', 'generate production-ready files', [
    'clean:dist',
    'concurrent:dist'<% if (includeAutoprefixer) { %>,
    'autoprefixer:dist'<% } %><% if (includeJavascript) { %>,
    'uglify'<% } %>
  ]);

  grunt.registerTask('dev', 'generate KSS styleguide', [
    'clean:build',
    'concurrent:dev',<% if (includeAutoprefixer) { %>
    'autoprefixer:build',<% } %><% if (includeStyleguide) { %>
    'copy:styleguide'<% } %>
  ]);

  grunt.registerTask('serve', 'start the server and preview your project', function (target) {
    grunt.task.run([
      'dev',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('default', [
    'serve'
  ]);

};
