import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {startExpress, stopExpress} from '../src/service.js';

let etag: string;
let port: string;
let item: object | undefined;

function catchHttpError(res: Response) {
	if (res.status >= 400) {
		throw new Error(`HTTP Error: ${res.status}: ${res.statusText}`);
	}
}

describe('api hello', () => {
	beforeAll(async () => {
		port = '10002';
		await startExpress(port);
	});
	describe('GET', () => {
		it('should get api status', async () => {
			const res = await fetch(`http://localhost:${port}/api/status`);
			catchHttpError(res);
			expect(res.status).toBe(200);
			await expect(res.json()).resolves.to.have.all.keys(['database', 'uptime']);
			expect(res.headers.has('etag')).to.be.eq(true);
		});
		it('should get hello world list', async () => {
			const res = await fetch(`http://localhost:${port}/api/hello`);
			catchHttpError(res);
			expect(res.status).toBe(200);
			const body = res.json();
			await expect(body).resolves.to.be.eql([{item: 'hello world'}]);
			expect(res.headers.has('etag')).to.be.eq(true);
			const currentEtag = res.headers.get('etag');
			if (!currentEtag) {
				throw new Error('etag header is missing');
			}
			etag = currentEtag;
		});

		it('should get 304 to get hello world list with etag', async () => {
			const res = await fetch(`http://localhost:${port}/api/hello`, {headers: {'if-none-match': etag}});
			catchHttpError(res);
			expect(res.status).toBe(304);
		});
		it('should get hello world', async () => {
			const res = await fetch(`http://localhost:${port}/api/hello/item`);
			catchHttpError(res);
			expect(res.status).toBe(200);
			const bodyPromise = res.json();
			await expect(bodyPromise).resolves.to.be.eql({item: 'hello world'});
			expect(res.headers.has('etag')).to.be.eq(true);
			const currentEtag = res.headers.get('etag');
			if (!currentEtag) {
				throw new Error('etag header is missing');
			}
			etag = currentEtag;
			item = (await bodyPromise) as object;
		});
		it('should get 304 not modified if correct etag', async () => {
			const res = await fetch(`http://localhost:${port}/api/hello/item`, {headers: {'if-none-match': etag}});
			catchHttpError(res);
			expect(res.status).toBe(304);
		});
	});
	describe('PUT', () => {
		it('put should not work if wrong etag', async () => {
			if (!item) {
				throw new Error('should have item');
			}
			const res = await fetch(`http://localhost:${port}/api/hello/item`, {
				body: JSON.stringify(item),
				method: 'PUT',
				headers: {'if-match': 'error-etag', 'Content-Type': 'application/json'},
			});
			expect(res.status).toBe(409);
		});
		it('put should work if correct etag', async () => {
			if (!item) {
				throw new Error('should have item');
			}
			const res = await fetch(`http://localhost:${port}/api/hello/item`, {
				body: JSON.stringify(item),
				method: 'PUT',
				headers: {'if-match': etag, 'Content-Type': 'application/json'},
			});
			catchHttpError(res);
			expect(res.status).toBe(200);
		});
		it('put should not work if wrong data type', async () => {
			const res = await fetch(`http://localhost:${port}/api/hello/item`, {
				body: JSON.stringify({item: 123}),
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
			});
			expect(res.status).toBe(500);
			await expect(res.json()).resolves.toEqual({description: expect.any(String), error: 'ValidateRequestError', trace: expect.any(Array)});
		});
		it('put should work without etag', async () => {
			if (!item) {
				throw new Error('should have item');
			}
			const res = await fetch(`http://localhost:${port}/api/hello/item`, {
				body: JSON.stringify(item),
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
			});
			catchHttpError(res);
			expect(res.status).toBe(200);
		});
		it('put should not work without data', async () => {
			const res = await fetch(`http://localhost:${port}/api/hello/item`, {body: undefined, method: 'PUT', headers: {'Content-Type': 'application/json'}});
			expect(res.status).toBe(500);
		});
	});
	describe('POST', () => {
		it('should POST data and get 201 code', async () => {
			const res = await fetch(`http://localhost:${port}/api/hello`, {
				body: JSON.stringify({item: 'value'}),
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
			});
			catchHttpError(res);
			expect(res.status).toBe(201);
		});
	});
	describe('DELETE', () => {
		it('should not delete if wrong item', async () => {
			const res = await fetch(`http://localhost:${port}/api/hello/wrong_item`, {method: 'DELETE'});
			expect(res.status).toBe(404);
		});
		it('should not delete if wrong etag', async () => {
			const res = await fetch(`http://localhost:${port}/api/hello/item`, {method: 'DELETE', headers: {'if-match': 'error-etag'}});
			expect(res.status).toBe(409);
		});
		it('should delete if correct etag', async () => {
			const res = await fetch(`http://localhost:${port}/api/hello/item`, {method: 'DELETE', headers: {'if-match': etag}});
			catchHttpError(res);
			expect(res.status).toBe(204);
		});
	});
	afterAll(async () => {
		await stopExpress();
	});
});
