import {ConfigMap, EnvConfigLoader, stringParser} from '@avanio/variable-util';
import {DockerSecretsConfigLoader, FileConfigLoader} from '@avanio/variable-util-node';
import {logger} from './logger.js';

const dockerEnv = new DockerSecretsConfigLoader({fileLowerCase: true});
const fileEnv = new FileConfigLoader({fileName: './settings.json', fileType: 'json'});

export const Env = new ConfigMap<{
	PORT: string;
}>(
	{
		PORT: {parser: stringParser(), defaultValue: '3001', params: {showValue: true}},
	},
	[new EnvConfigLoader(), fileEnv, dockerEnv],
	{logger},
);
