const fs = require('fs-extra');
const path = require('path');

const get = require('lodash.get');
const set = require('lodash.set');
const uppercase = require('lodash.uppercase');
const merge = require('lodash.merge');

const profile = process.env.NODE_ENV || 'development';
const outputBaseDir = process.env.OUTPUT_BASE_DIR || './build';

function path_to_envvar(path) {
	return uppercase(path).replace(/ /g, '_');
}

function load_env_from_env_variable(...paths) {
	const env = Object.assign({}, ...paths.map(
		path => {
			const varname = path_to_envvar(path);
			const value = process.env[varname];
			return set({}, path, value);
		})
	);
	return env;
}

function load_env_from_package_json() {
	const pkg = fs.readJsonSync(path.join(process.cwd(), 'package.json'));
	return merge(
		get(pkg, 'env.common', {}),
		get(pkg, `env.${profile}`, {})
	);
}

function load_env_from_custom_env_json() {
	const custom_env_path = path.join(process.cwd(), '.env.json');
	if (!fs.existsSync(custom_env_path)) {
		return {};
	}
	const pkg = fs.readJsonSync(custom_env_path);
	return merge(
		get(pkg, 'common', {}),
		get(pkg, `${profile}`, {})
	);
}

function load_env(...paths) {
	return merge(
		load_env_from_package_json(),
		load_env_from_custom_env_json(),
		load_env_from_env_variable(...paths)
	);
}

module.exports = {
	get isDevelopment() {
		return profile === 'development' || profile === 'test';
	},
	get isProduction() {
		return !this.isDevelopment;
	},
	get outputBaseDir() {
		return outputBaseDir;
	},
	get assetsOutputBaseDir() {
		return path.join(outputBaseDir, 'assets');
	},
	get metadata() {
		return (load_env().content || {}).metadata;
	},
	get(path) {
		return get(load_env(path), path);
	}
};
