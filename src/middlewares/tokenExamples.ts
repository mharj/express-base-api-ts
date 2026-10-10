import type {NextFunction, Request, Response} from 'express';
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
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
	const token = getBearerToken(req.headers.authorization);
	try {
		if (!token) {
			throw new Error('Missing token');
		}
		res.locals.token = jwt.verify(token, process.env.JWT_SECRET || 'some_secret_key', {issuer: TOKEN_ISSUER}) as IAccessToken;
		next();
	} catch (err) {
		const cause = err instanceof Error ? err : new Error(`Unknown error: ${JSON.stringify(err)}`);
		res.status(401).json({
			error: 'token',
			error_description: cause.message,
		});
	}
};
