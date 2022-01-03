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
        let cert = this.readCertFromFile();
        if (!cert) cert = config.get('macaroon.cert');

        let macaroon = this.readCertFromFile();
        if (!macaroon) macaroon = config.get('macaroon.macaroon');

        return {
            cert,
            macaroon,
            socket: this.getLndAddress(),
        };
    }

    private getLndAddress(): string {
        let address = process.env.LND_ADDRESS;
        if (!address) address = config.get('macaroon.socket');
        if (!address) throw new Error('Lightning address environment variable not set');
        return address;
    }

    private readCertFromFile(): string | undefined {
        const macaroonFile = process.env.LND_VIEW_MACAROON_FILE;
        if (!macaroonFile) return;
        return fs.readFileSync(macaroonFile, { encoding: 'base64' });
    }

    private readMacaroonFromFile(): string | undefined {
        const certFile = process.env.LND_CERT_FILE;
        if (!certFile) return;
        return fs.readFileSync(certFile, { encoding: 'base64' });
    }
}
