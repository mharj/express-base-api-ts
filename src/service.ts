import * as express from 'express';
import {Express} from 'express';
import {HTTP_PORT} from './env';
import {setupExpress} from './middleware';
type ExpressCallback = (app: Express) => void;
let getApplicationCallback: ExpressCallback | undefined;
let isRunning = false;
const app = express();
// keep this base file clean and use setupExpress to configure Express
setupExpress(app);
// listener
app.listen(HTTP_PORT, () => {
	if (process.env.NODE_ENV !== 'testing') {
		/* istanbul ignore next */
		console.log(
			`[${process.env.NODE_ENV}] service listening on port ${process.env.NODE_ENV === 'development' ? 'http://localhost:' + HTTP_PORT : '' + HTTP_PORT}`,
		);
	}
	isRunning = true;
	// supply unit testing callback
	if (getApplicationCallback) {
		getApplicationCallback(app);
	}
});

// function for unit testing to get running Express instance
export const getExpress = (): Promise<Express> => {
	if (isRunning) {
		return Promise.resolve(app);
	} else {
		return new Promise((resolve, reject) => {
			getApplicationCallback = (currentApp) => {
				resolve(currentApp);
			};
		});
	}
};
