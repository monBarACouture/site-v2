const gulp = require('gulp');

const del = require('del');
const path = require('path');

const env = require('tools/gulp/env');
const {Task, MacroTask} = require('tools/gulp/utils/task');
const SassTask = require('tools/gulp/utils/sass-task');

// const sass_env = env.sass;

const sources_dir = path.join('sources', 'sass');
const fonts_sources = path.join('node_modules', 'font-awesome', 'fonts', '*');

const style_output_dir = path.join(env.assetsOutputBaseDir, 'css');
const fonts_output_dir = path.join(env.assetsOutputBaseDir, 'fonts');

const fonts_task = Task('style-fonts')
	.build(() => {
		return gulp
			.src(fonts_sources)
			.pipe(gulp.dest(fonts_output_dir));
	})
	.clean(() => del(path.join(fonts_output_dir, '**')))
	.watch(fonts_sources)
	.setup()
	.targets;

const core_style = SassTask({
	name: 'style-mbac',
	source: path.join(sources_dir, 'core', 'style.scss'),
	outputDirectory: style_output_dir,
	outputFilename: 'mbac.css',
	includeDirectories: [sources_dir]
}).setup().targets;

const home_style = SassTask({
	name: 'style-home-page',
	source: path.join(sources_dir, 'pages', 'home', 'style.scss'),
	outputDirectory: style_output_dir,
	outputFilename: 'home.css',
	includeDirectories: [sources_dir]
}).setup().targets;

const prices_style = SassTask({
	name: 'style-prices-page',
	source: path.join(sources_dir, 'pages', 'prices', 'style.scss'),
	outputDirectory: style_output_dir,
	outputFilename: 'prices.css',
	includeDirectories: [sources_dir]
}).setup().targets;

const services_style = SassTask({
	name: 'style-services-page',
	source: path.join(sources_dir, 'pages', 'services', 'style.scss'),
	outputDirectory: style_output_dir,
	outputFilename: 'services.css',
	includeDirectories: [sources_dir]
}).setup().targets;

module.exports = MacroTask(
	'style',
	core_style,
	home_style,
	prices_style,
	services_style,
	fonts_task
).setup().targets;
