const is_nil = require('lodash/isNil');

function sort(items) {
	return items.sort((a, b) => {
		if (a.priority < b.priority) {
			return -1;
		} else if (a.priority > b.priority) {
			return  1;
		}
		return a.label.localeCompare(b.label);
	});
}

module.exports = () => {
	return (files, metalsmith, done) => {
		const menu = Object.keys(files)
			.filter(entry => !is_nil(files[entry].menu))
			.map(entry => {
				const page = files[entry];
				return Object.assign(
					{priority: 0},
					page.menu,
					{
						get path() {
							return page.path;
						},
						get slug() {
							return `/${this.path}`;
						}
					}
				);
			})
			.reduce(
				({header, footer}, entry) => {
					return (entry.footer
						? { header, footer: sort(footer.concat(entry)) }
						: { header: sort(header.concat(entry)), footer }
					);
				},
				{header: [], footer: []}
			);
		for (let entry of Object.keys(files)) {
			Object.assign(files[entry], {menu});
		}
		done();
	};
};
