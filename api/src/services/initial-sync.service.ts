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

    public performInitialNodeSync(ws: WebSocket, startIndex = 0) {
        const nodes: Array<any> = this.graphRegistryService.nodeArray;
        for (
            let i = startIndex;
            i < Math.ceil(nodes.length / this.lndChunkTrackerService.chunkSize);
            i++
        ) {
            const chunk: Chunk<LndNode> = {
                index: i,
                type: 'node',
                data: nodes.slice(
                    i * this.lndChunkTrackerService.chunkSize,
                    (i + 1) * this.lndChunkTrackerService.chunkSize,
                ),
                registry: {},
            };
            ws.send(JSON.stringify(chunk));
        }
    }

    public performInitialChannelSync(ws: WebSocket, startIndex = 0) {
        const channels: Array<any> = this.graphRegistryService.channelArray;
        for (
            let i = startIndex;
            i < Math.ceil(channels.length / this.lndChunkTrackerService.chunkSize);
            i++
        ) {
            const chunk: Chunk<LndChannel> = {
                index: i,
                type: 'channel',
                data: channels.slice(
                    i * this.lndChunkTrackerService.chunkSize,
                    (i + 1) * this.lndChunkTrackerService.chunkSize,
                ),
                registry: {},
            };
            ws.send(JSON.stringify(chunk));
        }
    }

    public sendRequestComplete(ws: WebSocket) {
        ws.send(JSON.stringify({ type: 'requestComplete' }));
    }
}
