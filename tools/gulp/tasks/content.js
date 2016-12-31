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

const {Task} = require('tools/gulp/utils/task');
const env = require('tools/gulp/env');

const sources_base_dir = path.join('sources', 'content');
const matter_dir = path.join(sources_base_dir, 'matter');
const helpers_dir = path.join(sources_base_dir, 'helpers');
const layouts_dir = path.join(sources_base_dir, 'layouts');
const partials_dir = path.join(layouts_dir, 'partials');

const styleURI = style => `/assets/css/${style}.css`;
const appletURI = applet => `/assets/js/${applet}.js`;

module.exports = Task('content')
	.build(() => gulp
		.src(path.join(matter_dir, '**'))
		.pipe(metalsmith({
			metadata: env.metadata,
			use: [
				discover_hbs_helpers({
					directory: helpers_dir
				}),
				each({
					iteratee: (file, metadata, next) => {
						try {
							metadata.styles =
								uniq([].concat(metadata.styles || [])).map(styleURI);
							metadata.applets =
								uniq([].concat(metadata.applets || [])).map(appletURI);
							next();
						} catch (err) {
							next(err);
						}
					}
				}),
				markdown(),
				partial_content(),
				permalinks({
					pattern: ':collection/:title'
				}),
				navigation(),
				layouts({
					directory: layouts_dir,
					partials: partials_dir,
					engine: 'handlebars',
					default: 'index.hbs'
				})
			]
		}))
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(env.outputBaseDir))
	)
	.clean(() => del(path.join(env.outputBaseDir, '**/*.html')))
	.watch([
		path.join(matter_dir, '**'),
		path.join(layouts_dir, '**/*.hbs'),
		path.join(partials_dir, '**/*.hbs'),
		path.join(helpers_dir, '**/*.js')
	])
	.setup()
	.targets;
