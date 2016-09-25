const gulp = require('gulp');
const webserver = require('gulp-webserver');

const fs = require('fs');
const path = require('path');
const url = require('url');

const env = require('gulp/env');

function stat_async(pathname) {
	return new Promise((resolve, reject) => {
		fs.stat(pathname, (err, stats) => {
			if (err) {
				reject(err);
			} else {
				resolve(stats);
			}
		});
	});
}

function check_access_async(pathname) {
	return new Promise((resolve, reject) => {
		fs.access(pathname, fs.constants.F_OK, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(pathname);
			}
		});
	});
}

function page(prefix) {
	const p = path.join(env.outputBaseDir, prefix);
	return stat_async(p)
		.then((stats) => {
			if (stats.isDirectory()) {
				return path.join(p, 'index.html');
			}
			return p;
		})
		.then(check_access_async)
		.then((file_path) => ({
			code: 200,
			message: 'OK',
			path: file_path
		}))
		.catch(() => ({
			code: 404,
			message: 'Not found',
			path: path.join(env.outputBaseDir, '404.html')
		}));
}

gulp.task('serve', () => gulp.src(env.outputBaseDir)
	.pipe(webserver({
		middleware(req, res) {
			page(url.parse(req.url).pathname)
				.then(page => {
					res.statusCode = page.code;
					res.statusMessage = page.message;
					fs.createReadStream(page.path).pipe(res);
				});
		}
	}))
);

module.exports = 'serve';
