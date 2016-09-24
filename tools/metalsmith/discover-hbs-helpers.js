require('babel-register');

const handlebars = require('handlebars');
const path = require('path');
const walk = require('fs-tools').walk;

function file_ext(file_path) {
	const [,ext] = /^.*(\.\w+$)/.exec(file_path);
	return ext;
}

function helper_id(file_path) {
	return path.basename(file_path, file_ext(file_path));
}

function on_file(file_path, stats, next) {
	file_path = path.resolve(file_path);
	try {
		delete require.cache[require.resolve(file_path)];
		const id = helper_id(file_path);
		const fn = require(file_path);
		handlebars.registerHelper(id, fn);
		next();
	} catch (err) {
		next(err);
	}
}

module.exports = (options) => {
	const config = Object.assign({
		directory: 'partials',
		pattern: /\.js$/
	}, options);
	return (files, metalsmith, done) => {
		walk(
			config.directory,
			config.pattern,
			on_file,
			done
		);
	};
};
