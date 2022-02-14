import { injectable } from 'inversify';
import fs from 'fs';
import { AuthenticatedLnd, LndAuthenticationWithMacaroon } from 'lightning';
import * as lightning from 'lightning';
import config from 'config';

@injectable()
export class LndAuthService {
    public get authenticatedLnd() {
        return { lnd: this.lnd };
    }

    private lnd: AuthenticatedLnd;

    constructor() {
        const conf = this.getConfig();
        const { lnd } = lightning.authenticatedLndGrpc(conf);
        this.lnd = lnd;
    }

    public getConfig(): LndAuthenticationWithMacaroon {
        const macaroon: LndAuthenticationWithMacaroon = config.get('macaroon');
        this.replaceWithLndDataDir(macaroon);
        return macaroon;
    }

    private replaceWithLndDataDir(macaroon: LndAuthenticationWithMacaroon): void {
        this.readFileBase64(process.env.LND_CERT_FILE, macaroon.cert);
        this.readFileBase64(process.env.LND_VIEW_MACAROON_FILE, macaroon.macaroon);

        if (process.env.LND_ADDRESS) macaroon.socket = process.env.LND_ADDRESS;
    }

    private readFileBase64(path: string | undefined, output: string | undefined): void {
        if (!path || !output) return;
        output = fs.readFileSync(path, { encoding: 'base64' });
    }
}
