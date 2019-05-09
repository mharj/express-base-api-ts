process.env.NODE_ENV = 'testing';
import {expect} from 'chai';
import * as chai from 'chai';
// tslint:disable-next-line
import chaiHttp = require('chai-http');
import {Express} from 'express';
import {describe, it} from 'mocha';
import {getExpress} from '../src/service';
let app: Express | undefined;

let etag: string;

chai.use(chaiHttp);
describe('api', () => {
	before(async () => {
		app = await getExpress();
	});
	describe('hello', () => {
		it('should get hello world', (done) => {
			chai
				.request(app)
				.get('/api/hello')
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(JSON.stringify(res.body)).to.be.equal(JSON.stringify({msg: 'hello world'}));
					expect(res).to.have.header('etag');
					etag = res.header.etag;
					done(err);
				});
		});
		it('should get 304 not modified if correct etag', (done) => {
			chai
				.request(app)
				.get('/api/hello')
				.set('if-none-match', etag)
				.end((err, res) => {
					expect(res).to.have.status(304);
					done(err);
				});
		});
		it('put should not work if wrong etag', (done) => {
			chai
				.request(app)
				.put('/api/hello')
				.set('if-match', 'error-etag')
				.send({update: 'value'})
				.end((err, res) => {
					expect(res).to.have.status(409);
					done(err);
				});
		});
		it('put should work if correct etag', (done) => {
			chai
				.request(app)
				.put('/api/hello')
				.set('if-match', etag)
				.send({update: 'value'})
				.end((err, res) => {
					expect(res).to.have.status(200);
					done(err);
				});
		});
		it('put should work without etag', (done) => {
			chai
				.request(app)
				.put('/api/hello')
				.send({update: 'value'})
				.end((err, res) => {
					expect(res).to.have.status(200);
					done(err);
				});
		});

	});
});
