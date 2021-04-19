import {Response} from 'superagent';
import {IApiError} from '../../src/lib/HttpError';

function isJson(res: Response) {
	const contentType = res.header['content-type'];
	if (!contentType) {
		throw new Error('no content type');
	}
	if (contentType.includes('application/json')) {
		return true;
	}
	return false;
}

export function catchHttpError(res: Response) {
	if (res.status >= 400) {
		if (!isJson(res)) {
			throw new Error('Http Error:' + res.status);
		}
		const {error, description, trace} = res.body as IApiError;
		const desc = description ? ': ' + description : '';
		const err = new Error(error + desc);
		if (trace) {
			err.stack = trace.join('\n');
		}
		throw err;
	}
}
