import {NextFunction, Request, Response, Router} from 'express';
import {handleIfNoneMatch, ifMatchCheck} from '../lib/HttpUtils';
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
import {IApiHello, IApiHelloDetail} from '../interfaces/hello';

const router = Router();

/** this converts db model to actual API specific data model */
function buildList(model: {item: string}): IApiHello {
	return {
		item: model.item,
	};
}

/** this converts db model to actual API specific data model */
function buildDetail(model: {item: string}): IApiHelloDetail {
	return {
		item: model.item,
	};
}

// list: GET /api/hello 
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = [{item: 'hello world'}];
		handleIfNoneMatch(data.map(buildList), req, res);
	} catch (err) {
		// error middleware
		next(err);
	}
});

// read: GET /api/hello/:id
router.get('/:id', validate(validateHelloWorldRead), async (req: IHelloWorldReadRequest, res: Response, next: NextFunction) => {
	try {
		const data = {item: 'hello world'};
		if (req.params.id !== 'item') {
			return res.status(404).end(); // 'Not Found'
		}
		handleIfNoneMatch(buildDetail(data), req, res);
	} catch (err) {
		// error middleware
		next(err);
	}
});

// create: POST /api/hello
router.post('/', validate(validateHelloWorldCreate), async (req: IHelloWorldCreateRequest, res: Response, next: NextFunction) => {
	try {
		const data = req.body;
		// check if dub, else 409 'Conflict'
		// save data
		res.status(201); // 'Created'
		handleIfNoneMatch(buildDetail(data), req, res);
	} catch (err) {
		// error middleware
		next(err);
	}
});

// modify: PUT /api/hello/:id (with ETag validation that model didn't change before modify)
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
		handleIfNoneMatch(buildDetail(data), req, res);
	} catch (err) {
		// error middleware
		next(err);
	}
});

// delete: DELETE /api/hello/:id
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
