import { injectable } from 'inversify';
import { LndAuthService } from './lnd-auth-service';
import * as lightning from 'lightning';
import { fromEvent } from 'rxjs';
import { GetNetworkGraphResult } from 'lightning';
import { LndChunkTrackerService } from './lnd-chunk-tracker.service';
@injectable()
export class LndGraphStateService {
    constructor(
        private lndAuthService: LndAuthService,
        private chunkTrackerService: LndChunkTrackerService,
    ) {}

    public async init() {
        await this.initialGraphSync();

        //console.log('subscribing to events');
        //this.subscribeToGraphChanges();
    }

    protected async initialGraphSync() {
        console.log('Starting Graph Sync');
        const graphData: GetNetworkGraphResult = await lightning.getNetworkGraph(
            this.lndAuthService.authenticatedLnd,
        );
        this.chunkTrackerService.splitGraphIntoChunks(graphData);
        console.log('Done with Graph Sync');
    }

    protected subscribeToGraphChanges() {
        const graphEvents = lightning.subscribeToGraph(this.lndAuthService.authenticatedLnd);
        fromEvent(graphEvents, 'node_updated').subscribe((update) => {});
        fromEvent(graphEvents, 'channel_updated').subscribe((update) => console.log(update));
    }
}
