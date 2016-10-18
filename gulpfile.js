const gulp = require('gulp');
const env = require('gulp/env');
const livereload = require('gulp-livereload');

///////////////////////////////////////////////////////////////////////////////
// Task definition

// Serve build content
require('./tools/gulp/tasks/serve');

// Setup App tasks
const app = require('./tools/gulp/tasks/app');

// Setup Javascript appletys task
const applets = require('./tools/gulp/tasks/applets');

// Setup Vendors dependencies
const vendors = require('./tools/gulp/tasks/vendors');

// Setup metalsmith tasks
const content = require('./tools/gulp/tasks/content');

// Setup Sass tasks
const sass = require('./tools/gulp/tasks/sass');

gulp
	.task('build', [app.build, applets.build, content.build, sass.build, vendors.build])
	.task('clean', [app.clean, applets.clean, content.clean, sass.clean, vendors.clean])
	.task('watch', [app.watch, applets.watch, content.watch, sass.watch, vendors.build], () => livereload.listen())
	.task('default', env.isProduction ? ['build'] : ['watch', 'serve']);
