const gulp = require('gulp');
const gulp_if = require('gulp-if');
const livereload = require('gulp-livereload');
const sourcemaps = require('gulp-sourcemaps');

const del = require('del');
const path = require('path');
const sass = require('gulp-sass');

const env = require('gulp/env');
const sass_env = env.sass;

gulp
	.task('sass-clean', () => del(path.join(sass_env.outputDir)))
	.task('sass', ['sass-clean'], () => {
		return gulp.src(path.join(sass_env.sourcesDir, '**/*.scss'))
			.pipe(gulp_if(env.isDevelopment, sourcemaps.init()))
			.pipe(sass({
				includePaths: [sass_env.sourcesDir],
				outputStyle: 'compressed'
			}).on('error', sass.logError))
			.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
			.pipe(gulp.dest(sass_env.outputDir))
			.pipe(livereload())
	})
	.task('sass-watch', ['sass'], () => gulp.watch(path.join(sass_env.sourcesDir, '**/*.scss'), ['sass']));

module.exports = {
	build: 'sass',
	clean: 'sass-clean',
	watch: 'sass-watch'
};
