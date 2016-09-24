require('babel-register');

const gulp = require('gulp');
const livereload = require('gulp-livereload');
const metalsmith = require('gulp-metalsmith');

const discover_hbs_helpers = require('metalsmith/discover-hbs-helpers');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');

const del = require('del');
const path = require('path');

module.exports = (contents_dir, layouts_dir, partials_dir, helpers_dir, dest_dir) => {
	const tasks = [
		[
			'content-clean',
			[],
			() => del(path.join(dest_dir, 'index.html'))
		],
		[
			'content',
			['content-clean'],
			() => gulp.src(path.join(contents_dir, '**'))
				.pipe(metalsmith({
					use: [
						discover_hbs_helpers({
							directory: helpers_dir
						}),
						markdown(),
						layouts({
							directory: layouts_dir,
							partials: partials_dir,
							engine: 'handlebars',
							default: 'index.hbs'
						})
					]
				}))
				.pipe(gulp.dest(dest_dir))
				.pipe(livereload())
		],
		[
			'content-watch',
			['content'],
			() => gulp.watch(
				[
					path.join(contents_dir, '**'),
					path.join(layouts_dir, '**/*.hbs'),
					path.join(helpers_dir, '**/*.js')
				],
				['content']
			)
		]
	];

	for (let task of tasks) {
		gulp.task(...task);
	}

	return {
		build: 'content',
		clean: 'content-clean',
		watch: 'content-watch'
	};
};
