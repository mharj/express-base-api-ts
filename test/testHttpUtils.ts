/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/first */
process.env.NODE_ENV = 'test';
import {Response} from 'express';
import {expect} from 'chai';
import * as chai from 'chai';
// tslint:disable-next-line
import chaiHttp = require('chai-http');
import 'mocha';
import {handleEtagResponse, isValueMatch} from '../src/lib/HttpUtils';
import {HttpError, isHttpError} from '../src/lib/HttpError';

chai.use(chaiHttp);
describe('http utils', () => {
	it('isValueMatch', () => {
		expect(isValueMatch('test', 'test')).to.be.equal(true);
		expect(isValueMatch(['test', 'test2'], 'test')).to.be.equal(true);
		expect(isValueMatch(['test', 'test2'], 'test2')).to.be.equal(true);
		expect(isValueMatch(undefined, undefined)).to.be.equal(false);
		expect(isValueMatch([undefined] as unknown as string[], undefined)).to.be.equal(false);
		expect(isValueMatch(['test', 'test2'], undefined)).to.be.equal(false);
		expect(isValueMatch('test', 'test2')).to.be.equal(false);
		expect(isValueMatch('test', undefined)).to.be.equal(false);
		expect(isValueMatch(undefined, 'test2')).to.be.equal(false);
	});
	it('test HttpError', () => {
		const error = new HttpError(404, 'some message', 'some description');
		expect(isHttpError(error)).to.be.true;
	});
	it('test handleEtagResponse', () => {
		const res = {
			setHeader: (key: string, value: string) => {},
			json: (data: unknown) => {},
			end: () => {},
		} as unknown as Response;
		handleEtagResponse('test', res);
	});
});
