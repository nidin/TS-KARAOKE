module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-karma');

    grunt.initConfig({
        ProjectFileDir:'D:\\WORKSPACE\\TypeScript\\TS-KARAOKE',
        DocumentClassDir:'D:\\WORKSPACE\\TypeScript\\TS-KARAOKE\\src\\nid',
        DocumentClass:'CDGDisplay.ts',
        shell: {
          options:{
            stdout: true,
            stdin: true,
            stderr: true
          },
          npm_install: {
            command: 'npm install'
          },
          bower_install: {
            command: 'bower install'
          },
          build:{
              command:[
                  'cd bat',
                  'build-ts.bat <%= ProjectFileDir %> <%= DocumentClassDir %> <%= DocumentClass %>'
              ].join('&&')
          }
        },

        connect: {
          options: {
            base: 'build'
          },
          webserver: {
            options: {
              port: 8888,
              keepalive: true
            }
          },
          devserver: {
            options: {
              port: 8888
            }
          },
          testserver: {
            options: {
              port: 9999
            }
          },
          coverage: {
            options: {
              base: 'coverage/',
              port: 5555,
              keepalive: true
            }
          }
        },

        open: {
          devserver: {
            path: 'http://localhost:8888'
          },
          coverage: {
            path: 'http://localhost:5555'
          }
        },

        karma: {
          unit: {
            configFile: './test/karma-unit.conf.js',
            autoWatch: false,
            singleRun: true
          },
          unit_auto: {
            configFile: './test/karma-unit.conf.js'
          },
          midway: {
            configFile: './test/karma-midway.conf.js',
            autoWatch: false,
            singleRun: true
          },
          midway_auto: {
            configFile: './test/karma-midway.conf.js'
          },
          e2e: {
            configFile: './test/karma-e2e.conf.js',
            autoWatch: false,
            singleRun: true
          },
          e2e_auto: {
            configFile: './test/karma-e2e.conf.js'
          }
        },

        watch: {
          assets: {
            files: ['src/**/*.ts'],
            tasks: ['shell:build']
          }
        },

        cssmin:{
            combine:{
                files:{
                    'static/app/css/visat.css':[
                        'src/**/*.css'
                    ]
                }
            }
        },
        uglify:{
            options: {
                banner: '/*! Karaoke Player <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            release: {
                options: {
                    sourceMap: 'build/release/cdg-player.js.map'
                },
                files:{
                    'build/release/visat.min.js':[
                        ''
                    ]
                }
            },
            debug: {
                options: {
                    preserveComments:'all',
                    sourceMap: 'build/debug/cdg-player.min.js.map',
                    sourceMapRoot:'/',
                    sourceMappingURL:'cdg-player.min.js.map'
                },
                files:{
                    'build/debug/cdg-player.min.js':[
                        ''
                    ]
                }
            }
        }
    });

    grunt.registerTask('test', ['connect:testserver','karma:unit','karma:midway', 'karma:e2e']);
    grunt.registerTask('test:unit', ['karma:unit']);
    grunt.registerTask('test:midway', ['connect:testserver','karma:midway']);
    grunt.registerTask('test:e2e', ['connect:testserver', 'karma:e2e']);

    //keeping these around for legacy use
    grunt.registerTask('autotest', ['autotest:unit']);
    grunt.registerTask('autotest:unit', ['connect:testserver','karma:unit_auto']);
    grunt.registerTask('autotest:midway', ['connect:testserver','karma:midway_auto']);
    grunt.registerTask('autotest:e2e', ['connect:testserver','karma:e2e_auto']);

    //installation-related
    grunt.registerTask('install', ['shell:npm_install','shell:bower_install']);

    //defaults
    grunt.registerTask('default', ['debug']);

    //debug
    grunt.registerTask('debug', ['install', 'uglify:debug', 'cssmin:combine']);
    grunt.registerTask('build-debug', ['install', 'uglify:debug','cssmin:combine']);
    grunt.registerTask('run-debug', ['connect:devserver', 'open:devserver', 'watch:assets']); //static server

    //release
    grunt.registerTask('release', ['install', 'uglify:release', 'cssmin']);
    grunt.registerTask('build-release', ['install', 'uglify:release', 'cssmin:combine']);

    //build typescript
    grunt.registerTask('build-ts', ['shell:build']);

    //server daemon
    grunt.registerTask('serve', ['connect:webserver']);
};
