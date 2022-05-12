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
        const macaroon: LndAuthenticationWithMacaroon = this.configService.getConfig().macaroon;
        this.replaceWithLndDataDir(macaroon);
        return macaroon;
    }

    private replaceWithLndDataDir(macaroon: LndAuthenticationWithMacaroon): void {
        const envCert = this.readFileBase64(process.env.LND_CERT_FILE);
        const envMac = this.readFileBase64(process.env.LND_VIEW_MACAROON_FILE);

        macaroon.cert = envCert || macaroon.cert;
        macaroon.macaroon = envMac || macaroon.macaroon;
        if (process.env.LND_ADDRESS) macaroon.socket = process.env.LND_ADDRESS;
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
