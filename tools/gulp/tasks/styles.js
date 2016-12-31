const gulp = require('gulp');

const del = require('del');
const path = require('path');

const env = require('tools/gulp/env');
const {Task, MacroTask} = require('tools/gulp/utils/task');
const SassTask = require('tools/gulp/utils/sass-task');

const sass_env = env.sass;

const fonts_sources = path.join('node_modules', 'font-awesome', 'fonts', '*');
const fonts_task = Task('style-fonts')
	.build(() => {
		return gulp
			.src(fonts_sources)
			.pipe(gulp.dest(sass_env.fontOutputDir));
	})
	.clean(() => del(path.join(sass_env.fontOutputDir, '**')))
	.watch(fonts_sources)
	.setup()
	.targets;

const core_style = SassTask({
	name: 'style-mbac',
	source: path.join(sass_env.sourcesDir, 'core', 'style.scss'),
	outputDirectory: sass_env.cssOutputDir,
	outputFilename: 'mbac.css',
	includeDirectories: [sass_env.sourcesDir]
}).setup().targets;

const home_style = SassTask({
	name: 'style-home-page',
	source: path.join(sass_env.sourcesDir, 'pages', 'home', 'style.scss'),
	outputDirectory: sass_env.cssOutputDir,
	outputFilename: 'home.css',
	includeDirectories: [sass_env.sourcesDir]
}).setup().targets;

const prices_style = SassTask({
	name: 'style-prices-page',
	source: path.join(sass_env.sourcesDir, 'pages', 'prices', 'style.scss'),
	outputDirectory: sass_env.cssOutputDir,
	outputFilename: 'prices.css',
	includeDirectories: [sass_env.sourcesDir]
}).setup().targets;

const services_style = SassTask({
	name: 'style-services-page',
	source: path.join(sass_env.sourcesDir, 'pages', 'services', 'style.scss'),
	outputDirectory: sass_env.cssOutputDir,
	outputFilename: 'services.css',
	includeDirectories: [sass_env.sourcesDir]
}).setup().targets;

module.exports = MacroTask(
	'style',
	core_style,
	home_style,
	prices_style,
	services_style,
	fonts_task
).setup().targets;
