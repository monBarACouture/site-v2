const del = require('del');
const gulp = require('gulp');
const livereload = require('gulp-livereload');
const path = require('path');
const sass = require('gulp-sass');

module.exports = (sources_dir, dest_dir) => {
	const tasks = [
		[
			'sass-clean',
			[],
			() => del(path.join(dest_dir, '**'))
		],
		[
			'sass',
			['sass-clean'],
			() => {
				return gulp.src(path.join(sources_dir, '**'))
					.pipe(sass({
						includePaths: [sources_dir],
						outputStyle: 'compressed'
					}).on('error', sass.logError))
					.pipe(gulp.dest(dest_dir))
					.pipe(livereload())
			}
		],
		[
			'sass-watch',
			['sass'],
			() => gulp.watch(path.join(sources_dir, '**'), ['sass'])
		]
	];

	for (let task of tasks) {
		gulp.task(...task);
	}

	return {
		build: 'sass',
		clean: 'sass-clean',
		watch: 'sass-watch'
	};
};
