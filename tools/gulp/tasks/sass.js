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
	.task('sass-clean', () => del(path.join(sass_env.outputDir, '*/**')))
	.task('sass-copy-font', () => {
		return gulp.src('./node_modules/font-awesome/fonts/*')
			.pipe(gulp.dest(path.join(sass_env.outputDir, 'fonts')));
	})
	.task('sass', ['sass-clean', 'sass-copy-font'], () => {
		return gulp.src(path.join(sass_env.sourcesDir, '**/*.scss'))
			.pipe(gulp_if(env.isDevelopment, sourcemaps.init()))
			.pipe(sass({
				includePaths: [sass_env.sourcesDir, './node_modules/font-awesome/scss'],
				outputStyle: 'compressed'
			}).on('error', sass.logError))
			.pipe(autoprefixer())
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
