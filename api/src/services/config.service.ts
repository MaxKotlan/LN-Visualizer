import { injectable } from 'inversify';
import config from 'config';
import { GradientDescentSettings } from '../position-algorithms/gradient-descent/gd-settings.interface';

export interface Config {
    positionAlgorithm: string;
    gradientDescentSettings: GradientDescentSettings;
    port: number;
    host: string;
}

const initConfig: Config = {
    positionAlgorithm: 'gradient-descent',
    gradientDescentSettings: {
        iterations: 50,
        learningRate: 1.0,
        logRate: 10,
        maxConnectedNodeDistance: 0.1,
        minConnectedNodeDistance: 0.04,
        invertConnectedRange: true,
        shouldLog: true,
    } as GradientDescentSettings,
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

    private overrideConfigVariables(inMemory: Config, file: Config) {
        Object.entries(inMemory).forEach(([key, value]) => {
            if (value instanceof Object) {
                this.overrideConfigVariables(inMemory[key], file[key]);
            } else {
                const configValue = file[key];
                if (configValue) inMemory[key] = file[key];
            }
        });
    }

    private _config!: Config;

    private readConfig() {
        const configFile = this.getConfigFile();
        this.overrideConfigVariables(initConfig, configFile);
        this.overrideEnvironmentVariables(initConfig);
        this._config = initConfig;
    }

    public getConfig(): Config {
        return this._config;
    }
}
