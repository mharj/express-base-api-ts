import {getConfigVariable, setLogger} from 'mharj-node-variable-util';
import {logger} from './logger';
// logger for variable util
setLogger(logger);

// do similar setups for all configuration items
let httpPort: string | undefined;
export async function getHttpPort(): Promise<string> {
	if (!httpPort) {
		httpPort = await getConfigVariable('PORT', '3001', {showValue: true});
	}
	return httpPort;
}
