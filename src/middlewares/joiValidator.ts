import {ObjectSchema} from '@hapi/joi';
import {NextFunction, Request, Response} from 'express';

interface IBaseType {
	query?: any;
	body?: any;
	headers?: any;
	params?: any;
}


export interface IRequestValidator<T extends IBaseType> {
	query?: ObjectSchema<T['query']>;
	body?: ObjectSchema<T['body']>;
	headers?: ObjectSchema<T['headers']>;
	params?: ObjectSchema<T['params']>;
}
export const validateRequest = <T extends IRequestValidator<IBaseType>>({query, body, headers, params}: T) => (req: Request, res: Response, next: NextFunction) => {
	if (query) {
		const {error, value} = query.validate(req.query);
		if (error) {
			const {details} = error;
			const message = details.map((i) => i.message).join(',');
			return res.status(400).json({error: message});
		}
		req.query = value;
	}
	if (body) {
		const {error, value} = body.validate(req.body);
		if (error) {
			const {details} = error;
			const message = details.map((i) => i.message).join(',');
			return res.status(400).json({error: message});
		}
		req.body = value;
	}
	if (headers) {
		const {error, value} = headers.validate(req.headers);
		if (error) {
			const {details} = error;
			const message = details.map((i) => i.message).join(',');
			return res.status(400).json({error: message});
		}
		req.headers = value;
	}
	if (params) {
		const {error, value} = params.validate(req.params);
		if (error) {
			const {details} = error;
			const message = details.map((i) => i.message).join(',');
			return res.status(400).json({error: message});
		}
		req.params = value;
	}
	return next();
	//    const { error, value } = validateRequest(req.body, query);
};
