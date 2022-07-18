import { injectable } from 'inversify';
import { GetNetworkGraphResult } from 'lightning';
import { ChunkInfo } from '../models/chunkInfo.interface';
import { ConfigService } from './config.service';

@injectable()
export class LndChunkTrackerService {
    public chunkSize: number;
    public chunkInfo: ChunkInfo | null = null;

    constructor(config: ConfigService) {
        this.chunkSize = config.getConfig().initSyncChunkSize;
    }

    public calculateChunkInfo(graph: GetNetworkGraphResult) {
        this.chunkInfo = {
            nodes: graph.nodes.length,
            edges: graph.channels.length,
            nodeChunks: Math.ceil(graph.nodes.length / this.chunkSize),
            edgeChunks: Math.ceil(graph.channels.length / this.chunkSize),
            type: 'chunkInfo',
        } as ChunkInfo;
    }
}
