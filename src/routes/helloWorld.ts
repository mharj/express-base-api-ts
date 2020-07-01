import {Request, Response, Router} from 'express';
import {handleEtagResponse, handleIfNoneMatch, ifMatchCheck} from '../lib/HttpUtils';
import {validateRequest} from '../middlewares/joiValidator';
import {
	IHelloWorldCreateRequest,
	IHelloWorldDeleteRequest,
	IHelloWorldModifyRequest,
	IHelloWorldReadRequest,
	validateHelloWorldCreate,
	validateHelloWorldDelete,
	validateHelloWorldModify,
	validateHelloWorldRead,
} from '../validation/helloWorld';

const router = Router();

// list
router.get('/', async (req: Request, res: Response) => {
	const data = [{item: 'hello world'}];
	handleIfNoneMatch(data, req, res);
});

// read
router.get('/:id', validateRequest(validateHelloWorldRead), async (req: IHelloWorldReadRequest, res: Response) => {
	const data = {item: 'hello world'};
	if (req.params.id !== 'item') {
		return res.status(404).end(); // 'Not Found'
	}
	handleIfNoneMatch(data, req, res);
});

// create
// to help CORS pre-flight caching we can use POST as single item GET
router.post('/', validateRequest(validateHelloWorldCreate), async (req: IHelloWorldCreateRequest, res: Response) => {
	const {_id} = req.body;
	if (_id !== undefined) {
		const data = {item: 'hello world'};
		if (_id !== 'item') {
			return res.status(404).end(); // 'Not Found'
		} else {
			handleIfNoneMatch(data, req, res);
		}
	} else {
		const data = req.body;
		// check if dub, else 409 'Conflict'
		// save data
		res.status(201); // 'Created'
		handleEtagResponse(data, res);
	}
});

// modify
router.put('/:id', validateRequest(validateHelloWorldModify), async (req: IHelloWorldModifyRequest, res: Response) => {
	const data = req.body;
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
router.delete('/:id', validateRequest(validateHelloWorldDelete), async (req: IHelloWorldDeleteRequest, res: Response) => {
	const data = {item: 'hello world'};
	if (req.params.id !== 'item') {
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
