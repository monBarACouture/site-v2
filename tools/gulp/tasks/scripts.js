const fs = require('fs');
const path = require('path');

const env = require('tools/gulp/env');
const BundleTask = require('tools/gulp/utils/bundle-task');
const {MacroTask} = require('tools/gulp/utils/task');
const vendors = require('tools/gulp/tasks/vendors');

const sourcesDir = path.join('sources', 'js');
const appletsSourcesDir = path.join(sourcesDir, 'applets');
const outputDirectory = path.join(env.assetsOutputBaseDir, 'js');

function applet_module(applet) {
	return path.join(appletsSourcesDir, applet, 'main.js');
}

const mbac = BundleTask({
	name: 'script-mbac',
	source: path.join(path.join(sourcesDir, 'mbac.js')),
	outputDirectory,
	outputFilename: 'mbac.js'
}).setup().targets;

const applets = fs
	.readdirSync(appletsSourcesDir)
	.filter(entry => {
		try {
			return fs.statSync(applet_module(entry)).isFile();
		} catch (err) {
			return false;
		}
	})
	.map(applet => {
		const module = applet_module(applet);
		return BundleTask({
			name: `script-${applet}`,
			source: module,
			outputDirectory,
			outputFilename: `${applet}.js`
		}).setup().targets;
	});

module.exports = MacroTask('scripts', mbac, ...applets, vendors).setup().targets;
