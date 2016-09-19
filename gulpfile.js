const gulp = require('gulp');
const livereload = require('gulp-livereload');
const metalsmith = require('gulp-metalsmith');
const sass = require('gulp-sass');
const webserver = require('gulp-webserver');

const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');

const del = require('del');
const fs = require('fs');
const path = require('path');
const url = require('url');

///////////////////////////////////////////////////////////////////////////////
// Config variables
const sources_dir = path.join(__dirname, 'sources');
const content_sources_dir = path.join(sources_dir, 'content');
const layouts_sources_dir = path.join(sources_dir, 'layouts');
const sass_sources_dir = path.join(sources_dir, 'sass');

const build_dir = process.env.BUILD_OUTPUT_DIR || path.join(__dirname, 'build');
const assets_dir = path.join(build_dir, 'assets');
const style_dir = path.join(assets_dir, 'css');

///////////////////////////////////////////////////////////////////////////////
// Task definition

// Metalsmith task
gulp.task('content', [], () => gulp.src(path.join(content_sources_dir, '**'))
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
gulp.task('content-clean', () => del(
	[
		path.join(build_dir, 'index.html')
	]
));
gulp.task('content-watch', ['content'], () => gulp.watch(
	[
		path.join(content_sources_dir, '**'),
		path.join(layouts_sources_dir, '**')
	],
	['content']
));

// Sass task
gulp.task('sass', [], () => gulp.src(path.join(sass_sources_dir, '**'))
	.pipe(sass({
		includePaths: [sass_sources_dir],
		outputStyle: 'compressed'
	}).on('error', sass.logError))
	.pipe(gulp.dest(style_dir))
	.pipe(livereload())
);
gulp.task('sass-clean', () => del(
	[
		path.join(style_dir, '**')
	]
));
gulp.task('sass-watch', ['sass'], () => gulp.watch(
	[
		path.join(sass_sources_dir, '**')
	],
	['sass']
));

// Dev task
gulp.task('dev', ['watch'], () => gulp.src(build_dir)
	.pipe(webserver({
		fallback: path.join(build_dir, 'index.html'),
		middleware(req, res, next) {
			const pathname = path.join(build_dir, url.parse(req.url).pathname);
			fs.access(pathname, fs.constants.F_OK, (err) => {
				if (err) {
					res.statusCode = 404;
					res.statusMessage = 'Not found';
					fs.createReadStream(path.join(build_dir, '404.html')).pipe(res);
				} else {
					next();
				}
			});
		}
	}))
);

// Macro task
gulp.task('default', ['content', 'sass']);
gulp.task('clean', ['content-clean', 'sass-sclean']);
gulp.task('watch', ['content-watch', 'sass-watch'], () => livereload.listen());
