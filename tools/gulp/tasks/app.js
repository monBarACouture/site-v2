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
const path = require('path');

const env = require('gulp/env');

const app_source_file = path.join(path.join(env.jsSourceBaseDir, 'app.js'));
const app_output_dir = path.join(env.assetsOutputBaseDir, 'js');

const browserify_base_options = {
	debug: true,
	paths: ['node_modules', env.jsSourceBaseDir],
	transform: ['babelify']
};

function create_applet_bundler() {
	return (bundler) => bundler
		.bundle()
		.on('error', err => {
			gutil.log(err.message);
			err.stream.end();
		})
		.pipe(vinyl_source_stream('app.js'))
		.pipe(vinyl_buffer())
		.pipe(gulp_if(env.isDevelopment, sourcemaps.init({loadMaps: true})))
		.pipe(gulp_if(env.isProduction, uglify()))
		.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest(app_output_dir))
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

gulp
	.task('app-clean', () => del(path.join(app_output_dir, 'app.js')))
	.task('app', ['app-clean'], () => {
		const bundle = create_applet_bundler();
		return bundle(create_browserify_bundler(app_source_file, browserify_base_options));
	})
	.task('app-watch', ['app'], () => {
		const bundle = create_applet_bundler();
		return bundle(create_watchify_bundler(app_source_file, bundle, browserify_base_options));
	});

module.exports = {
	build: 'app',
	clean: 'app-clean',
	watch: 'app-watch'
};
