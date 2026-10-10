import {Router} from 'express';
import {type IfNoneMatchHandlerPromise, ifNoneMatchHandler} from '../lib/HttpUtils.js';

/**
 * GET /api/status (public)
 * TODO: build collection of public data which shows basic status of db connection and related info
 */
const getStatus: IfNoneMatchHandlerPromise<{database: boolean; uptime: number}> = () => {
	const now = Date.now();
	const uptime = Math.ceil(process.uptime() * 1000);
	return Promise.resolve({
		database: true /*  isMongoDbOnline(), */,
		uptime: Math.ceil((now - uptime) / 1000),
	});
};

export function getRouter() {
	const router = Router();
	router.get('/', ifNoneMatchHandler('json', getStatus));
	return router;
}
