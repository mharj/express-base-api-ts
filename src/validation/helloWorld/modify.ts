import * as Joi from 'joi';
import {RequestHandler} from 'express';
import {ValidatedRequestSchema} from 'express-joi-validation';

export interface IHelloWorldModifyRequest extends ValidatedRequestSchema {
	params: {
		id: string;
	};
	body: {
		item: string;
	};
}
export const validateHelloWorldModify = {
	body: Joi.object<IHelloWorldModifyRequest['body']>({
		item: Joi.string().required(),
	}),
	params: Joi.object<IHelloWorldModifyRequest['params']>({
		id: Joi.string().required(),
	}),
};
export type HelloWorldModifyRequestHandler = RequestHandler<IHelloWorldModifyRequest['params'], IHelloWorldModifyRequest['body']>;
