const browserify = require('browserify');
const watchify = require('watchify');

const vinyl_buffer = require('vinyl-buffer');
const vinyl_source_stream = require('vinyl-source-stream');

const gulp = require('gulp');
const gulp_if = require('gulp-if');
const gutil = require('gulp-util');
const livereload = require('gulp-livereload');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const del = require('del');
const fs = require('fs');
const path = require('path');

const object_entries = Object.entries || require('object.entries');

const env = require('gulp/env');
const applet_env = env.applets;

const browserify_base_options = {
	debug: true,
	paths: ['node_modules', env.jsSourceBaseDir],
	transform: ['babelify']
};

function create_applet_bundler(applet) {
	return (bundler) => bundler
		.bundle()
		.on('error', err => {
			gutil.log(err.message);
			err.stream.end();
		})
		.pipe(vinyl_source_stream(`${applet}.js`))
		.pipe(vinyl_buffer())
		.pipe(gulp_if(env.isDevelopment, sourcemaps.init({loadMaps: true})))
		.pipe(gulp_if(env.isProduction, uglify()))
		.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest(applet_env.outputDir))
		.pipe(livereload());
}

function create_browserify_bundler(applet_module, options = {}) {
	return browserify(applet_module, options);
}

function create_watchify_bundler(applet_module, bundle, options = {}) {
	const bundler = watchify(create_browserify_bundler(
		applet_module,
		Object.assign({}, options, watchify.args)
	));
	return (bundler
		.on('log', gutil.log)
		.on('update', (ids) => {
			gutil.log('Update:');
			ids.forEach((id) => gutil.log(` - ${id}`))
			bundle(bundler);
		})
	);
}

function applet_module(applet) {
	return path.join(applet_env.sourcesDir, applet, 'main.js');
}

module.exports = object_entries(
	fs
	.readdirSync(applet_env.sourcesDir)
	.filter(entry => {
		try {
			return fs.statSync(applet_module(entry)).isFile();
		} catch (err) {
			return false;
		}
	})
	.map(applet => {
		const module = applet_module(applet);
		const bundle = create_applet_bundler(applet);
		const clean = `applet-${applet}-clean`;
		const build = `applet-${applet}`;
		const watch = `applet-${applet}-watch`;

		gulp
			.task(clean, [], () => del(path.join(applet_env.outputDir, `${applet}.js`)))
			.task(build, [clean], () => bundle(create_browserify_bundler(module, browserify_base_options)))
			.task(watch, [build], () => bundle(create_watchify_bundler(module, bundle, browserify_base_options)));

		return {clean, build, watch};
	})
	.reduce(
		(task_list, applet_tasks) => ({
			clean: task_list.clean.concat(applet_tasks.clean),
			build: task_list.build.concat(applet_tasks.build),
			watch: task_list.watch.concat(applet_tasks.watch)
		}),
		{clean: [], build: [], watch: []}
	)
)
.reduce((val, [task, deps]) => {
	const task_name = task === 'build' ? 'applets' : `applets-${task}`;
	gulp.task(task_name, deps);
	return Object.assign(val, {
		[task]: task_name
	});
}, {});
