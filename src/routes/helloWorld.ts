import {validateRequest, validateRequestHandler} from '@luolapeikko/express-standard-schema';
import {Router} from 'express';
import {z} from 'zod';
import {HttpError} from '../lib/HttpError.js';
import {handleEtagResponse, type IfNoneMatchHandlerPromise, ifMatchCheck, ifNoneMatchHandler} from '../lib/HttpUtils.js';

const item = {item: 'hello world'};

const listHello: IfNoneMatchHandlerPromise<{item: string}[]> = () => {
	return Promise.resolve([item]);
};

const getHello: IfNoneMatchHandlerPromise<{item: string}> = (req) => {
	if (req.params.id !== 'item') {
		throw new HttpError(404, 'Not Found');
	}
	return Promise.resolve(item);
};

const createHello = validateRequestHandler(
	{
		body: z.object({
			item: z.string(),
		}),
	},
	(req, res) => {
		const data = req.body;
		// check if dub, else 409 'Conflict'
		// save data
		res.status(201); // 'Created'
		handleEtagResponse(data, res);
	},
);

const modifyHello = validateRequestHandler(
	{
		params: z.object({
			id: z.string(),
		}),
		body: z.object({
			item: z.string(),
		}),
	},
	(req, res) => {
		const data = req.body;
		if (!data) {
			res.status(404).end(); // 'Not Found'
			return;
		}
		// check if data was already modified by someone else
		if (!ifMatchCheck(data, req)) {
			res.status(409).end(); // 'Conflict'
			return;
		}
		// update data
		handleEtagResponse(data, res);
	},
);

const deleteHello = validateRequestHandler(
	{
		params: z.object({
			id: z.string(),
		}),
	},
	(req, res) => {
		const data = {item: 'hello world'};
		if (req.params.id !== 'item') {
			res.status(404).end(); // 'Not Found'
			return;
		}
		// check if data was already modified by someone else
		if (!ifMatchCheck(data, req)) {
			res.status(409).end(); // 'Conflict'
			return;
		}
		// delete data
		res.status(204).end(); // 'No Content'
	},
);

export function getRouter() {
	const router = Router();
	// list
	router.get('/', ifNoneMatchHandler('json', listHello));

	// read
	router.get(
		'/:id',
		validateRequest({
			params: z.object({
				id: z.string(),
			}),
		}),
		ifNoneMatchHandler('json', getHello),
	);

	// create
	router.post('/', createHello);

	// modify
	router.put('/:id', modifyHello);

	// delete
	router.delete('/:id', deleteHello);

	return router;
}
