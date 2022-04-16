import { injectable } from 'inversify';
import { GetNetworkGraphResult } from 'lightning';
import { ChunkInfo } from '../models/chunkInfo.interface';

@injectable()
export class LndChunkTrackerService {
    public readonly chunkSize: number = 4096;

    public chunkInfo: ChunkInfo | null = null;

    public calculateChunkInfo(graph: GetNetworkGraphResult) {
        this.chunkInfo = {
            nodes: graph.nodes.length,
            edges: graph.channels.length,
            nodeChunks: Math.ceil(graph.nodes.length / this.chunkSize),
            edgeChunks: Math.ceil(graph.channels.length / this.chunkSize),
            type: 'chunkInfo',
        } as ChunkInfo;
        console.log('CHUNK INFO:', this.chunkInfo);
    }
}
