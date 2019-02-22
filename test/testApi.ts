process.env.NODE_ENV = 'testing';
import {expect} from 'chai';
import * as chai from 'chai';
// tslint:disable-next-line
import chaiHttp = require('chai-http');
import {Express} from 'express';
import {describe, it} from 'mocha';
import {getExpress} from '../src/service';
let app: Express | undefined;

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
					done();
				});
		});
	});
});
