import { injectable } from 'inversify';
import { LndAuthService } from './lnd-auth-service';
import * as lightning from 'lightning';
import { fromEvent } from 'rxjs';
import { GetNetworkGraphResult } from 'lightning';
import { LndChunkTrackerService } from './lnd-chunk-tracker.service';
import { WebSocketService } from './websocket-service';

@injectable()
export class LndGraphStateService {
    constructor(
        private lndAuthService: LndAuthService,
        private chunkTrackerService: LndChunkTrackerService,
        private websocketService: WebSocketService,
    ) {}

    public async init() {
        await this.initialGraphSync();
        this.subscribeToGraphChanges();
    }

    protected async initialGraphSync() {
        console.log('Starting Graph Sync');
        try {
            const graphData: GetNetworkGraphResult = await lightning.getNetworkGraph(
                this.lndAuthService.authenticatedLnd,
            );
            this.chunkTrackerService.splitGraphIntoChunks(graphData);
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
            console.log('channel closed', event);
            await this.initialGraphSync();
        });
        fromEvent(graphEvents, 'channel_updated').subscribe(async (event) => {
            console.log('channel updated', event);
            await this.initialGraphSync();
        });
        fromEvent(graphEvents, 'node_updated').subscribe(async (event) => {
            console.log('node updated', event);
            await this.initialGraphSync();
        });
    }
}
