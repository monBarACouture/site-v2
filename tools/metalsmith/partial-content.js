const path = require('path');
const handlebars = require('handlebars');

module.exports = (options = {}) => {
	const {directory} = Object.assign(options, {directory: 'partials'});
	return (files, metalsmith, done) => {
		Object.keys(files)
			// Filter partial contents.
			.reduce(
				(previous, file) => {
					const {dir, name} = path.parse(file);
					if (dir.startsWith(directory)) {
						return previous.concat({
							partial: path.relative(directory, `${dir}/${name}`),
							file
						});
					}
					return previous;
				},
				[]
			)
			// Remove partial content from files and create handlebars
			// partials.
			.forEach(({partial, file}) => {
				const {contents} = files[file];
				delete files[file];
				handlebars.registerPartial(partial, contents.toString());
			});
		done();
	};
};
