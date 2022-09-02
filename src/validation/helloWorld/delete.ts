import * as Joi from 'joi';
import {RequestHandler} from 'express';
import {ValidatedRequestSchema} from 'express-joi-validation';

export interface IHelloWorldDeleteRequest extends ValidatedRequestSchema {
	params: {
		id: string;
	};
}
export const validateHelloWorldDelete = {
	params: Joi.object<IHelloWorldDeleteRequest['params']>({
		id: Joi.string().required(),
	}),
};
export type HelloWorldDeleteRequestHandler = RequestHandler<IHelloWorldDeleteRequest['params'], IHelloWorldDeleteRequest['body']>;
