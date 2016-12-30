const fs = require('fs');
const path = require('path');

const {MacroTask} = require('tools/gulp/utils/task');
const BundleTask = require('tools/gulp/utils/bundle-task');

const env = require('tools/gulp/env');

const applet_env = env.applets;

function applet_module(applet) {
	return path.join(applet_env.sourcesDir, applet, 'main.js');
}

const applets = fs
	.readdirSync(applet_env.sourcesDir)
	.filter(entry => {
		try {
			return fs.statSync(applet_module(entry)).isFile();
		} catch (err) {
			return false;
		}
	})
	.map(applet => {
		const module = applet_module(applet);
		return BundleTask(applet, module, applet_env.outputDir).setup().targets;
	});

module.exports = MacroTask('applet', ...applets).setup().targets;
