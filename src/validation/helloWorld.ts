import * as Joi from '@hapi/joi';
import {ContainerTypes, ValidatedRequestSchema} from 'express-joi-validation';
import 'joi-extract-type';

export const validateHelloWorldRead = {
	params: Joi.object<{id: string}>({
		id: Joi.string().required(),
	}),
};

export interface IHelloWorldReadSchema extends ValidatedRequestSchema {
	[ContainerTypes.Params]: Joi.extractType<typeof validateHelloWorldRead>;
}
