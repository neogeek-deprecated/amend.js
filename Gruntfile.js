module.exports = function (grunt) {

    'use strict';

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {

            client: {
                src: ['amend.js', 'tests/**/*.js'],
                directives: {
                    browser: true,
                    globals: {
                        'define': true,
                        'module': true,
                        'require': true
                    },
                    nomen: true
                }
            }

        },

        uglify: {

            my_target: {
                options: {
                    mangle: true,
                    report: 'gzip',
                    banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("isoDateTime") %>\n * https://github.com/neogeek/amend.js\n * \n * Copyright (c) <%= grunt.template.today("yyyy") %> Scott Doxey\n * Released under the MIT license.\n */\n'
                },
                files: {
                    'amend.min.js': ['amend.js']
                }
            }

        },

        doxdox: {

            dev: {

                input: 'amend.js',
                output: 'docs/index.html'

            }

        },

        shell: {

            gzip: {

                command: 'gzip -9 < amend.min.js > amend.min.js.gzip'

            }

        },

        watch: {

            default: {
                files: ['amend.js', 'tests/**/*.js'],
                tasks: ['jshint', 'uglify', 'shell:docs', 'shell:gzip']
            }

        }

    });

    grunt.registerTask('default', [ 'jshint', 'uglify', 'doxdox', 'shell' ]);

};
