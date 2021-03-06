import { injectable } from 'inversify';
import * as lightning from 'lightning';
import schedule from 'node-schedule';
import { fromEvent } from 'rxjs';
import { Worker } from 'worker_threads';
import { BenchmarkDataGeneratorService } from './benchmark-data-generator.service';
import { ConfigService } from './config.service';
import { GraphRegistryService } from './graph-registry.service';
import { HealthCheckServerService } from './health-check-server';
import { LndAuthService } from './lnd-auth-service';
import { LndChunkTrackerService } from './lnd-chunk-tracker.service';
import { ServerStatusService } from './server-status.service';

@injectable()
export class LndGraphManagerService {
    constructor(
        private lndAuthService: LndAuthService,
        private chunkTrackerService: LndChunkTrackerService,
        private graphRegistryService: GraphRegistryService,
        private serverStatusService: ServerStatusService,
        private configService: ConfigService,
        private benchmarkDataGeneratorService: BenchmarkDataGeneratorService,
    ) {}

    public async init() {
        await this.graphSync(true);
        schedule.scheduleJob(this.configService.getConfig().resyncTimer, () =>
            this.graphSync(true),
        );
    }

    protected async getLightningData() {
        if (this.configService.getConfig().benchmarkMode.enabled) {
            return await this.benchmarkDataGeneratorService.getNetworkGraph();
        }
        return await lightning.getNetworkGraph(this.lndAuthService.authenticatedLnd);
    }

    protected async graphSync(isInitialSync: boolean) {
        if (isInitialSync) console.log('Starting Graph Sync');
        try {
            const graphState = await this.getLightningData();
            this.graphRegistryService.mapToRegistry(graphState);
            this.chunkTrackerService.calculateChunkInfo(graphState);
            if (isInitialSync) console.log('CHUNK INFO:', this.chunkTrackerService.chunkInfo);
            if (isInitialSync) this.serverStatusService.startCalculatingPositions();
            this.createPositionThread(isInitialSync);
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }

    protected createPositionThread(isInitialSync: boolean) {
        const workerFile = './build/position-calculator.js'; //'./build/position-calculator.js';

        const worker = new Worker(workerFile, {
            workerData: { graphRegistryService: this.graphRegistryService },
        });
        worker.on('message', (msg) => {
            this.graphRegistryService.updateFromWorkerThread(msg);
            if (isInitialSync) this.serverStatusService.readyToDownload();
            if (isInitialSync) console.log('Done with Graph Sync');
            else console.log('Graph resynced');
        });
        worker.on('error', (msg) => {
            console.log(msg);
        });
    }

    protected subscribeToGraphChanges() {
        const graphEvents = lightning.subscribeToGraph(this.lndAuthService.authenticatedLnd);
        //fromEvent(graphEvents, 'node_updated').subscribe((update) => {});
        //fromEvent(graphEvents, 'channel_updated').subscribe((update) => console.log(update));
        fromEvent(graphEvents, 'channel_closed').subscribe(async (event) => {
            // console.log(`${(event as any)?.id} channel closed`);
        });
        fromEvent(graphEvents, 'channel_updated').subscribe(async (event) => {
            console.log(`${(event as any)?.id} channel updated`);
            console.log('ev', event);
            const ch = this.graphRegistryService.channelMap[(event as any)?.id];
            console.log('ch', ch);
            console.log(this.graphRegistryService.channelMap.get(`${(event as any)?.id}`));

            // this.websocketService.channelUpdated(`${(event as any)?.id}`);
        });
        fromEvent(graphEvents, 'node_updated').subscribe(async (event) => {
            // console.log('node updated', event);
        });
    }
}
