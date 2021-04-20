import * as Joi from '@hapi/joi';
import {Request} from 'express';
import 'joi-extract-type';

// import {ContainerTypes, ValidatedRequestSchema} from 'express-joi-validation';

// Read
export interface IHelloWorldReadRequest extends Request {
	params: {
		id: string;
	};
}
export const validateHelloWorldRead = {
	params: Joi.object<IHelloWorldReadRequest['params']>({
		id: Joi.string().required(),
	}),
};
// Create
export interface IHelloWorldCreateRequest extends Request {
	body: {
		item: string;
	};
}
export const validateHelloWorldCreate = {
	body: Joi.object<IHelloWorldCreateRequest['body']>({
		item: Joi.string().required(),
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
export const validateHelloWorldModify = {
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
export const validateHelloWorldDelete = {
	params: Joi.object<IHelloWorldDeleteRequest['params']>({
		id: Joi.string().required(),
	}),
};

// TODO: fix when 'joi-extract-type' works ok with joi
/* export interface IHelloWorldReadSchema extends ValidatedRequestSchema {
	[ContainerTypes.Params]: Joi.extractType<typeof validateHelloWorldRead.params>;
} */
