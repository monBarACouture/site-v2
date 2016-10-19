const gulp = require('gulp');
const gulp_if = require('gulp-if');
const autoprefixer = require('gulp-autoprefixer');
const livereload = require('gulp-livereload');
const sourcemaps = require('gulp-sourcemaps');

const del = require('del');
const path = require('path');
const sass = require('gulp-sass');

const env = require('gulp/env');
const sass_env = env.sass;

gulp
	.task('sass-font-clean', () => del(path.join(sass_env.fontOutputDir, '**')))
	.task('sass-font-copy', () => {
		return gulp.src('./node_modules/font-awesome/fonts/*')
			.pipe(gulp.dest(sass_env.fontOutputDir));
	})
	.task('sass-clean', ['sass-font-clean'], () => del(path.join(sass_env.cssOutputDir, '*/**')))
	.task('sass', ['sass-clean', 'sass-font-copy'], () => {
		return gulp.src(path.join(sass_env.sourcesDir, '**/*.scss'))
			.pipe(gulp_if(env.isDevelopment, sourcemaps.init()))
			.pipe(sass({
				includePaths: [
					sass_env.sourcesDir,
					path.resolve('node_modules')
				],
				outputStyle: 'compressed'
			}).on('error', sass.logError))
			.pipe(autoprefixer())
			.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
			.pipe(gulp.dest(sass_env.cssOutputDir))
			.pipe(livereload())
	})
	.task('sass-watch', ['sass'], () => gulp.watch(path.join(sass_env.sourcesDir, '**/*.scss'), ['sass']));

module.exports = {
	build: 'sass',
	clean: 'sass-clean',
	watch: 'sass-watch'
};
