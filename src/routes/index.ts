import {Router} from 'express';
import {getRouter as getHelloWorldRouter} from './helloWorld.js';
import {getRouter as getStatusRouter} from './status.js';

let router: Router | undefined;
export function getRouter() {
	if (!router) {
		router = Router();
		router.use('/hello', getHelloWorldRouter());
		router.use('/status', getStatusRouter());
	}
	return router;
}
