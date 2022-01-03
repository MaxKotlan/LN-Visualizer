import { injectable } from 'inversify';
import fs from 'fs';
import { AuthenticatedLnd, LndAuthenticationWithMacaroon } from 'lightning';
import * as lightning from 'lightning';

@injectable()
export class LndAuthService {
    public get authenticatedLnd() {
        return this.lnd;
    }

    private lnd: AuthenticatedLnd;

    constructor() {
        const config = this.getConfig();
        const { lnd } = lightning.authenticatedLndGrpc(config);
        this.lnd = lnd;
    }

    public getConfig(): LndAuthenticationWithMacaroon {
        return {
            cert: this.readCertFromFile(),
            macaroon: this.readMacaroonFromFile(),
            socket: this.getLndAddress(),
        };
    }

    private getLndAddress(): string {
        const address = process.env.LND_ADDRESS;
        if (!address) throw new Error('Lightning address environment variable not set');
        return address;
    }

    private readCertFromFile(): string {
        const macaroonFile = process.env.LND_VIEW_MACAROON_FILE;
        if (!macaroonFile) throw new Error('Macaroon file environment variable not set');
        return fs.readFileSync(macaroonFile, { encoding: 'base64' });
    }

    private readMacaroonFromFile(): string {
        const certFile = process.env.LND_CERT_FILE;
        if (!certFile) throw new Error('Cert file environment variable not set');
        return fs.readFileSync(certFile, { encoding: 'base64' });
    }
}
