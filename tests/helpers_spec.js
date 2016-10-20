import {expect} from 'chai';
import existy from '../sources/content/helpers/existy';
import menu_item_label from '../sources/content/helpers/menu-item-label';
import eq from '../sources/content/helpers/eq';

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

	describe('eq(a, b)', () => {
		it('returns true if a === b', () => {
			expect(eq(0, 0)).to.be.true;
			expect(eq('foo', 'foo')).to.be.true;
		});
		it('returns false if a !== b', () => {
			expect(eq(0, '0')).to.be.false;
			expect(eq(1, true)).to.be.false;
			expect(eq(false, '')).to.be.false;
		});
	});

	describe('menu-item-label(item)', () => {
		it('returns label if no icon is provided', () => {
			const res = menu_item_label({
				label: 'foo'
			});
			expect(res).to.equal('foo');
		});
		it('returns <i class="fa fa-icon"></i> label if icon is provided', () => {
			const res = menu_item_label({
				label: 'foo',
				icon: 'home'
			});
			expect(res).to.equal('<i class="fa fa-home"></i> foo');
		});
	});
});
