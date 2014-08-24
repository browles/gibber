module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compileServer: {
        files: {
          'app.js': 'coffee/app.coffee',
          'markov.js': 'coffee/markov.coffee',
          'handle.js': 'coffee/handle.coffee'
        }
      },
      compileClient: {
        files: {
          'public/client.js': 'coffee/client.coffee'
        }
      }
    },
    coffee_jshint: {
      files: ['../**/*.coffee']
    },
    jshint: {
      files: ['../**/*.js']
    },
    concat: {
      dist: {
        src: [
          'public/angular.min.js',
          'public/angular-resource.min.js',
          'public/angular-route.min.js',
          'public/client.js'
        ],
        dest: 'public/bundle.js'
      }
    },
    uglify: {
      my_target: {
        files: {
          'public/bundle.min.js': ['public/bundle.js']
        }
      }
    },
    watch: {
      serverCoffee: {
        files : ['coffee/*.coffee'],
        tasks : [
          'coffee_jshint', 'coffee:compileServer'
        ]
      },
      clientCoffee: {
        files : ['public/coffee/*.coffee'],
        tasks : [
          'coffee_jshint', 'coffee:compileClient'
        ]
      },
      server: {

      }
    },
    nodemon: {
      dev: {
        script: 'app.js'
      }
    },
    shell: {
      prodServer: {
        command: [
          'git add .',
          'git commit -m "grunt deploy"'
          // 'git push azure azure-deployment:master'
        ].join('&&')
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-coffee-jshint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.registerTask('build', ['coffee:compileClient','concat','uglify','shell:prodServer']);
};
