const browserify = require('browserify');
const watchify = require('watchify');

const vinyl_buffer = require('vinyl-buffer');
const vinyl_source_stream = require('vinyl-source-stream');

const gulp = require('gulp');
const gulp_if = require('gulp-if');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const del = require('del');
const path = require('path');

const env = require('tools/gulp/env');
const {Task} = require('tools/gulp/utils/task');

const browserify_base_options = {
	debug: true,
	paths: ['node_modules', env.jsSourceBaseDir],
	transform: ['babelify']
};

function create_browserify_bundler(entry_point, options = {}) {
	return browserify(entry_point, options);
}

function create_watchify_bundler(entry_point, bundle, options = {}) {
	const bundler = watchify(create_browserify_bundler(
		entry_point,
		Object.assign({}, options, watchify.args)
	));
	return (bundler
		.on('log', gutil.log)
		.on('update', ids => {
			gutil.log('Update:');
			ids.forEach(id => gutil.log(` - ${id}`))
			bundle(bundler);
		})
	);
}

module.exports = function(name, entryPoint, outputDirectory) {
	const bundle = `${name}.js`;
	const create_pipeline = () => {
		return bundler => bundler
			.bundle()
			.on('error', err => {
				gutil.log(err.message);
				err.stream.end();
			})
			.pipe(vinyl_source_stream(bundle))
			.pipe(vinyl_buffer())
			.pipe(gulp_if(env.isDevelopment, sourcemaps.init({loadMaps: true})))
			.pipe(gulp_if(env.isProduction, uglify()))
			.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
			.pipe(gulp.dest(outputDirectory))
	}
	return Task(name)
		.clean(() => {
			return del(path.join(outputDirectory, `${name}.js`));
		})
		.build(() => {
			const pipeline = create_pipeline();
			return pipeline(create_browserify_bundler(entryPoint, browserify_base_options));
		})
		.watch(() => {
			const pipeline = create_pipeline();
			return pipeline(create_watchify_bundler(entryPoint, pipeline, browserify_base_options));
		});
};
