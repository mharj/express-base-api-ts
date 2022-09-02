import * as Joi from 'joi';
import {ValidatedRequestSchema} from 'express-joi-validation';
import {Request} from 'express';

export interface IHelloWorldReadSchema extends ValidatedRequestSchema {
	params: {
		id: string;
	};
}
export const validateHelloWorldRead = {
	params: Joi.object<IHelloWorldReadSchema['params']>({
		id: Joi.string().required(),
	}),
};

export type HelloWorldReadRequest = Request<IHelloWorldReadSchema['params'], IHelloWorldReadSchema['body']>;
