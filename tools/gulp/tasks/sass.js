const gulp = require('gulp');

const del = require('del');
const path = require('path');

const env = require('tools/gulp/env');
const {Task, MacroTask} = require('tools/gulp/utils/task');
const {SassTask} = require('tools/gulp/utils/sass-task');

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

const core_style = SassTask({
	name: 'core-style',
	source: path.join(sass_env.sourcesDir, 'core', 'style.scss'),
	outputDirectory: sass_env.cssOutputDir,
	outputFilename: 'mbac.scss',
	includeDirectories: [sass_env.sourcesDir]
}).setup().targets;

const home_style = SassTask({
	name: 'home-page-style',
	source: path.join(sass_env.sourcesDir, 'pages', 'home', 'style.scss'),
	outputDirectory: sass_env.cssOutputDir,
	outputFilename: 'home.scss',
	includeDirectories: [sass_env.sourcesDir]
}).setup().targets;

const prices_style = SassTask({
	name: 'prices-page-style',
	source: path.join(sass_env.sourcesDir, 'pages', 'prices', 'style.scss'),
	outputDirectory: sass_env.cssOutputDir,
	outputFilename: 'prices.scss',
	includeDirectories: [sass_env.sourcesDir]
}).setup().targets;

const services_style = SassTask({
	name: 'services-page-style',
	source: path.join(sass_env.sourcesDir, 'pages', 'services', 'style.scss'),
	outputDirectory: sass_env.cssOutputDir,
	outputFilename: 'services.scss',
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
