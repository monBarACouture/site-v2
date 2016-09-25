const path = require('path');

const sources_base_dir = './sources';
const js_sources_base_dir = path.join(sources_base_dir, 'js')
const output_base_dir = process.env.OUTPUT_BASE_DIR || './build';
const env = process.env.NODE_ENV || 'development';
const assets_base_dir = path.join(output_base_dir, 'assets');

module.exports = {
	get isDevelopment() {
		return env === 'development';
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
				return path.join(this.sourcesBaseDir, 'partials');
			},
			get helpersDir() {
				return path.join(this.sourcesBaseDir, 'helpers');
			},
			get outputDir() {
				return output_base_dir;
			}
		};
	},
	sass: {
		get sourcesDir() {
			return path.join(sources_base_dir, 'sass');
		},
		get outputDir(){
			return path.join(assets_base_dir, 'css');
		}
	},
};
