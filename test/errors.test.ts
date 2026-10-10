import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {startExpress, stopExpress} from '../src/service.js';

let port: string;

describe('api errors', () => {
	beforeAll(async () => {
		port = '10003';
		await startExpress(port);
	});
	describe('GET', () => {
		it('should not get error json', async () => {
			const res = await fetch(`http://localhost:${port}/qweasdqweqwe`);
			expect(res.status).toBe(404);
			expect(res.headers.get('content-type')).to.be.eq(null);
		});
	});
	describe('GET', () => {
		it('should get error json', async () => {
			const res = await fetch(`http://localhost:${port}/api/hello/qweasdqweqwe`);
			expect(res.status).toBe(404);
			expect(res.headers.get('content-type')).to.be.eq('application/json; charset=utf-8');
			const body = (await res.json()) as {error: string};
			expect(body.error).toBe('Not Found');
		});
	});
	afterAll(async () => {
		await stopExpress();
	});
});
