import {NextFunction, Request, Response} from 'express';

const allowCorsHosts = ['http://localhost:8080'];

// This applies CORS if origin matches to array (NOTE: does not deny access)
export const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
	const method = req.method && req.method.toUpperCase && req.method.toUpperCase();
	let {origin} = req.headers;
	if (Array.isArray(origin)) {
		origin = origin[0];
	}
	if (origin && allowCorsHosts.indexOf(origin) !== -1) {
		res.set('Access-Control-Allow-Origin', origin);
		res.set('Access-Control-Allow-Credentials', 'true');
		res.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
		res.set('Access-Control-Allow-Headers', 'Origin, Authorization, Content-Type');
		res.set('Vary', 'Origin');
	}
	if (method === 'OPTIONS') {
		res.setHeader('Content-Length', '0');
		res.status(204).end();
	} else {
		next();
	}
};

// This applies CORS only if origin matches to array and else denies access (direct and not known origins)
export const corsMiddlewareDeny = (req: Request, res: Response, next: NextFunction): void => {
	const method = req.method && req.method.toUpperCase && req.method.toUpperCase();
	let {origin} = req.headers;
	if (Array.isArray(origin)) {
		origin = origin[0];
	}
	if (!origin || allowCorsHosts.indexOf(origin) === -1) {
		res.status(401).send('access denied');
	}
	res.set('Access-Control-Allow-Origin', origin);
	res.set('Access-Control-Allow-Credentials', 'true');
	res.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
	res.set('Access-Control-Allow-Headers', 'Origin, Authorization, Content-Type');
	res.set('Vary', 'Origin');
	if (method === 'OPTIONS') {
		res.setHeader('Content-Length', '0');
		res.status(204).end();
	} else {
		next();
	}
};
