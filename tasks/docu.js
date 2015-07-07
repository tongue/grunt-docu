/*
 * grunt-docu
 * https://github.com/tongue/grunt-docu
 *
 * Copyright (c) 2015 Johan Bergström
 * Licensed under the MIT license.
 */

'use strict';
var uglify = require('uglify-js');

module.exports = function (grunt) {
	grunt.registerMultiTask('docu', 'Super simple flat documentation generator', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			head: __dirname + '/src/head.html',
			foot: __dirname + '/src/foot.html'
		});

		var src = grunt.file.read(options.head);
		// Iterate over all specified file groups.
		this.files.forEach(function (f) {
			// Remove head and foot files from the files list
			var files = f.src.filter(function (filepath) {
				return (options.head !== filepath && options.foot !== filepath);
			});

			files.forEach(function (filepath) {
				src += '\n' + grunt.file.read(filepath) + '\n';
			});

			// Insert navigation js src
			src += insertTableOfContentsJavascript();

			// If we have a footer file, write it in
			src += grunt.file.read(options.foot);

			// Write the destination file.
			grunt.file.write(f.dest, src);

			// Print a success message.
			grunt.log.writeln('File "' + f.dest + '" created.');
		});
	});

	function insertTableOfContentsJavascript() {
		var src = '\n<script type="text/javascript">';
		src += uglify.minify(__dirname + '/src/TableOfContents.js').code;
		src += '</script>\n';
		return src;
	}
};

