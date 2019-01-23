import {Express} from 'express';
import {routes} from './routes';

export const setupExpress = (app: Express) => {
	// express settings
	app.set('etag', false);
	app.disable('x-powered-by');

	// routes
	app.use('/api', routes);
};
