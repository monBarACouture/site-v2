require('babel-register');

const gulp = require('gulp');
const metalsmith = require('gulp-metalsmith');
const htmlmin = require('gulp-htmlmin');

const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const permalinks = require('metalsmith-permalinks');
const discover_hbs_helpers = require('tools/metalsmith/discover-hbs-helpers');
const each = require('tools/metalsmith/each');
const partial_content = require('tools/metalsmith/partial-content');
const navigation = require('tools/metalsmith/navigation');

const del = require('del');
const path = require('path');
const uniq = require('lodash/uniq');

const {cat} = require('core/functional');
const {Task} = require('tools/gulp/utils/task');
const env = require('tools/gulp/env');
const content_env = env.content;

module.exports = Task('content')
	.build(() => gulp
		.src(path.join(content_env.matterDir, '**'))
		.pipe(metalsmith({
			metadata: content_env.metadata,
			use: [
				discover_hbs_helpers({
					directory: content_env.helpersDir
				}),
				each({
					iteratee: (file, metadata, next) => {
						metadata.styles =
							uniq([].concat(metadata.styles || []))
								.map(style => env.sass.prefix(style));
						metadata.applets =
							uniq([].concat(metadata.applets || []))
								.map(applet => env.applets.prefix(applet));
						next();
					}
				}),
				markdown(),
				partial_content(),
				permalinks({
					pattern: ':collection/:title'
				}),
				navigation(),
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
	)
	.clean(() => del(path.join(content_env.outputDir, '**/.html')))
	.watch([
		path.join(content_env.matterDir, '**'),
		path.join(content_env.layoutsDir, '**/*.hbs'),
		path.join(content_env.partialsDir, '**/*.hbs'),
		path.join(content_env.helpersDir, '**/*.js')
	])
	.setup()
	.targets;
