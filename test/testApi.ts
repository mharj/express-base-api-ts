process.env.NODE_ENV = 'testing';
import {expect} from 'chai';
import * as chai from 'chai';
// tslint:disable-next-line
import chaiHttp = require('chai-http');
import {Express} from 'express';
import 'mocha';
import {getExpress} from '../src/service';

let req: ChaiHttp.Agent;
let app: Express | undefined;
let etag: string;
let item: object | undefined;

chai.use(chaiHttp);
describe('api hello', () => {
	before(async () => {
		app = await getExpress();
		req = chai.request(app).keepOpen();
	});
	describe('GET', () => {
		it('should get hello world list', async () => {
			const res = await req.get('/api/hello');
			expect(res).to.have.status(200);
			expect(res.body).to.be.eql([{item: 'hello world'}]);
			expect(res).to.have.header('etag');
			etag = res.header.etag;
		});

		it('should get 304 to get hello world list with etag', async () => {
			const res = await req.get('/api/hello').set('if-none-match', etag);
			expect(res).to.have.status(304);
		});
		it('should get hello world', async () => {
			const res = await req.get('/api/hello/item');
			expect(res).to.have.status(200);
			expect(res.body).to.be.eql({item: 'hello world'});
			expect(res).to.have.header('etag');
			etag = res.header.etag;
			item = res.body;
		});
		it('should get 304 not modified if correct etag', async () => {
			const res = await req.get('/api/hello/item').set('if-none-match', etag);
			expect(res).to.have.status(304);
		});
	});
	describe('PUT', () => {
		it('put should not work if wrong etag', async () => {
			if (!item) {
				throw new Error('should have item');
			}
			const res = await req
				.put('/api/hello/item')
				.set('if-match', 'error-etag')
				.send(item);
			expect(res).to.have.status(409);
		});
		it('put should work if correct etag', async () => {
			if (!item) {
				throw new Error('should have item');
			}
			const res = await req
				.put('/api/hello/item')
				.set('if-match', etag)
				.send(item);
			expect(res).to.have.status(200);
		});
		it('put should not work if wrong data type', async () => {
			const res = await req
				.put('/api/hello/item')
				.send({item: 123});
			expect(res).to.have.status(400);
			expect(res.body).to.be.eql({error: '\"item\" must be a string'});
		});
		it('put should work without etag', async () => {
			if (!item) {
				throw new Error('should have item');
			}
			const res = await req.put('/api/hello/item').send(item);
			expect(res).to.have.status(200);
		});
	});
	describe('POST', () => {
		it('should POST data and get 201 code', async () => {
			const res = await req.post('/api/hello').send({item: 'value'});
			expect(res).to.have.status(201);
		});
		it('should get 304 not modified if getting item with correct etag (CORS optimization)', async () => {
			const res = await req
				.post('/api/hello')
				.send({_id: 'item'})
				.set('if-none-match', etag);
			expect(res).to.have.status(304);
		});
		it('should not get data if body id not matching to filter (requires string _id)', async () => {
			const res = await req
				.post('/api/hello')
				.send({_id: 123});
			expect(res).to.have.status(400);
			expect(res.body).to.be.eql({error: '\"_id\" must be a string'});
		});
	});
	describe('DELETE', () => {
		it('should not delete if wrong item', async () => {
			const res = await req.delete('/api/hello/wrong_item');
			expect(res).to.have.status(404);
		});
		it('should not delete if wrong etag', async () => {
			const res = await req.delete('/api/hello/item').set('if-match', 'error-etag');
			expect(res).to.have.status(409);
		});
		it('should delete if correct etag', async () => {
			const res = await req.delete('/api/hello/item').set('if-match', etag);
			expect(res).to.have.status(204);
		});
	});
});
