import { injectable } from 'inversify';
import config from 'config';

export interface Config {
    port: number;
    host: string;
}

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
        this.overrideEnvironmentVariables(configFile);
        this._config = configFile;
    }

    public getConfig(): Config {
        return this._config;
    }
}
