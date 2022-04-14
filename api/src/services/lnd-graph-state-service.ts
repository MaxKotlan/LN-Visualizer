import { injectable } from 'inversify';
import * as lightning from 'lightning';
import { fromEvent } from 'rxjs';
import { GraphRegistryService } from './graph-registry.service';
import { LndAuthService } from './lnd-auth-service';
import { LndChunkTrackerService } from './lnd-chunk-tracker.service';
import { PositionCalculatorService } from './position-calculator.service';
import { WebSocketService } from './websocket-service';

@injectable()
export class LndGraphStateService {
    constructor(
        private lndAuthService: LndAuthService,
        private chunkTrackerService: LndChunkTrackerService,
        private websocketService: WebSocketService,
        private positionCalculatorService: PositionCalculatorService,
        private graphRegistryService: GraphRegistryService,
    ) {}

    public async init() {
        await this.initialGraphSync();
    }

    protected async initialGraphSync() {
        console.log('Starting Graph Sync');
        try {
            this.graphRegistryService.graphState = await lightning.getNetworkGraph(
                this.lndAuthService.authenticatedLnd,
            );
            this.chunkTrackerService.calculateChunkInfo(this.graphRegistryService.graphState);
            this.positionCalculatorService.calculatePositions(this.graphRegistryService.graphState);
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
            console.log(`${(event as any)?.id} channel closed`);
            //await this.initialGraphSync();
        });
        fromEvent(graphEvents, 'channel_updated').subscribe(async (event) => {
            // console.log(`${(event as any)?.id} channel updated`);
            this.websocketService.channelUpdated(`${(event as any)?.id}`);
            //await this.initialGraphSync();
        });
        fromEvent(graphEvents, 'node_updated').subscribe(async (event) => {
            console.log('node updated', event);
            //await this.initialGraphSync();
        });
    }
}
