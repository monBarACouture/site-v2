const gulp = require('gulp');
const gulp_if = require('gulp-if');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const del = require('del');
const path = require('path');

const env = require('gulp/env');

const vendors_output_dir = path.join(env.assetsOutputBaseDir, 'js', 'vendors');

// JQuery
gulp.task('jquery', () => {
	const jquery_source = path.resolve(path.join(
		'node_modules',
		'jquery',
		'dist',
		'jquery.js'
	));
	return gulp.src(jquery_source)
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(gulp_if(env.isDevelopment, uglify()))
		.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest(vendors_output_dir));
});

// Foundation
gulp.task('foundation', () => {
	const foundation_source_dir = path.resolve(path.join(
		'node_modules',
		'foundation-sites',
		'dist',
		'plugins'
	));
	const foundation_source_files = [
		'foundation.core.js',
		'foundation.util.triggers.js',
		'foundation.util.mediaQuery.js',
		'foundation.responsiveMenu.js',
		'foundation.responsiveToggle.js',
		'foundation.sticky.js'
	].map((component) => path.join(foundation_source_dir, component));

	return gulp.src(foundation_source_files)
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(concat('foundation.js'))
		.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
		.pipe(gulp_if(env.isProduction, uglify()))
		.pipe(gulp.dest(vendors_output_dir));
});

gulp
	.task('vendors-clean', () => del(path.join(vendors_output_dir, '*/**.js')))
	.task('vendors', ['jquery', 'foundation']);

module.exports = {
	build: 'vendors',
	clean: 'vendors-clean'
};
