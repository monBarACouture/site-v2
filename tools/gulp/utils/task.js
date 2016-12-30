const gulp = require('gulp');
const livereload = require('gulp-livereload');

const is_function = require('lodash.isfunction');
const noop = require('lodash.noop');

module.exports.Task = function Task(name) {
	const state = {
		targets: {
			build: `${name}`,
			clean: `${name}-clean`,
			watch: `${name}-watch`
		},
		callbacks: {
			build: noop,
			clean: noop,
			watch: noop
		}
	};

	return {
		clean(cb) {
			state.callbacks.clean = cb;
			return this;
		},
		build(cb) {
			state.callbacks.build = () => {
				return cb().pipe(livereload());
			};
			return this;
		},
		watch(sources) {
			if (is_function(sources)) {
				state.callbacks.watch = sources;
			} else {
				state.callbacks.watch = () => {
					return gulp.watch(sources, [state.build]);
				};
			}
			return this;
		},
		setup() {
			gulp
				.task(state.targets.clean, [], state.callbacks.clean)
				.task(state.targets.build, [state.targets.clean], state.callbacks.build)
				.task(state.targets.watch, [state.targets.build], state.callbacks.watch);
			return this;
		},
		get targets() {
			return Object.assign({}, state.targets);
		}
	};
};

module.exports.MacroTask = function(name, ...tasks) {
	const state = {
		callbacks: {
			build: noop,
			clean: noop,
			watch: noop
		},
		deps: {
			build: [],
			clean: [],
			watch: []
		},
		targets: {
			build: `${name}`,
			clean: `${name}-clean`,
			watch: `${name}-watch`
		}
	};

	const make_task = target => {
		gulp.task(
			state.targets[target],
			state.deps[target],
			state.callbacks[target]
		);
	};

	const macro_task = {
		build(cb) {
			state.callbacks.build = cb;
			return this;
		},
		clean(cb) {
			state.callbacks.clean = cb;
			return this;
		},
		watch(cb) {
			state.callbacks.watch = cb;
			return this;
		},
		push(task) {
			state.deps.build.push(task.build);
			state.deps.clean.push(task.clean);
			state.deps.watch.push(task.watch);
			return this;
		},
		setup() {
			Object.keys(state.targets).forEach(make_task);
			return this;
		},
		get targets() {
			return state.targets;
		}
	};

	for (let task of tasks) {
		macro_task.push(task);
	}

	return macro_task;
};
