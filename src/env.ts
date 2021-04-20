import {getConfigVariable, setLogger} from 'mharj-node-variable-util';
import {logger} from './logger';
// logger for variable util
setLogger(logger);

// do similar setups for all configurations
let httpPortValue: string | undefined;
export async function getHttpPort(): Promise<string> {
	if (httpPortValue) {
		return httpPortValue;
	}
	httpPortValue = await getConfigVariable('PORT', '3001', {showValue: true});
	return httpPortValue;
}
