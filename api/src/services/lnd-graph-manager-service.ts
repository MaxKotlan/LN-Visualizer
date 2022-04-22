import { injectable } from 'inversify';
import * as lightning from 'lightning';
import schedule from 'node-schedule';
import { fromEvent } from 'rxjs';
import { GraphRegistryService } from './graph-registry.service';
import { LndAuthService } from './lnd-auth-service';
import { LndChunkTrackerService } from './lnd-chunk-tracker.service';
import { FastPositionAlgorithm } from './position-calculator.service';
import { RandomPositionAlgorithm } from './random-position.service';

@injectable()
export class LndGraphManagerService {
    constructor(
        private lndAuthService: LndAuthService,
        private chunkTrackerService: LndChunkTrackerService,
        private positionAlgorithm: RandomPositionAlgorithm,
        private graphRegistryService: GraphRegistryService,
    ) {}

    public async init() {
        await this.graphSync(true);
        schedule.scheduleJob('0 0 * * *', () => this.graphSync(false));
    }

    protected async graphSync(isInitialSync: boolean) {
        if (isInitialSync) console.log('Starting Graph Sync');
        try {
            const graphState = await lightning.getNetworkGraph(
                this.lndAuthService.authenticatedLnd,
            );
            this.graphRegistryService.mapToRegistry(graphState);
            // console.log(this.graphRegistryService.channelMap)
            this.chunkTrackerService.calculateChunkInfo(graphState);
            if (isInitialSync) console.log('CHUNK INFO:', this.chunkTrackerService.chunkInfo);
            this.positionAlgorithm.calculatePositions();
            if (isInitialSync) console.log('Done with Graph Sync');
            else console.log('Graph resynced');
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
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
