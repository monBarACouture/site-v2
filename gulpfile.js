const gulp = require('gulp');
const livereload = require('gulp-livereload');
const metalsmith = require('gulp-metalsmith');
const sass = require('gulp-sass');

const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');

const del = require('del');
const path = require('path');

///////////////////////////////////////////////////////////////////////////////
// Config variables

const sources_dir = path.join(__dirname, 'sources');
const content_sources_dir = path.join(sources_dir, 'content');
const layouts_sources_dir = path.join(sources_dir, 'layouts');
const sass_sources_dir = path.join(sources_dir, 'sass');

const build_dir = process.env.BUILD_OUTPUT_DIR || path.join(__dirname, 'build');
const assets_dir = path.join(build_dir, 'assets');
const style_dir = path.join(assets_dir, 'css');

gulp.task('default', ['metalsmith', 'sass']);
gulp.task('clean', () => del(path.join(build_dir, '**')));
gulp.task('watch', ['watch-content', 'watch-sass'], () => livereload.listen());

gulp.task('metalsmith', [], () => gulp.src(path.join(content_sources_dir, '**'))
	.pipe(metalsmith({
		use: [
			markdown(),
			layouts({
				directory: layouts_sources_dir,
				engine: 'handlebars',
				default: 'index.hbs'
			})
		]
	}))
	.pipe(gulp.dest(build_dir))
	.pipe(livereload())
);
gulp.task('watch-content', () => gulp.watch(
	[
		path.join(content_sources_dir, '**'),
		path.join(layouts_sources_dir, '**')
	],
	['metalsmith']
));

gulp.task('sass', [], () => gulp.src(path.join(sass_sources_dir, '**'))
	.pipe(sass({
		includePaths: [sass_sources_dir],
		outputStyle: 'compressed'
	}).on('error', sass.logError))
	.pipe(gulp.dest(style_dir))
	.pipe(livereload())
);
gulp.task('watch-sass', () => gulp.watch(
	[
		path.join(sass_sources_dir, '**')
	],
	['sass']
));
