import { injectable } from 'inversify';
import fs from 'fs';
import { LndAuthenticationWithMacaroon } from 'lightning';

@injectable()
export class LndAuthService {
    private lndAuth: LndAuthenticationWithMacaroon | undefined;

    constructor() {
        this.lndAuth = this.getConfig();
    }

    public getConfig(): LndAuthenticationWithMacaroon {
        if (this.lndAuth) return this.lndAuth;
        return {
            cert: this.readCertFromFile(),
            macaroon: this.readMacaroonFromFile(),
            socket: process.env.LND_ADDRESS,
        };
    }

    private readCertFromFile(): string {
        const macaroonFile = process.env.LND_VIEW_MACAROON_FILE;
        if (!macaroonFile) throw new Error('Macaroon file environment variable not passed in');
        return fs.readFileSync(macaroonFile, { encoding: 'base64' });
    }

    private readMacaroonFromFile(): string {
        const certFile = process.env.LND_CERT_FILE;
        if (!certFile) throw new Error('Cert file environment variable not passed in');
        return fs.readFileSync(certFile, { encoding: 'base64' });
    }
}
