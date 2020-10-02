import * as Joi from '@hapi/joi';
import {Request} from 'express';
import 'joi-extract-type';
import {IRequestValidator} from '../middlewares/joiValidator';

// import {ContainerTypes, ValidatedRequestSchema} from 'express-joi-validation';

// Read
export interface IHelloWorldReadRequest extends Request {
	params: {
		id: string;
	};
}
export const validateHelloWorldRead: IRequestValidator<IHelloWorldReadRequest> = {
	params: Joi.object<IHelloWorldReadRequest['params']>({
		id: Joi.string().required(),
	}),
};
// Create
export interface IHelloWorldCreateRequest extends Request {
	body: {
		_id?: string;
		item?: string;
	};
}
export const validateHelloWorldCreate: IRequestValidator<IHelloWorldCreateRequest> = {
	body: Joi.object<IHelloWorldCreateRequest['body']>({
		_id: Joi.string(),
		item: Joi.string(),
	}),
};
// modify
export interface IHelloWorldModifyRequest extends Request {
	params: {
		id: string;
	};
	body: {
		item: string;
	};
}
export const validateHelloWorldModify: IRequestValidator<IHelloWorldModifyRequest> = {
	body: Joi.object<IHelloWorldModifyRequest['body']>({
		item: Joi.string().required(),
	}),
	params: Joi.object<IHelloWorldModifyRequest['params']>({
		id: Joi.string().required(),
	}),
};
// delete
export interface IHelloWorldDeleteRequest extends Request {
	params: {
		id: string;
	};
}
export const validateHelloWorldDelete: IRequestValidator<IHelloWorldDeleteRequest> = {
	params: Joi.object<IHelloWorldDeleteRequest['params']>({
		id: Joi.string().required(),
	}),
};

// TODO: fix when 'joi-extract-type' works ok with joi
/* export interface IHelloWorldReadSchema extends ValidatedRequestSchema {
	[ContainerTypes.Params]: Joi.extractType<typeof validateHelloWorldRead.params>;
} */
