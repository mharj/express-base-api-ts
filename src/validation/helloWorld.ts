import * as Joi from 'joi';
import {ValidatedRequestSchema} from 'express-joi-validation';

// Read
export interface HelloWorldReadRequest extends ValidatedRequestSchema {
	params: {
		id: string;
	};
}
export const validateHelloWorldRead = {
	params: Joi.object<HelloWorldReadRequest['params']>({
		id: Joi.string().required(),
	}),
};

// Create
export interface HelloWorldCreateRequest extends ValidatedRequestSchema {
	body: {
		item: string;
	};
}
export const validateHelloWorldCreate = {
	body: Joi.object<HelloWorldCreateRequest['body']>({
		item: Joi.string().required(),
	}),
};

// modify
export interface HelloWorldModifyRequest extends ValidatedRequestSchema {
	params: {
		id: string;
	};
	body: {
		item: string;
	};
}
export const validateHelloWorldModify = {
	body: Joi.object<HelloWorldModifyRequest['body']>({
		item: Joi.string().required(),
	}),
	params: Joi.object<HelloWorldModifyRequest['params']>({
		id: Joi.string().required(),
	}),
};

// delete
export interface HelloWorldDeleteRequest extends ValidatedRequestSchema {
	params: {
		id: string;
	};
}
export const validateHelloWorldDelete = {
	params: Joi.object<HelloWorldDeleteRequest['params']>({
		id: Joi.string().required(),
	}),
};
