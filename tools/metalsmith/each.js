const each_series = require('async').eachSeries;
const object_entries = Object.entries || require('object.entries');

module.exports = (options) => {
	const config = Object.assign({
		iteratee: () => null
	}, options);
	return (files, metalsmith, done) => {
		each_series(
			object_entries(files),
			([file, metadata], next) => {
				try {
					config.iteratee(file, metadata, next);
				} catch (err) {
					next(err);
				}
			},
			done
		);
	};
};
