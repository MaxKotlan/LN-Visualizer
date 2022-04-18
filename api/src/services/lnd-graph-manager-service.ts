import { injectable } from 'inversify';
import * as lightning from 'lightning';
import { fromEvent, take } from 'rxjs';
import { GraphRegistryService } from './graph-registry.service';
import { LndAuthService } from './lnd-auth-service';
import { LndChunkTrackerService } from './lnd-chunk-tracker.service';
import { PositionCalculatorService } from './position-calculator.service';
import { WebSocketService } from './websocket-service';
import schedule from 'node-schedule';

@injectable()
export class LndGraphManagerService {
    constructor(
        private lndAuthService: LndAuthService,
        private chunkTrackerService: LndChunkTrackerService,
        private websocketService: WebSocketService,
        private positionCalculatorService: PositionCalculatorService,
        private graphRegistryService: GraphRegistryService,
    ) {}

    public async init() {
        await this.initialGraphSync();
        //await this.subscribeToGraphChanges();
        schedule.scheduleJob('0 0 * * *', () => this.initialGraphSync());
    }

    protected async initialGraphSync() {
        console.log('Starting Graph Sync');
        try {
            const graphState = await lightning.getNetworkGraph(
                this.lndAuthService.authenticatedLnd,
            );
            this.graphRegistryService.mapToRegistry(graphState);
            // console.log(this.graphRegistryService.channelMap)
            this.chunkTrackerService.calculateChunkInfo(graphState);
            this.positionCalculatorService.calculatePositions();
            console.log('Done with Graph Sync');
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
