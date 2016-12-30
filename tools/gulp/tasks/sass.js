const gulp = require('gulp');
const gulp_if = require('gulp-if');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

const del = require('del');
const path = require('path');
const sass = require('gulp-sass');

const env = require('tools/gulp/env');
const {Task, MacroTask} = require('tools/gulp/utils/task');

const sass_env = env.sass;

const fonts_sources = path.join('node_modules', 'font-awesome', 'fonts', '*');
const fonts_task = Task('fonts')
	.build(() => {
		return gulp
			.src(fonts_sources)
			.pipe(gulp.dest(sass_env.fontOutputDir));
	})
	.clean(() => del(path.join(sass_env.fontOutputDir, '**')))
	.watch(fonts_sources)
	.setup()
	.targets;

const sass_sources = path.join(sass_env.sourcesDir, '**/*.scss');
const sass_task = Task('sass')
	.build(() => {
		return gulp.src(sass_sources)
			.pipe(gulp_if(env.isDevelopment, sourcemaps.init()))
			.pipe(sass({
				includePaths: [
					sass_env.sourcesDir,
					path.resolve('node_modules')
				],
				outputStyle: 'compressed'
			}).on('error', sass.logError))
			.pipe(autoprefixer())
			.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
			.pipe(gulp.dest(sass_env.cssOutputDir));
	})
	.clean(() => {
		return del(path.join(sass_env.cssOutputDir, '*/**'));
	})
	.watch(sass_sources)
	.setup()
	.targets;

module.exports = MacroTask('style', fonts_task, sass_task).setup().targets;
