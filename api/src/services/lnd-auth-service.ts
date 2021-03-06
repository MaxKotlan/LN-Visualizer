import { injectable } from 'inversify';
import fs from 'fs';
import { AuthenticatedLnd, LndAuthenticationWithMacaroon } from 'lightning';
import * as lightning from 'lightning';
import { ConfigService } from './config.service';

@injectable()
export class LndAuthService {
    public get authenticatedLnd() {
        return { lnd: this.lnd };
    }

    private lnd: AuthenticatedLnd;

    constructor(private configService: ConfigService) {
        const conf = this.getConfig();
        const { lnd } = lightning.authenticatedLndGrpc(conf);
        this.lnd = lnd;
    }

    public getConfig(): LndAuthenticationWithMacaroon {
        const macaroon: LndAuthenticationWithMacaroon =
            this.configService.getConfig().lndConfig.macaroon;
        this.replaceWithLndDataDir(macaroon);
        return macaroon;
    }

    private readEnvCertFromFile() {
        const certFilePath = this.configService.getConfig().lndConfig.cert_file;
        if (certFilePath) return this.readFileBase64(certFilePath);
    }

    private readEnvMacaroonFromFile() {
        const macaroonFilePath = this.configService.getConfig().lndConfig.macaroon_file;
        if (macaroonFilePath) return this.readFileBase64(macaroonFilePath);
    }

    private replaceWithLndDataDir(macaroon: LndAuthenticationWithMacaroon): void {
        const envCert = this.readEnvCertFromFile();
        const envMac = this.readEnvMacaroonFromFile();
        macaroon.cert = envCert || macaroon.cert;
        macaroon.macaroon = envMac || macaroon.macaroon;
        if (this.configService.getConfig().lndConfig.macaroon.socket)
            macaroon.socket = this.configService.getConfig().lndConfig.macaroon.socket;
    }

    private readFileBase64(path: string | undefined): string | undefined {
        console.log('Attempting to read', path);
        if (!path) return undefined;
        try {
            return fs.readFileSync(path, { encoding: 'base64' });
        } catch (e) {
            console.warn(e);
        }
    }
}
