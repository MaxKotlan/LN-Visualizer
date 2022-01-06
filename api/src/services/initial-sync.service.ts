import { injectable } from 'inversify';
import { WebSocket } from 'ws';
import { Chunk, LndChannel, LndNode } from '../models';
import { LndChunkTrackerService } from './lnd-chunk-tracker.service';

@injectable()
export class InitialSyncService {
    constructor(private lndChunkTrackerService: LndChunkTrackerService) {}

    public sendChunkInfo(ws: WebSocket) {
        ws.send(JSON.stringify(this.lndChunkTrackerService.chunkInfo));
    }

    public performInitialNodeSync(ws: WebSocket) {
        this.lndChunkTrackerService.nodeChunks.forEach(async (chunk: Chunk<LndNode>) => {
            ws.send(
                JSON.stringify({
                    index: chunk.index,
                    type: chunk.type,
                    data: chunk.data.map(
                        (node) =>
                            ({
                                color: node.color,
                                public_key: node.public_key,
                                alias: node.alias,
                            } as Partial<LndNode>),
                    ),
                } as Partial<Chunk<LndNode>>),
            );
        });
    }

    public performInitialChannelSync(ws: WebSocket) {
        this.lndChunkTrackerService.channelChunks.forEach(async (chunk) => {
            ws.send(
                JSON.stringify({
                    index: chunk.index,
                    type: chunk.type,
                    data: chunk.data.map(
                        (channel) =>
                            ({
                                capacity: channel.capacity,
                                policies: channel.policies,
                            } as Partial<LndChannel>),
                    ),
                } as Partial<Chunk<LndChannel>>),
            );
        });
    }
}
