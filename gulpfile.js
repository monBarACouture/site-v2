const gulp = require('gulp');
const livereload = require('gulp-livereload');
const webserver = require('gulp-webserver');

const fs = require('fs');
const path = require('path');
const url = require('url');

///////////////////////////////////////////////////////////////////////////////
// Config variables
const sources_dir = 'sources';

const content_sources_dir = path.join(sources_dir, 'content');
const content_layouts_sources_dir = path.join(sources_dir, 'layouts');
const content_partials_sources_dir = path.join(content_layouts_sources_dir, 'partials');

const js_sources_dir = path.join(sources_dir, 'js');
const js_applets_sources_dir = path.join(js_sources_dir, 'applets');

const sass_sources_dir = path.join(sources_dir, 'sass');

const build_dir = process.env.BUILD_OUTPUT_DIR || path.join(__dirname, 'build');
const assets_dir = path.join(build_dir, 'assets');

const content_dest_dir = build_dir;
const js_dest_dir = path.join(assets_dir, 'js');
const js_applets_dest_dir = path.join(js_dest_dir, 'applets');
const sass_dest_dir = path.join(assets_dir, 'css');

///////////////////////////////////////////////////////////////////////////////
// Task definition

// Setup metalsmith tasks
const content = require('./tools/gulp/tasks/content')(
	content_sources_dir,
	content_layouts_sources_dir,
	content_partials_sources_dir,
	content_dest_dir
);

// Setup Sass tasks
const sass = require('./tools/gulp/tasks/sass')(
	sass_sources_dir,
	sass_dest_dir
);

// Setup Javascript appletys task
const applets = require('./tools/gulp/tasks/applets')(
	js_applets_sources_dir,
	js_applets_dest_dir,
	['node_modules', js_sources_dir]
);

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

gulp
	.task('build', [applets.build, content.build, sass.build])
	.task('clean', [applets.clean, content.clean, sass.clean])
	.task('watch', [applets.watch, content.watch, sass.watch], () => livereload.listen())
	.task('default', ['build']);

// Macro task
