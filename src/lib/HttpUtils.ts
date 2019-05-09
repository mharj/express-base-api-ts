import * as etag from 'etag';
import {Request, Response} from 'express';

export const etagBuilder = (data: number | string | object, options?: etag.Options): string | undefined => {
	let etagData = null;
	if (typeof data === 'number') {
		etagData = etag('' + data, options);
	}
	if (typeof data === 'string') {
		etagData = etag(data, options);
	}
	if (typeof data === 'object') {
		etagData = etag(JSON.stringify(data), options);
	}
	if (etag && etagData) {
		etagData = etagData.substring(1, etagData.length - 1); // clean etag double quotes
		return etagData;
	}
	return undefined;
};

export const ifNoneMatch = (req: Request, etagHash: string, isNotSet: boolean = false) => {
	if ('if-none-match' in req.headers) {
		if (Array.isArray(req.headers['if-none-match'])) {
			let found = false;
			const etagHeaders = req.headers['if-none-match'] as string[];
			etagHeaders.forEach((etagHeader) => {
				if (etagHash === etagHeader) {
					found = true;
				}
			});
			return found;
		} else {
			const etagHeader = req.headers['if-none-match'] as string;
			return etagHash === etagHeader;
		}
	} else {
		return isNotSet;
	}
};

export const ifMatch = (req: Request, etagHash: string | undefined, isNotSet: boolean = true): boolean => {
	if ('if-match' in req.headers) {
		if (Array.isArray(req.headers['if-match'])) {
			let found = false;
			const etagHeaders = req.headers['if-match'] as string[];
			etagHeaders.forEach((etagHeader) => {
				if (etagHash === etagHeader) {
					found = true;
				}
			});
			return found;
		} else {
			const etagHeader = req.headers['if-match'] as string;
			return etagHash === etagHeader;
		}
	} else {
		return isNotSet;
	}
};

/**
 * Compares current body object etag and check against if-match header
 * @param body data object
 * @param req Express Request
 * @param isNotSet return value if header is not set (default: true)
 * @return {boolean}
 */
export const ifMatchCheck = (body: object, req: Request, isNotSet: boolean = true): boolean => {
	return ifMatch(req, etagBuilder(body), isNotSet);
};

export const handleEtagResponse = (data: object, res: Response) => {
	const etagHash = etagBuilder(data);
	if (etagHash) {
		res.setHeader('ETag', etagHash);
	}
	res.json(data);
	res.end();
};

export const handleIfNoneMatch = (data: object, req: Request, res: Response, headers?: Headers) => {
	const etagHash = etagBuilder(data);
	if (etagHash && ifNoneMatch(req, etagHash) === true) {
		return res.status(304).send('Not Modified');
	}
	if (headers) {
		headers.forEach((value, key) => res.setHeader(key, value));
	}
	if (etagHash) {
		res.setHeader('ETag', etagHash);
	}
	res.json(data);
	return res.end();
};
