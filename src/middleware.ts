import * as bodyParser from 'body-parser';
import {Express} from 'express';
import {routes} from './routes';

export const setupExpress = (app: Express) => {
	// express settings
	app.set('etag', false);
	app.disable('x-powered-by');
	// body parsers
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());
	// apply middlewares here
	// app.use(corsMiddleware);
	// routes
	app.use('/api', routes);
	// apply error handler here if using nextFunction for errors
};
