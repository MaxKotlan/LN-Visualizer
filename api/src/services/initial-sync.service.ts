import { injectable } from 'inversify';
import { WebSocket } from 'ws';
import { Chunk, LndChannel, LndNode } from '../models';
import { GraphRegistryService } from './graph-registry.service';
import { LndChunkTrackerService } from './lnd-chunk-tracker.service';

@injectable()
export class InitialSyncService {
    constructor(
        private lndChunkTrackerService: LndChunkTrackerService,
        private graphRegistryService: GraphRegistryService,
    ) {}

    public sendChunkInfo(ws: WebSocket) {
        ws.send(JSON.stringify(this.lndChunkTrackerService.chunkInfo));
    }

    public performInitialNodeSync(ws: WebSocket) {
        if (!this.graphRegistryService.graphState) return;
        for (
            let i = 0;
            i <
            Math.ceil(
                this.graphRegistryService.graphState.nodes.length /
                    this.lndChunkTrackerService.chunkSize,
            );
            i++
        ) {
            const chunk: Chunk<LndNode> = {
                index: i,
                type: 'node',
                data: this.graphRegistryService.graphState.nodes.slice(
                    i * this.lndChunkTrackerService.chunkSize,
                    (i + 1) * this.lndChunkTrackerService.chunkSize,
                ),
                registry: {},
            };
            ws.send(JSON.stringify(chunk));
        }
    }

    public performInitialChannelSync(ws: WebSocket) {
        if (!this.graphRegistryService.graphState) return;
        for (
            let i = 0;
            i <
            Math.ceil(
                this.graphRegistryService.graphState.channels.length /
                    this.lndChunkTrackerService.chunkSize,
            );
            i++
        ) {
            const chunk: Chunk<LndChannel> = {
                index: i,
                type: 'channel',
                data: this.graphRegistryService.graphState.channels.slice(
                    i * this.lndChunkTrackerService.chunkSize,
                    (i + 1) * this.lndChunkTrackerService.chunkSize,
                ),
                registry: {},
            };
            ws.send(JSON.stringify(chunk));
        }
    }

    public sendRequestComplete(ws: WebSocket) {
        ws.send('requestComplete');
    }
}
