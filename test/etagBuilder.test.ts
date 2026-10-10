import etag from 'etag';
import {describe, expect, it} from 'vitest';
import {etagBuilder} from '../src/lib/HttpUtils.js';

describe('etagBuilder', () => {
	it('should test etagBuilder', () => {
		expect(etagBuilder(6)).to.be.equal(etag(`${6}`));
		expect(etagBuilder('6')).to.be.equal(etag('6'));
		expect(etagBuilder({six: true})).to.be.equal(etag(JSON.stringify({six: true})));
		expect(etagBuilder(undefined)).to.be.equal(undefined);
		expect(etagBuilder(null)).to.be.equal(undefined);
		expect(etagBuilder(true)).to.be.equal(etag('true'));
		expect(etagBuilder(false)).to.be.equal(etag('false'));
		expect(etagBuilder(Buffer.from('6'))).to.be.equal(etag(Buffer.from('6')));
		expect(etagBuilder(6n)).to.be.equal(etag(`${6n}`));
	});
});
