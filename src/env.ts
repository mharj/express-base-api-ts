import {setLogger, getConfigVariable} from '@avanio/variable-util';
import {env} from '@avanio/variable-util/dist/loaders/EnvConfigLoader';
import {DockerSecretsConfigLoader, FileConfigLoader} from '@avanio/variable-util-node';
import {logger} from './logger';
// logger for variable util
setLogger(logger);

const dockerEnv = new DockerSecretsConfigLoader({fileLowerCase: true}).getLoader;
const fileEnv = new FileConfigLoader({fileName: './settings.json', type: 'json'}).getLoader;

// do similar setups for all configuration items
let getHttpPortPromise: Promise<string> | undefined;
export const getHttpPort = (): Promise<string> => {
	if (!getHttpPortPromise) {
		getHttpPortPromise = getConfigVariable('PORT', [env(), fileEnv(), dockerEnv()], '3001', {showValue: true});
	}
	return getHttpPortPromise;
};
