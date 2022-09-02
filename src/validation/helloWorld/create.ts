import * as Joi from 'joi';
import {RequestHandler} from 'express';
import {ValidatedRequestSchema} from 'express-joi-validation';

interface IHelloWorldCreateRequest extends ValidatedRequestSchema {
	body: {
		_id?: string;
		item?: string;
	};
}
export type HelloWorldCreateRequestHandler = RequestHandler<IHelloWorldCreateRequest['params'], IHelloWorldCreateRequest['body']>;

export const validateHelloWorldCreate = {
	body: Joi.object<IHelloWorldCreateRequest['body']>({
		_id: Joi.string(),
		item: Joi.string(),
	}),
};
