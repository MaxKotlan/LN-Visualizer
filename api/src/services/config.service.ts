import { injectable } from 'inversify';
import config from 'config';
import { GradientDescentSettings } from '../position-algorithms/gradient-descent/gd-settings.interface';
import { LndAuthenticationWithMacaroon } from 'lightning';

export interface LndConfig {
    macaroon: LndAuthenticationWithMacaroon;
    cert_file: string | undefined;
    macaroon_file: string | undefined;
}

export interface PodStatusServer {
    enabled: boolean;
    port: number;
}

export interface BenchmarkMode {
    enabled: boolean;
    nodeCount: number;
    channelCount: number;
}

export interface Config {
    lndConfig: LndConfig;
    podStatusServer: PodStatusServer;
    positionAlgorithm: string;
    gradientDescentSettings: GradientDescentSettings;
    benchmarkMode: BenchmarkMode;
    resyncTimer: string;
    port: number;
    host: string;
}

/*default values used if config file does is missing a value*/
const initConfig: Config = {
    lndConfig: {
        macaroon: {
            cert: undefined,
            macaroon: undefined,
            socket: '127.0.0.1:10009',
        },
        cert_file: undefined,
        macaroon_file: undefined,
    },
    podStatusServer: {
        enabled: true,
        port: 3000,
    } as PodStatusServer,
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
    benchmarkMode: {
        enabled: true,
        nodeCount: 18000,
        channelCount: 90000,
    } as BenchmarkMode,
    resyncTimer: '0 0 * * *',
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

    private overrideEnvironmentVariables(config: Config, prefix = 'LNVIS_') {
        Object.entries(config).forEach(([key, value]) => {
            if (value instanceof Object) {
                const prfx = key === 'lndConfig' ? 'LND_' : prefix;
                this.overrideEnvironmentVariables(config[key], prfx);
            } else {
                const envPredecessor = `${prefix}${key.toUpperCase()}`;
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
                if (!file) return;
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
