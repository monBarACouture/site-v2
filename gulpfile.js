const gulp = require('gulp');
const livereload = require('gulp-livereload');

const env = require('tools/gulp/env');
const {MacroTask} = require('tools/gulp/utils/Task');

///////////////////////////////////////////////////////////////////////////////
// Task definition

// Serve build content
require('tools/gulp/tasks/serve');

// Setup App tasks
const mbac = require('tools/gulp/tasks/mbac');

// Setup Javascript appletys task
const applets = require('tools/gulp/tasks/applets');

// Setup Vendors dependencies
const vendors = require('tools/gulp/tasks/vendors');

// Setup metalsmith tasks
const content = require('tools/gulp/tasks/content');

// Setup Sass tasks
const sass = require('tools/gulp/tasks/sass');

Object.entries(
	MacroTask('mbac')
		.push(mbac)
		.push(applets)
		.push(vendors)
		.push(content)
		.push(sass)
		.watch(() => livereload.listen())
		.setup()
		.targets
).forEach(([target, task]) => {
	gulp.task(target, [task]);
});

gulp.task('default', env.isProduction ? ['build'] : ['watch', 'serve']);
