import {NextFunction, Request, Response, Router} from 'express';
import {handleIfNoneMatch} from '../lib/HttpUtils';

let router: Router | undefined;

export function getRouter() {
	if (!router) {
		router = Router();
		/**
		 * GET /api/status (public)
		 * TODO: build collection of public data which shows basic status of db connection and related info
		 */

		router.get('/', (req: Request, res: Response, next: NextFunction) => {
			try {
				const now = new Date().getTime();
				const uptime = Math.ceil(process.uptime() * 1000);
				handleIfNoneMatch(
					{
						database: true /*  isMongoDbOnline(), */,
						uptime: Math.ceil((now - uptime) / 1000),
					},
					req,
					res,
				);
			} catch (err) {
				/* istanbul ignore next */
				next(err);
			}
		});
	}
	return router;
}
