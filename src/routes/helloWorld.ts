/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sonarjs/no-identical-functions */
import {NextFunction, Request, Response, Router} from 'express';
import {handleIfNoneMatch, ifMatchCheck} from '../lib/HttpUtils';
import {validate} from 'express-validation';
import {
	HelloWorldReadRequest,
	HelloWorldCreateRequest,
	HelloWorldModifyRequest,
	HelloWorldDeleteRequest,
	validateHelloWorldCreate,
	validateHelloWorldDelete,
	validateHelloWorldModify,
	validateHelloWorldRead,
} from '../validation/helloWorld';
import {IApiHello, IApiHelloDetail} from '../interfaces/hello';
import {ValidatedRequest} from 'express-joi-validation';
import {HttpError} from '../lib/HttpError';

/** this converts db model to actual API specific data model */
function mapList(model: {item: string}): IApiHello {
	return {
		item: model.item,
	};
}

/** this converts db model to actual API specific data model */
function mapDetail(model: {item: string}): IApiHelloDetail {
	return {
		item: model.item,
	};
}

let router: Router | undefined;
export function getRouter() {
	if (!router) {
		router = Router();
		// list: GET /api/hello
		router.get('/', async (req: Request, res: Response, next: NextFunction) => {
			try {
				const data = [{item: 'hello world'}];
				handleIfNoneMatch(data.map(mapList), req, res);
			} catch (err) {
				// error middleware
				/* istanbul ignore next */
				next(err);
			}
		});

		// read: GET /api/hello/:id
		router.get('/:id', validate(validateHelloWorldRead), async (req: ValidatedRequest<HelloWorldReadRequest>, res: Response, next: NextFunction) => {
			try {
				const data = {item: 'hello world'};
				if (req.params.id !== 'item') {
					throw new HttpError(404, 'not found!');
				}
				handleIfNoneMatch(mapDetail(data), req, res);
			} catch (err) {
				// error middleware
				/* istanbul ignore next */
				next(err);
			}
		});

		// create: POST /api/hello
		router.post('/', validate(validateHelloWorldCreate), async (req: ValidatedRequest<HelloWorldCreateRequest>, res: Response, next: NextFunction) => {
			try {
				const data = req.body;
				// check if dub, else 409 'Conflict'
				// save data
				res.status(201); // 'Created'
				handleIfNoneMatch(mapDetail(data), req, res);
			} catch (err) {
				// error middleware
				/* istanbul ignore next */
				next(err);
			}
		});

		// modify: PUT /api/hello/:id (with ETag validation that model didn't change before modify)
		router.put('/:id', validate(validateHelloWorldModify), async (req: ValidatedRequest<HelloWorldModifyRequest>, res: Response, next: NextFunction) => {
			try {
				const data = req.body;
				// check if data was already modified by someone else
				if (!ifMatchCheck(data, req)) {
					throw new HttpError(409, 'data already modified');
				}
				// update data
				handleIfNoneMatch(mapDetail(data), req, res);
			} catch (err) {
				// error middleware
				/* istanbul ignore next */
				next(err);
			}
		});

		// delete: DELETE /api/hello/:id
		router.delete('/:id', validate(validateHelloWorldDelete), async (req: ValidatedRequest<HelloWorldDeleteRequest>, res: Response, next: NextFunction) => {
			try {
				const data = {item: 'hello world'};
				if (req.params.id !== 'item') {
					throw new HttpError(404, 'not found!');
				}
				// check if data was already modified by someone else
				if (!ifMatchCheck(data, req)) {
					throw new HttpError(409, 'data already modified');
				}
				// delete data
				res.status(204).end(); // 'No Content'
			} catch (err) {
				// error middleware
				/* istanbul ignore next */
				next(err);
			}
		});
	}
	return router;
}
