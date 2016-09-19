const gulp = require('gulp');
const livereload = require('gulp-livereload');
const metalsmith = require('gulp-metalsmith');

const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');

const del = require('del');
const path = require('path');

///////////////////////////////////////////////////////////////////////////////
// Config variables

const sources_dir = path.join(__dirname, 'sources');
const content_dir = path.join(sources_dir, 'content');
const layouts_dir = path.join(sources_dir, 'layouts');

const build_dir = process.env.BUILD_OUTPUT_DIR || path.join(__dirname, 'build');

gulp.task('default', ['metalsmith']);
gulp.task('clean', () => del(path.join(build_dir, '**')));
gulp.task('watch', ['watch-content'], () => livereload.listen());
gulp.task('watch-content', () => gulp.watch(
	[
		path.join(content_dir, '**'),
		path.join(layouts_dir, '**')
	],
	['metalsmith']
));
gulp.task('metalsmith', ['clean'], () => gulp.src(path.join(content_dir, '**'))
	.pipe(metalsmith({
		use: [
			markdown(),
			layouts({
				directory: layouts_dir,
				engine: 'handlebars',
				default: 'index.hbs'
			})
		]
	}))
	.pipe(gulp.dest(build_dir))
	.pipe(livereload())
);
