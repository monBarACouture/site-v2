const gulp = require('gulp');
const gulp_if = require('gulp-if');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const del = require('del');
const path = require('path');

const {Task, MacroTask} = require('tools/gulp/utils/task');

const env = require('tools/gulp/env');

const vendors_output_dir = path.join(env.assetsOutputBaseDir, 'js', 'vendors');

// JQuery
const jquery_sources = path.resolve(path.join('node_modules', 'jquery', 'dist', 'jquery.js'));
const jquery_task = Task('jquery')
	.build(() => gulp.src(jquery_sources)
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(gulp_if(env.isDevelopment, uglify()))
		.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest(vendors_output_dir))
	)
	.clean(() => del(path.join(vendors_output_dir, 'jquery.js')))
	.watch(jquery_sources)
	.setup()
	.targets;

// Foundation
const foundation_source_dir = path.resolve(path.join('node_modules', 'foundation-sites', 'dist', 'plugins'));
const foundation_source_files = [
	'foundation.core.js',
	'foundation.util.mediaQuery.js',
	'foundation.util.triggers.js',
	'foundation.responsiveToggle.js',
	'foundation.responsiveMenu.js',
	'foundation.sticky.js'
].map((component) => path.join(foundation_source_dir, component));
const foundation_task = Task('foundation')
	.build(() => gulp.src(foundation_source_files)
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(concat('foundation.js'))
		.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
		.pipe(gulp_if(env.isProduction, uglify()))
		.pipe(gulp.dest(vendors_output_dir))
	)
	.clean(() => del(path.join(vendors_output_dir, 'foundation.js')))
	.watch(foundation_source_files)
	.setup()
	.targets;

gulp
	.task('vendors-clean', () => del(path.join(vendors_output_dir, '*/**.js')))
	.task('vendors', ['jquery', 'foundation']);

module.exports =
	MacroTask('vendors', jquery_task, foundation_task)
		.setup()
		.targets;
