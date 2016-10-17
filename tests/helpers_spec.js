import {expect} from 'chai';
import existy from '../sources/content/helpers/existy';

describe('helpers', () => {
	describe('existy(v)', () => {
		it('returns false if v is null', () => {
			expect(existy(null)).to.be.false;
		});
		it('returns false if v is undefined', () => {
			expect(existy(undefined)).to.be.false;
		});
		it('returns true if and only if v is not null or undefined', () => {
			expect(existy(0)).to.be.true;
			expect(existy(1)).to.be.true;
			expect(existy(true)).to.be.true;
			expect(existy(false)).to.be.true;
			expect(existy('')).to.be.true;
			expect(existy('foo')).to.be.true;
			expect(existy([])).to.be.true;
			expect(existy({})).to.be.true;
		});
	});
});
