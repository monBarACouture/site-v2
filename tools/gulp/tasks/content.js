require('babel-register');

const gulp = require('gulp');
const livereload = require('gulp-livereload');
const metalsmith = require('gulp-metalsmith');
const htmlmin = require('gulp-htmlmin');

const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const discover_hbs_helpers = require('metalsmith/discover-hbs-helpers');
const each = require('metalsmith/each');

const del = require('del');
const path = require('path');
const uniq = require('lodash/uniq');
const {cat} = require('core/functional');

const env = require('gulp/env');
const content_env = env.content;

gulp
	.task('content-clean', [], () => del(path.join(content_env.outputDir, '**/.html')))
	.task('content', ['content-clean'], () => gulp.src(path.join(content_env.matterDir, '**'))
		.pipe(metalsmith({
			metadata: content_env.metadata,
			use: [
				discover_hbs_helpers({
					directory: content_env.helpersDir
				}),
				each({
					iteratee: (file, metadata, next) => {
						metadata.styles =
							uniq(cat(['style'], metadata.styles || []))
								.map(style => env.sass.prefix(style));
						next();
					}
				}),
				markdown(),
				layouts({
					directory: content_env.layoutsDir,
					partials: content_env.partialsDir,
					engine: 'handlebars',
					default: 'index.hbs'
				})
			]
		}))
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(content_env.outputDir))
		.pipe(livereload())
	)
	.task('content-watch', ['content'], () => gulp.watch(
		[
			path.join(content_env.matterDir, '**'),
			path.join(content_env.layoutsDir, '**/*.hbs'),
			path.join(content_env.partialsDir, '**/*.hbs'),
			path.join(content_env.helpersDir, '**/*.js')
		],
		['content']
	));

module.exports = {
	build: 'content',
	clean: 'content-clean',
	watch: 'content-watch'
};
