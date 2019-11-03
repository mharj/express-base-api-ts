process.env.NODE_ENV = 'testing';
import {expect} from 'chai';
import * as chai from 'chai';
import * as etag from 'etag';
// tslint:disable-next-line
import chaiHttp = require('chai-http');
import 'mocha';
import {etagBuilder} from '../src/lib/HttpUtils';

chai.use(chaiHttp);
describe('etagBuilder', () => {
	it('should test etagBuilder', async () => {
		expect(etagBuilder(6)).to.be.equal(etag('' + 6));
		expect(etagBuilder('6')).to.be.equal(etag('6'));
		expect(etagBuilder({six: true})).to.be.equal(etag(JSON.stringify({six: true})));
		expect(etagBuilder((undefined as unknown) as string)).to.be.equal(undefined);
	});
});
