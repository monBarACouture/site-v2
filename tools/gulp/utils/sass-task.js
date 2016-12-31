const gulp = require('gulp');
const gulp_if = require('gulp-if');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const vinyl_buffer = require('vinyl-buffer');
const vinyl_source_stream = require('vinyl-source-stream');

const del = require('del');
const fs = require('fs');
const path = require('path');

const env = require('tools/gulp/env');
const {Task} = require('tools/gulp/utils/task');

exports.SassTask = function({
	name,
	source,
	outputDirectory,
	outputFilename,
	includeDirectories
}) {
	includeDirectories = [].concat(includeDirectories);

	const style = outputFilename || `${name}.css`;
	const watch_sources = [].concat(
		source,
		includeDirectories.map(dir => path.join(dir, '**', '*.scss'))
	);

	return Task(name)
		.clean(() => del(path.join(outputDirectory, style)))
		.build(() => fs.createReadStream(source)
			.pipe(vinyl_source_stream(style))
			.pipe(vinyl_buffer())
			.pipe(gulp_if(env.isDevelopment, sourcemaps.init()))
			.pipe(sass({
				includePaths: [].concat(includeDirectories, path.resolve('node_modules')),
				outputStyle: 'compressed'
			}).on('error', sass.logError))
			.pipe(autoprefixer())
			.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
			.pipe(gulp.dest(outputDirectory))
		)
		.watch(watch_sources);
};
