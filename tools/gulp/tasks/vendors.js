const gulp = require('gulp');
const gulp_if = require('gulp-if');
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
		.pipe(uglify())
		.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest(vendors_output_dir));
});

// Foundation
gulp.task('foundation', () => {
	const foundation_source = path.resolve(path.join(
		'node_modules',
		'foundation-sites',
		'dist',
		'foundation.js'
	));
	return gulp.src(foundation_source)
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(uglify())
		.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest(vendors_output_dir));
});

gulp
	.task('vendors-clean', () => del(path.join(vendors_output_dir, '*/**.js')))
	.task('vendors', ['jquery', 'foundation']);

module.exports = {
	build: 'vendors',
	clean: 'vendors-clean'
};
