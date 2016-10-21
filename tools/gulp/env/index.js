const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

const gutil = require('gulp-util');

const sources_base_dir = './sources';
const js_sources_base_dir = path.join(sources_base_dir, 'js')
const output_base_dir = process.env.OUTPUT_BASE_DIR || './build';
const assets_base_dir = path.join(output_base_dir, 'assets');

const env_config = {};

try {
	gutil.log(`Load ${env} env config`);
	const package_json_path = path.join(process.cwd(), 'package.json');
	if (fs.existsSync(package_json_path)) {
		Object.assign(
			env_config,
			require(package_json_path).env[env]
		);
	}
} catch(err) {
	gutil.log('Fail to load environment config part in package.json');
	process.exit(1);
}

module.exports = {
	get isDevelopment() {
		return env === 'development' || env === 'test';
	},
	get isProduction() {
		return !this.isDevelopment;
	},
	get sourceBaseDir() {
		return sources_base_dir;
	},
	get jsSourceBaseDir() {
		return js_sources_base_dir;
	},
	get outputBaseDir() {
		return output_base_dir;
	},
	get assetsOutputBaseDir() {
		return assets_base_dir;
	},
	get applets() {
		return {
			get sourcesDir() {
				return path.join(js_sources_base_dir, 'applets');
			},
			get outputDir() {
				return path.join(assets_base_dir, 'js', 'applets');
			},
			prefix(applet) {
				return `/${path.relative(output_base_dir, this.outputDir)}/${applet}.js`.replace(/\\/g, '/');
			}
		};
	},
	get content() {
		return {
			get sourcesBaseDir() {
				return path.join(sources_base_dir, 'content');
			},
			get matterDir() {
				return path.join(this.sourcesBaseDir, 'matter');
			},
			get layoutsDir() {
				return path.join(this.sourcesBaseDir, 'layouts');
			},
			get partialsDir() {
				return path.join(this.sourcesBaseDir, 'layouts', 'partials');
			},
			get helpersDir() {
				return path.join(this.sourcesBaseDir, 'helpers');
			},
			get outputDir() {
				return output_base_dir;
			},
			get metadata() {
				return (env_config.content || {}).metadata;
			}
		};
	},
	sass: {
		get sourcesDir() {
			return path.join(sources_base_dir, 'sass');
		},
		get cssOutputDir() {
			return path.join(assets_base_dir, 'css');
		},
		get fontOutputDir() {
			return path.join(assets_base_dir, 'fonts');
		},
		prefix(resource) {
			return `/${path.relative(output_base_dir, this.cssOutputDir)}/${resource}.css`.replace(/\\/g, '/');
		}
	},
};
