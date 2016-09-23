const gulp = require('gulp');
const webserver = require('gulp-webserver');

const fs = require('fs');
const path = require('path');
const url = require('url');

module.exports = (base_dir) => {
	gulp.task('serve', () => gulp.src(base_dir)
		.pipe(webserver({
			fallback: path.join(base_dir, 'index.html'),
			middleware(req, res, next) {
				const pathname = path.join(base_dir, url.parse(req.url).pathname);
				fs.access(pathname, fs.constants.F_OK, (err) => {
					if (err) {
						res.statusCode = 404;
						res.statusMessage = 'Not found';
						fs.createReadStream(path.join(base_dir, '404.html')).pipe(res);
					} else {
						next();
					}
				});
			}
		}))
	);
	return 'serve';
};
