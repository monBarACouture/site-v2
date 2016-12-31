const gulp = require('gulp');
const livereload = require('gulp-livereload');

const env = require('tools/gulp/env');
const {MacroTask} = require('tools/gulp/utils/Task');

///////////////////////////////////////////////////////////////////////////////
// Task definition

// Serve build content
require('tools/gulp/tasks/serve');

Object.entries(
	MacroTask('mbac')
		.push(require('tools/gulp/tasks/content'))
		.push(require('tools/gulp/tasks/scripts'))
		.push(require('tools/gulp/tasks/styles'))
		.watch(() => livereload.listen())
		.setup()
		.targets
).forEach(([target, task]) => {
	gulp.task(target, [task]);
});

gulp.task('default', env.isProduction ? ['build'] : ['watch', 'serve']);
