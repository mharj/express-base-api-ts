import {type Express, json, urlencoded} from 'express';
import {HttpError} from './lib/HttpError.js';
import {errorMiddleWare} from './middlewares/errorMiddleware.js';
import {getRouter} from './routes/index.js';

export const setupExpress = (app: Express): void => {
	// express settings
	app.set('etag', false);
	app.disable('x-powered-by');
	// body parsers
	app.use(urlencoded({extended: false}));
	app.use(json());
	// apply middlewares here
	// app.use(corsMiddleware);
	// routes
	app.use('/api', getRouter());
	// error handling
	app.get(/(.*)/, (req, _res, next) => {
		// block json output for unknown routes
		next(new HttpError(404, 'route_not_found', req.url, false));
	});
	app.use(errorMiddleWare);
};
