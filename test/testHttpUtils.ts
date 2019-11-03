process.env.NODE_ENV = 'testing';
import {expect} from 'chai';
import * as chai from 'chai';
// tslint:disable-next-line
import chaiHttp = require('chai-http');
import 'mocha';
import {isValueMatch} from '../src/lib/HttpUtils';

chai.use(chaiHttp);
describe('http utils', () => {
	it('isValueMatch', async () => {
		expect(isValueMatch('test', 'test')).to.be.equal(true);
		expect(isValueMatch(['test', 'test2'], 'test')).to.be.equal(true);
		expect(isValueMatch(['test', 'test2'], 'test2')).to.be.equal(true);
		expect(isValueMatch(undefined, undefined)).to.be.equal(false);
		expect(isValueMatch(([undefined] as unknown) as string[], undefined)).to.be.equal(false);
		expect(isValueMatch(['test', 'test2'], undefined)).to.be.equal(false);
		expect(isValueMatch('test', 'test2')).to.be.equal(false);
		expect(isValueMatch('test', undefined)).to.be.equal(false);
		expect(isValueMatch(undefined, 'test2')).to.be.equal(false);
	});
});
