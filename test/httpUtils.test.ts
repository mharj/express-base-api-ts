import type {Response} from 'express';
import {describe, expect, it} from 'vitest';
import {HttpError, isHttpError} from '../src/lib/HttpError.js';
import {handleEtagResponse, isValueMatch} from '../src/lib/HttpUtils.js';

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
			setHeader: (_key: string, _value: string) => {},
			json: (_data: unknown) => {},
			end: () => {},
		} as unknown as Response;
		handleEtagResponse('test', res);
	});
});
