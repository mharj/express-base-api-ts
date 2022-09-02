/* eslint-disable import/first */
/* eslint-disable no-unused-expressions */
process.env.NODE_ENV = 'test';
import {expect} from 'chai';
import * as chai from 'chai';
// tslint:disable-next-line
import chaiHttp = require('chai-http');
import {Express} from 'express';
import 'mocha';
import {startExpress, stopExpress} from '../src/service';
import {getHttpPort} from '../src/env';

let req: ChaiHttp.Agent;
let app: Express | undefined;

chai.use(chaiHttp);
describe('api errors', () => {
	before(async () => {
		app = await startExpress(await getHttpPort());
		req = chai.request(app).keepOpen();
	});
	describe('GET', () => {
		it('should not get error json', async () => {
			const res = await req.get('/qweasdqweqwe');
			expect(res.status).to.be.eq(404);
			expect(res.body).to.be.eql({});
		});
	});
	describe('GET', () => {
		it('should get error json', async () => {
			const res = await req.get('/api/hello/qweasdqweqwe');
			expect(res.status).to.be.eq(404);
			expect(res.body.error).to.be.eq('Not Found');
		});
	});
	after(async () => {
		await stopExpress();
	});
});
