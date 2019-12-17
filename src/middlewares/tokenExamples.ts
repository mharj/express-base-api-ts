import {NextFunction, Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
// is in use, move this to env.ts instead
const TOKEN_ISSUER = 'http://localhost.3001';

interface IAccessToken {
	exp: number;
	email: string;
}
const getBearerToken = (authHeader: string | undefined): string | null => {
	if (!authHeader) {
		return null;
	}
	const match = authHeader.match(/^Bearer (.*?)$/);
	if (!match) {
		return null;
	}
	return match[1];
};

/**
 * validates access token, this uses secret string, but can be used with pub/priv cert (Buffer data) instead.
 * @param req
 * @param res
 * @param next
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = getBearerToken(req.headers.authorization);
	try {
		if (!token) {
			throw new Error('Missing token');
		}
		req.token = jwt.verify(token, process.env.JWT_SECRET || 'some_secret_key', {issuer: TOKEN_ISSUER}) as IAccessToken;
		next();
	} catch (err) {
		res.status(401).json({
			error: 'token',
			error_description: err.message,
		});
	}
};

// extends Request interface with "token" (can be moved to custom.d.ts in src)
// tslint:disable:interface-name
declare global {
	namespace Express {
		export interface Request {
			token?: IAccessToken;
		}
	}
}
