const browserify = require('browserify');
const watchify = require('watchify');

const vinyl_buffer = require('vinyl-buffer');
const vinyl_source_stream = require('vinyl-source-stream');

const gulp = require('gulp');
const gutil = require('gulp-util');
const livereload = require('gulp-livereload');

const del = require('del');
const fs = require('fs');
const path = require('path');

const object_entries = Object.entries || require('object.entries');

module.exports = (sources_dir, dest_dir, paths = []) => {
	const browserify_base_options = {
		debug: true,
		paths
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
			.pipe(gulp.dest(dest_dir))
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
		return path.join(sources_dir, applet, 'main.js');
	}

	function applet_list() {
		return fs.readdirSync(sources_dir)
			.filter(entry => {
				try {
					return fs.statSync(applet_module(entry)).isFile();
				} catch (err) {
					return false;
				}
			});
	}

	const grouped_tasks = applet_list()
		.map(applet => {
			const module = applet_module(applet);
			const bundle = create_applet_bundler(applet);
			const clean = `applet-${applet}-clean`;
			const build = `applet-${applet}`;
			const watch = `applet-${applet}-watch`;

			gulp
				.task(clean, [], () => del(path.join(dest_dir, `${applet}.js`)))
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
		);

	return object_entries(grouped_tasks).reduce(
		(val, [task, deps]) => {
			const task_name = `applets-${task}`;
			gulp.task(task_name, deps);
			return Object.assign(val, {
				[task]: task_name
			});
		},
		{}
	);
};
