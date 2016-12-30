const path = require('path');

const env = require('tools/gulp/env');
const BundleTask = require('tools/gulp/utils/bundle-task');

const app_source_file = path.join(path.join(env.jsSourceBaseDir, 'app.js'));
const app_output_dir = path.join(env.assetsOutputBaseDir, 'js');

module.exports = BundleTask('app', app_source_file, app_output_dir).setup().targets;
