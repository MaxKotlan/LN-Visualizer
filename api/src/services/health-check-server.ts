import { injectable } from 'inversify';

import express from 'express';
import { ConfigService, PodStatusServer } from './config.service';

@injectable()
export class HealthCheckServerService {
    private podStatusConfig: PodStatusServer = {
        enabled: false,
        port: 3000,
    };

    constructor(private app = express(), private configService: ConfigService) {
        this.init();
    }

    private init() {
        if (!this.podStatusConfig.enabled) return;
        this.healthCheck();
        this.app.listen(this.podStatusConfig.port, () => {
            console.log(`Pod status server on port ${this.podStatusConfig.port}`);
        });
    }

    public healthCheck() {
        if (!this.podStatusConfig.enabled) return;
        this.app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));
    }

    public isReady() {
        if (!this.podStatusConfig.enabled) return;
        console.log('ready check enabled');
        this.app.get('/readyz', (req, res) => res.status(200).json({ status: 'ok' }));
    }

    public isLivez() {
        if (!this.podStatusConfig.enabled) return;
        this.app.get('/livez', (req, res) => res.status(200).json({ status: 'ok' }));
    }
}
