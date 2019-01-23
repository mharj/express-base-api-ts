import {NextFunction, Request, Response} from 'express';

const allowCorsHosts = ['http://localhost:8080'];

const getOrigin = (req: Request): string | undefined => {
	const {origin} = req.headers;
	if (Array.isArray(origin)) {
		return origin[0];
	} else {
		return origin;
	}
};

// This applies CORS if origin matches to array (NOTE: does not deny access)
export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const origin = getOrigin(req);
	if (origin && allowCorsHosts.indexOf(origin) !== -1) {
		res.set('Access-Control-Allow-Origin', origin);
		res.set('Access-Control-Allow-Credentials', 'true');
		res.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
		res.set('Access-Control-Allow-Headers', 'Origin, Authorization, Content-Type');
		res.set('Vary', 'Origin');
	}
	next();
};

// This applies CORS only if origin matches to array and else denies access (direct and not known origins)
export const corsMiddlewareDeny = (req: Request, res: Response, next: NextFunction) => {
	const origin = getOrigin(req);
	if (!origin || allowCorsHosts.indexOf(origin) === -1) {
		res.status(401).send('access denied');
	}
	res.set('Access-Control-Allow-Origin', origin);
	res.set('Access-Control-Allow-Credentials', 'true');
	res.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
	res.set('Access-Control-Allow-Headers', 'Origin, Authorization, Content-Type');
	res.set('Vary', 'Origin');
	next();
};
