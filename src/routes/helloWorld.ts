import {Request, Response, Router} from 'express';
import {handleEtagResponse, handleIfNoneMatch, ifMatchCheck} from '../lib/HttpUtils';

const router = Router();

// list
router.get('/', async (req: Request, res: Response) => {
	const data = [{msg: 'hello world'}];
	handleIfNoneMatch(data, req, res);
});

// read
router.get('/:id', async (req: Request, res: Response) => {
	const data = {msg: 'hello world'};
	if (!data) {
		return res.status(404).end(); // 'Not Found'
	}
	handleIfNoneMatch(data, req, res);
});

// create
router.post('/', async (req: Request, res: Response) => {
	const data = {msg: req.body.data};
	// check if dub, else 409 'Conflict'
	// save data
	res.status(201); // 'Created'
	handleEtagResponse(data, res);
});

// modify
router.put('/:id', async (req: Request, res: Response) => {
	const data = {msg: 'hello world'};
	if (!data) {
		return res.status(404).end(); // 'Not Found'
	}
	// check if data was already modified by someone else
	if (!ifMatchCheck(data, req)) {
		return res.status(409).end(); // 'Conflict'
	}
	// update data
	handleEtagResponse(data, res);
});

// delete
router.delete('/:id', async (req: Request, res: Response) => {
	const data = {msg: 'hello world'};
	if (!data) {
		return res.status(404).end(); // 'Not Found'
	}
	// check if data was already modified by someone else
	if (!ifMatchCheck(data, req)) {
		return res.status(409).end(); // 'Conflict'
	}
	// delete data
	res.status(204).end(); // 'No Content'
});

export const route = router;
