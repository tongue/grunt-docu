/*
 * grunt-docu
 * https://github.com/tongue/grunt-docu
 *
 * Copyright (c) 2015 Johan Bergström
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['tmp']
		},

		// Configuration to be run (and then tested).
		docu: {
			temp: {
				options: {},
				files: {
					'tmp/docu.html': ['test/src/**/*.html']
				}
			},
			tre: {
				options: {
					head: 'test/tre/head.html'
				},
				files: {
					'tmp/docu.html': ['test/tre/**/*.html']
				}
			}
		},

		watch: {
			src: {
				files: 'src/**/*',
				tasks: ['docu']
			}
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'docu']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint']);

};
