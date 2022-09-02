import {Router} from 'express';
import {ifNoneHandler, IfNoneMatchHandlerPromise} from '../lib/HttpUtils';

/**
 * GET /api/status (public)
 * TODO: build collection of public data which shows basic status of db connection and related info
 */
const getStatus: IfNoneMatchHandlerPromise<{database: boolean; uptime: number}> = async () => {
	const now = new Date().getTime();
	const uptime = Math.ceil(process.uptime() * 1000);
	return {
		database: true /*  isMongoDbOnline(), */,
		uptime: Math.ceil((now - uptime) / 1000),
	};
};

export function getRouter() {
	const router = Router();
	router.get('/', ifNoneHandler('json', getStatus));
	return router;
}
