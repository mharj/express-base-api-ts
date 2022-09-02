import {Router} from 'express';
import {HttpError} from '../lib/HttpError';
import {handleEtagResponse, ifMatchCheck, ifNoneMatchHandler, IfNoneMatchHandlerPromise} from '../lib/HttpUtils';
import {validate} from 'express-validation';
import {HelloWorldCreateRequestHandler, validateHelloWorldCreate} from '../validation/helloWorld/create';
import {validateHelloWorldDelete} from '../validation/helloWorld/delete';
import {HelloWorldModifyRequestHandler, validateHelloWorldModify} from '../validation/helloWorld/modify';
import {HelloWorldReadRequest, validateHelloWorldRead} from '../validation/helloWorld/read';

const item = {item: 'hello world'};

const listHello: IfNoneMatchHandlerPromise<{item: string}[]> = async () => {
	return [item];
};

const getHello: IfNoneMatchHandlerPromise<{item: string}, HelloWorldReadRequest> = async (req) => {
	if (req.params.id !== 'item') {
		throw new HttpError(404, 'Not Found');
	}
	return item;
};

const createHello: HelloWorldCreateRequestHandler = async (req, res) => {
	const data = req.body;
	// check if dub, else 409 'Conflict'
	// save data
	res.status(201); // 'Created'
	handleEtagResponse(data, res);
};

const modifyHello: HelloWorldModifyRequestHandler = async (req, res) => {
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
};

const deleteHello: HelloWorldModifyRequestHandler = async (req, res) => {
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
};

export function getRouter() {
	const router = Router();
	// list
	router.get('/', ifNoneMatchHandler('json', listHello));

	// read
	router.get('/:id', validate(validateHelloWorldRead), ifNoneMatchHandler('json', getHello));

	// create
	router.post('/', validate(validateHelloWorldCreate), createHello);

	// modify
	router.put('/:id', validate(validateHelloWorldModify), modifyHello);

	// delete
	router.delete('/:id', validate(validateHelloWorldDelete), deleteHello);

	return router;
}
