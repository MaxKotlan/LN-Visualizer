import { injectable } from 'inversify';
import config from 'config';

export interface Config {
    positionAlgorithm: string;
    port: number;
    host: string;
}

const initConfig: Config = {
    positionAlgorithm: 'gradient-descent',
    port: 5647,
    host: '0.0.0.0',
};

@injectable()
export class ConfigService {
    constructor() {
        this.readConfig();
    }

    private getConfigFile(): Config {
        return config.util.toObject();
    }

    private overrideEnvironmentVariables(config: Config) {
        Object.entries(config).forEach(([key, value]) => {
            if (value instanceof Object) {
                this.overrideEnvironmentVariables(config[key]);
            } else {
                const envPredecessor = `LNVIS_${key.toUpperCase()}`;
                const envVar = process.env[envPredecessor];
                if (envVar) config[key] = envVar;
            }
        });
    }

    private _config!: Config;

    private readConfig() {
        const configFile = this.getConfigFile();
        const configFileAndDefault = { ...initConfig, configFile };
        this.overrideEnvironmentVariables(configFileAndDefault);
        this._config = configFileAndDefault;
    }

    public getConfig(): Config {
        return this._config;
    }
}
