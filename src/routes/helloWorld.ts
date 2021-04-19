import {NextFunction, Request, Response, Router} from 'express';
import {handleEtagResponse, handleIfNoneMatch, ifMatchCheck} from '../lib/HttpUtils';
import {validate} from 'express-validation';
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
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = [{item: 'hello world'}];
		handleIfNoneMatch(data, req, res);
	} catch (err) {
		// error middleware
		next(err);
	}
});

// read
router.get('/:id', validate(validateHelloWorldRead), async (req: IHelloWorldReadRequest, res: Response, next: NextFunction) => {
	try {
		const data = {item: 'hello world'};
		if (req.params.id !== 'item') {
			return res.status(404).end(); // 'Not Found'
		}
		handleIfNoneMatch(data, req, res);
	} catch (err) {
		// error middleware
		next(err);
	}
});

// create
router.post('/', validate(validateHelloWorldCreate), async (req: IHelloWorldCreateRequest, res: Response, next: NextFunction) => {
	try {
		const data = req.body;
		// check if dub, else 409 'Conflict'
		// save data
		res.status(201); // 'Created'
		handleEtagResponse(data, res);
	} catch (err) {
		// error middleware
		next(err);
	}
});

// modify
router.put('/:id', validate(validateHelloWorldModify), async (req: IHelloWorldModifyRequest, res: Response, next: NextFunction) => {
	try {
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
	} catch (err) {
		// error middleware
		next(err);
	}
});

// delete
router.delete('/:id', validate(validateHelloWorldDelete), async (req: IHelloWorldDeleteRequest, res: Response, next: NextFunction) => {
	try {
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
	} catch (err) {
		// error middleware
		next(err);
	}
});

export const route = router;
