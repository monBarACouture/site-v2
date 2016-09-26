import {expect} from 'chai';
import * as functional from 'core/functional';

describe('functional', () => {
	describe('existy(v) => bool', () => {
		it('returns false when v is undefined', () => {
			expect(functional.existy(undefined)).to.be.false;
		});
		it('returns false when v is null', () => {
			expect(functional.existy(null)).to.be.false;
		});
		it('returns true when v === false', () => {
			expect(functional.existy(false)).to.be.true;
		});
		it('returns true when v === true', () => {
			expect(functional.existy(true)).to.be.true;
		});
		it('returns true when v === 0', () => {
			expect(functional.existy(0)).to.be.true;
		});
		it('returns true when v !== 0', () => {
			expect(functional.existy(42)).to.be.true;
		});
		it('returns true when v is an empty string', () => {
			expect(functional.existy('')).to.be.true;
		});
		it('returns true when v is not an empty string', () => {
			expect(functional.existy('a string')).to.be.true;
		});
		it('returns true when v is an empty array', () => {
			expect(functional.existy([])).to.be.true;
		});
		it('returns true when v is not an empty array', () => {
			expect(functional.existy([0])).to.be.true;
		});
		it('returns true when v is an object', () => {
			expect(functional.existy({})).to.be.true;
		});
	});
	describe('cat(a, ...) => array', () => {
		it('returns an array', () => {
			expect(functional.cat([], 0)).to.be.an('array');
		});
		it('does not mutate a', () => {
			const a1 = [];
			const a2 = functional.cat(a1, 0);
			expect(a1).to.not.equal(a2);
			expect(a1).to.deep.equal([]);
		});
		it('appends elements to a in the given order', () => {
			const a1 = [];
			const a2 = functional.cat(a1, 0, 1);
			expect(a2).to.deep.equal([0, 1]);
		});
		it('concatenates arrays in the given orders', () => {
			const a1 = [1];
			const a2 = [2];
			const a3 = [3];
			expect(functional.cat(a1, a2, a3)).to.deep.equal([1, 2, 3]);
		});
	});
	describe('construct(e, a) => array', () => {
		it('returns an array', () => {
			expect(functional.construct(0, [])).to.be.an('array');
		});
		it('does not mutate a', () => {
			const a1 = [1, 2];
			functional.construct(0, a1);
			expect(a1).to.be.eql([1, 2]);
		});
		it('inserts e at the begining of a', () => {
			const a = functional.construct(0, []);
			expect(a).to.have.lengthOf(1);
			expect(a[0]).to.equal(0);
		});
	});
	describe('nodify(resolve, reject) => function(err, ...)', () => {
		it('returns a function', () => {
			expect(functional.nodify(() => {}, () => {})).to.be.a('function');
		});
		it('calls the reject function with an error if the returned function is invoked with an error', () => {
			let reject_called = false;
			let reject_arg = null;
			const fn = functional.nodify(
				() => {},
				(err) => {
					reject_called = true;
					reject_arg = err;
				}
			);
			const err = new Error();
			fn(err);
			expect(reject_called).to.be.true;
			expect(reject_arg).to.equal(err);
		});
		it('calls the resolve function with args if the returned function is invoked with no error', () => {
			let resolve_called = false;
			let resolve_arg1 = null;
			let resolve_arg2 = null;
			const fn = functional.nodify(
				(arg1, arg2) => {
					resolve_called = true;
					resolve_arg1 = arg1;
					resolve_arg2 = arg2;
				},
				() => {}
			);
			const arg1 = 0;
			const arg2 = {};
			fn(null, arg1, arg2);
			expect(resolve_called).to.be.true;
			expect(resolve_arg1).to.equal(arg1);
			expect(resolve_arg2).to.equal(arg2);
		});
	});
	describe('dispatch(f0, ..., fn) => function(...)', () => {
		it('returns a function', () =>  {
			expect(functional.dispatch(() => 1, () => 2)).to.be.a('function');
		});
		it('calls the given functions until one returns a value', () => {
			const f = functional.dispatch(
				() => null,
				() => 1,
				() => 2
			);
			expect(f()).to.equal(1);
		});
		it('passes the arguments to the given functions', () => {
			const f = functional.dispatch(
				(...args) => {
					expect(args).to.deep.equal([0, 1, 2]);
				},
				(...args) => {
					expect(args).to.deep.equal([0, 1, 2]);
				}
			);
			f(0, 1, 2);
		})
	});
});
