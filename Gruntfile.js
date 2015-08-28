module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'expanded', //nested, expanded, compact, compressed
          sourceMap: false
        },
        files: {
          'css/app.css' : 'scss/app.scss'
        }
      }
    },

    jshint: { 
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', 'js/*.js', 'js/libraries/*.js']
    },

    php: {
        dist: {
            options: {
                hostname: '127.0.0.1',
                port: 9000,
                base: '', // Project root
                keepalive: false,
                open: false
            }
        }
    },

    browserSync: {
        dist: {
            bsFiles: {
                  src : [
                    'css/*.css',
                    'img/*',
                    'jsmin/*.js',
                    '*.php',
                    '*.html'
                  ]
            },
            options: {
                proxy: '<%= php.dist.options.hostname %>:<%= php.dist.options.port %>',
                watchTask: true,
                notify: true,
                open: true,
                logLevel: 'silent',
                ghostMode: {
                    clicks: true,
                    scroll: true,
                    links: true,
                    forms: true
                }
            }
        }
    },
    
  
    uglify: {
        files: { 
            src: ['js/*.js' 
                  /*'js/libraries/*.js', 
                  'bower_components/fastclick/lib/*.js', 
                  'bower_components/jquery-2/dist/jquery.js',
                  'bower_components/jquery-backstretch/jquery.backstretch.js',
                  'bower_components/jquery-cookie-disclaimer/dist/jquery.cookieDisclaimer.js',
                  'bower_components/jquery-placeholder/jquery.placeholder.js',
                  'bower_components/jquery.cookie/jquery.cookie.js',
                  'bower_components/jquery.easing/js/jquery.easing.js',
                  'bower_components/jquery.inview/jquery.inview.js',
                  'bower_components/jquery.transit/jquery.transit.js',
                  'bower_components/lazyloadxt/dist/jquery.lazyloadxt.js',
                  'bower_components/lazyloadxt/dist/jquery.lazyloadxt.extra.js',
                  'bower_components/scroll-reveal/scrollReveal.js',
                  'bower_components/readmore/readmore.js',
                  'bower_components/waypoints/lib/jquery.waypoints.js',
                  'node_modules/requirejs/require.js',
                  'bower_components/foundation/js/vendor/*.js',
                  'bower_components/foundation/js/foundation/*.js',  
                  'bower_components/responsive-tables/responsive-tables.js',
                  'bower_components/picturefill/src/picturefill.js'*/],  
            dest: 'jsmin',  // destination folder
            expand: true,   // allow dynamic building
            flatten: true,  // remove all unnecessary nesting
            rename: function(dest, src) { return dest + '/' + src.replace('.js', '.min.js'); }
        }
    },

    minified: {
        files: { 
            src: ['js/*.js'
            ],  
            dest: 'jsmin', 
            options : {
              sourcemap: false,
              allinone: false,
              mirrorSource: {
                path: 'jsmin'
              },
              ext: '.min.js'
            }
        }
    },

    modernizr: {
 
        dist: {
            'devFile': 'bower_components/modernizr/modernizr.js',
            // Path to save out the built file. 
            'outputFile' : 'jsmin/modernizr-custom.min.js',

            'extra' : {
                'shiv' : true,
                'printshiv' : false,
                'load' : true,
                'mq' : false,
                'cssclasses' : true
            },
     
            // Based on default settings on http://modernizr.com/download/ 
            'extensibility' : {
                'addtest' : true,
                'prefixed' : true,
                'teststyles' : true,
                'testprops' : true,
                'testallprops' : true,
                'hasevents' : true,
                'prefixes' : true,
                'domprefixes' : true,
                'cssclassprefix': ''
            },
     
            // By default, source is uglified before saving 
            'uglify' : true,
     
            // Define any tests you want to implicitly include. 
            'tests' : [],
     
            // By default, this task will crawl your project for references to Modernizr tests. 
            // Set to false to disable. 
            'parseFiles' : true,
     
            // When parseFiles = true, this task will crawl all *.js, *.css, *.scss and *.sass files, 
            // except files that are in node_modules/. 
            // You can override this by defining a 'files' array below. 
            'files' : { 
                 'src': ['scss/*.scss','css/*.css','js/*.js','jsmin/*.js'] 
            }, 
     
            // This handler will be passed an array of all the test names passed to the Modernizr API, and will run after the API call has returned 
            // 'handler': function (tests) {}, 
     
            // When parseFiles = true, matchCommunityTests = true will attempt to 
            // match user-contributed tests. 
            'matchCommunityTests' : false,
     
            // Have custom Modernizr tests? Add paths to their location here. 
            'customTests' : []
        }
     
    },

    watch: {

      grunt: { // watch changes ot grunt file
        options: {
          reload: true
        },
        files: ['Gruntfile.js']
      },

      sass: { // watch all scss files
        files: ['scss/*.scss'],
        tasks: ['sass']
      },

      js: { // watch js files
        files: [
          'js/*.js',
          'Gruntfile.js'
        ],
        tasks: ['jshint','minified'] // execute these tasks on change
      }
    }

  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-minified');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-modernizr');
  grunt.loadNpmTasks('grunt-php');

  grunt.registerTask('build', ['sass','modernizr','uglify']);
  grunt.registerTask('default', ['build','php:dist','browserSync:dist','minified','watch']);

};
