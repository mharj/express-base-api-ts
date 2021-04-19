import {ErrorRequestHandler, NextFunction} from 'express';
import {ValidationError as JoiValidationError} from 'express-validation';
import { HttpError, IApiError } from '../lib/HttpError';
import {logger} from '../logger';
export const errorMiddleWare: ErrorRequestHandler = async (err: HttpError, req, res, next: NextFunction) => {
	if (res.headersSent) {
		return next(err);
	}
	let code = 500;
	let message: IApiError = {error: err.name, description: err.message};
	if (err instanceof HttpError) {
		code = err.getCode();
		message = err.getObject();
	}
	if (process.env.NODE_ENV !== 'production' && err.stack) {
		message.trace = err.stack.split('\n');
	}
	if (process.env.NODE_ENV !== 'production' && err instanceof JoiValidationError) {
		message.trace = [];
		message.trace = message.trace.concat(err.details.body?.map((b) => 'body: ' + b.message) || []);
		message.trace = message.trace.concat(err.details.cookies?.map((b) => 'cookies: ' + b.message) || []);
		message.trace = message.trace.concat(err.details.headers?.map((b) => 'headers: ' + b.message) || []);
		message.trace = message.trace.concat(err.details.params?.map((b) => 'params: ' + b.message) || []);
		message.trace = message.trace.concat(err.details.query?.map((b) => 'query: ' + b.message) || []);
	}
	/* if (process.env.NODE_ENV !== 'production' && err instanceof MongoError.ValidationError) {
		message.error = err.message;
	} */
	// logger
	if (code >= 500) {
		logger.error(err);
	} else if (code >= 400 && code < 500) {
		logger.info(err);
	}
	res.status(code).json(message);
};
