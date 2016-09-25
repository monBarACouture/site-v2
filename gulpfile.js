const gulp = require('gulp');
const env = require('gulp/env');
const livereload = require('gulp-livereload');

///////////////////////////////////////////////////////////////////////////////
// Task definition

// Serve build content
require('./tools/gulp/tasks/serve');

// Setup Javascript appletys task
const applets = require('./tools/gulp/tasks/applets');

// Setup metalsmith tasks
const content = require('./tools/gulp/tasks/content');

// Setup Sass tasks
const sass = require('./tools/gulp/tasks/sass');

gulp
	.task('build', [applets.build, content.build, sass.build])
	.task('clean', [applets.clean, content.clean, sass.clean])
	.task('watch', [applets.watch, content.watch, sass.watch], () => livereload.listen())
	.task('default', env.isProduction ? ['build'] : ['watch', 'serve']);
