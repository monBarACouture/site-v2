require('babel-register');

const gulp = require('gulp');
const livereload = require('gulp-livereload');
const metalsmith = require('gulp-metalsmith');

const discover_hbs_helpers = require('metalsmith/discover-hbs-helpers');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');

const env = require('gulp/env').content;

const del = require('del');
const path = require('path');

gulp
	.task('content-clean', [], () => del(path.join(env.outputDir, '**/.html')))
	.task('content', ['content-clean'], () => gulp.src(path.join(env.matterDir, '**'))
		.pipe(metalsmith({
			use: [
				discover_hbs_helpers({
					directory: env.helpersDir
				}),
				markdown(),
				layouts({
					directory: env.layoutsDir,
					partials: env.partialsDir,
					engine: 'handlebars',
					default: 'index.hbs'
				})
			]
		}))
		.pipe(gulp.dest(env.outputDir))
		.pipe(livereload())
	)
	.task('content-watch', ['content'], () => gulp.watch(
		[
			path.join(env.matterDir, '**'),
			path.join(env.layoutsDir, '**/*.hbs'),
			path.join(env.partialsDir, '**/*.hbs'),
			path.join(env.helpersDir, '**/*.js')
		],
		['content']
	));

module.exports = {
	build: 'content',
	clean: 'content-clean',
	watch: 'content-watch'
};
